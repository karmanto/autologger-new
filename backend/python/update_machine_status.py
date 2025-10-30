from gpiozero import Button, LED
import time
import board
import busio
import digitalio
from adafruit_mcp230xx.mcp23017 import MCP23017
import mysql.connector
from datetime import datetime, timedelta
import sys
import os
import signal
from dotenv import load_dotenv

# Load konfigurasi dari file .env
load_dotenv()

# Konfigurasi database dari environment variables
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME'),
    'port': int(os.getenv('DB_PORT', 3306))
}

# Konfigurasi GPIO dari environment variables
gpio_pins_str = os.getenv('GPIO_PINS', '5,6,7,8,9,10,11,12,13,27,25,16,17,18,19,20,21,22')
pins = [int(pin.strip()) for pin in gpio_pins_str.split(',')]

# Konfigurasi MCP23017 dari environment variables
mcp_addresses_str = os.getenv('MCP_ADDRESSES', '0x20,0x21,0x22')
mcp_addresses = [int(addr.strip(), 16) for addr in mcp_addresses_str.split(',')]

# Konfigurasi debounce
DEBOUNCE_DELAY = float(os.getenv('DEBOUNCE_DELAY', 0.5))

# Konfigurasi heartbeat
HEARTBEAT_INTERVAL = int(os.getenv('HEARTBEAT_INTERVAL', 30))  # detik
PROCESS_NAME = "machine_monitor"

# Konfigurasi LED
LED_PIN = 23
LED_BLINK_INTERVAL = 0.5  # detik

def validate_config():
    """Validasi konfigurasi yang diperlukan"""
    required_vars = ['DB_USER', 'DB_PASSWORD', 'DB_NAME']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: Environment variables berikut tidak ditemukan: {', '.join(missing_vars)}")
        print("Pastikan file .env sudah dibuat dan berisi konfigurasi yang diperlukan.")
        sys.exit(1)
    
    print("Konfigurasi berhasil dimuat:")
    print(f"Database: {db_config['database']}@{db_config['host']}:{db_config['port']}")
    print(f"GPIO Pins: {pins}")
    print(f"MCP Addresses: {[hex(addr) for addr in mcp_addresses]}")
    print(f"Debounce Delay: {DEBOUNCE_DELAY}")
    print(f"LED Pin: {LED_PIN} dengan interval blink {LED_BLINK_INTERVAL} detik")

def get_db_connection():
    """Membuat koneksi ke database"""
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

def get_machine_defs():
    """Mengambil data mesin dari database"""
    connection = get_db_connection()
    if not connection:
        return []
        
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT id, name, status FROM machine_defs ORDER BY id")
        machines = cursor.fetchall()
        return machines
    except mysql.connector.Error as err:
        print(f"Error fetching machine definitions: {err}")
        return []
    finally:
        cursor.close()
        connection.close()

def save_machine_status(machine_def_id, running_status, recorded_at=None):
    """Menyimpan status mesin ke database"""
    if recorded_at is None:
        recorded_at = datetime.now()
    
    connection = get_db_connection()
    if not connection:
        print(f"Failed to save status for machine {machine_def_id} - No database connection")
        return
        
    cursor = connection.cursor()
    
    try:
        query = """
        INSERT INTO machine_statuses (machine_def_id, running_status, recorded_at) 
        VALUES (%s, %s, %s)
        """
        cursor.execute(query, (machine_def_id, running_status, recorded_at))
        connection.commit()
        print(f"Status saved - Machine ID: {machine_def_id}, Status: {running_status}, Time: {recorded_at}")
    except mysql.connector.Error as err:
        print(f"Error saving machine status: {err}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()

def update_heartbeat():
    """Update atau buat heartbeat record"""
    connection = get_db_connection()
    if not connection:
        return False
        
    cursor = connection.cursor()
    
    try:
        # Cek apakah sudah ada heartbeat untuk process ini
        check_query = "SELECT id FROM heartbeats WHERE process_name = %s"
        cursor.execute(check_query, (PROCESS_NAME,))
        result = cursor.fetchone()
        
        current_time = datetime.now()
        
        if result:
            # Update existing heartbeat
            update_query = """
            UPDATE heartbeats 
            SET last_heartbeat = %s, is_running = TRUE, updated_at = %s 
            WHERE process_name = %s
            """
            cursor.execute(update_query, (current_time, current_time, PROCESS_NAME))
        else:
            # Insert new heartbeat
            insert_query = """
            INSERT INTO heartbeats (process_name, last_heartbeat, is_running, created_at, updated_at)
            VALUES (%s, %s, TRUE, %s, %s)
            """
            cursor.execute(insert_query, (PROCESS_NAME, current_time, current_time, current_time))
        
        connection.commit()
        return True
    except mysql.connector.Error as err:
        print(f"Error updating heartbeat: {err}")
        connection.rollback()
        return False
    finally:
        cursor.close()
        connection.close()

def mark_process_stopped():
    """Tandai process sebagai berhenti"""
    connection = get_db_connection()
    if not connection:
        return False
        
    cursor = connection.cursor()
    
    try:
        update_query = "UPDATE heartbeats SET is_running = FALSE, updated_at = %s WHERE process_name = %s"
        cursor.execute(update_query, (datetime.now(), PROCESS_NAME))
        connection.commit()
        return True
    except mysql.connector.Error as err:
        print(f"Error marking process stopped: {err}")
        connection.rollback()
        return False
    finally:
        cursor.close()
        connection.close()

def check_rtc_anomaly():
    """Cek apakah ada anomali RTC (waktu heartbeat lebih maju dari waktu sekarang)"""
    connection = get_db_connection()
    if not connection:
        return False
        
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Cek heartbeat terakhir
        query = "SELECT last_heartbeat FROM heartbeats WHERE process_name = %s"
        cursor.execute(query, (PROCESS_NAME,))
        result = cursor.fetchone()
        
        if result:
            last_heartbeat = result['last_heartbeat']
            current_time = datetime.now()
            
            # Jika waktu heartbeat lebih maju dari waktu sekarang (anomali RTC)
            if last_heartbeat > current_time:
                print(f"⚠️  DETECTED RTC ANOMALY!")
                print(f"   Waktu heartbeat terakhir: {last_heartbeat}")
                print(f"   Waktu sistem sekarang: {current_time}")
                print(f"   Selisih: {(last_heartbeat - current_time).total_seconds()} detik")
                print("   Melakukan shutdown normal karena RTC bermasalah...")
                return True
        return False
    except mysql.connector.Error as err:
        print(f"Error checking RTC anomaly: {err}")
        return False
    finally:
        cursor.close()
        connection.close()

def check_previous_crash():
    """Cek apakah program sebelumnya mati tiba-tiba dan catat status 0 jika iya"""
    connection = get_db_connection()
    if not connection:
        return False
        
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Cek heartbeat terakhir
        query = "SELECT last_heartbeat FROM heartbeats WHERE process_name = %s AND is_running = TRUE"
        cursor.execute(query, (PROCESS_NAME,))
        result = cursor.fetchone()
        
        if result:
            last_heartbeat = result['last_heartbeat']
            time_diff = datetime.now() - last_heartbeat
            
            # Jika terakhir heartbeat lebih dari 2x interval, dianggap crash
            if time_diff.total_seconds() > HEARTBEAT_INTERVAL * 2:
                print(f"Deteksi sistem sebelumnya mati tiba-tiba!")
                print(f"Terakhir heartbeat: {last_heartbeat}")
                print("Mencatat semua mesin status 0 pada waktu terakhir heartbeat...")
                
                # Dapatkan semua mesin
                machines = get_machine_defs()
                if machines:
                    for machine in machines:
                        save_machine_status(machine['id'], 0, last_heartbeat)
                
                return True
        return False
    except mysql.connector.Error as err:
        print(f"Error checking previous crash: {err}")
        return False
    finally:
        cursor.close()
        connection.close()

def initialize_machine_status():
    """Menginisialisasi status mesin berdasarkan kondisi hardware saat ini"""
    machines = get_machine_defs()
    if not machines:
        print("No machine definitions found!")
        return
    
    print("Initializing machine status based on current hardware state...")
    
    # Baca status awal dari GPIO
    for i, pin in enumerate(pins):
        if i < len(machines):
            machine = machines[i]
            initial_state = 1 if buttons[i].is_pressed else 0
            save_machine_status(machine['id'], initial_state)
            print(f"GPIO Machine {machine['name']} (Pin {pin}) initialized to {initial_state}")
    
    # Baca status awal dari MCP23017
    mcp_index = 0
    for pin_info in mcp_pins:
        machine_index = len(pins) + mcp_index
        if machine_index < len(machines):
            machine = machines[machine_index]
            try:
                current_state = pin_info['pin'].value
                running_status = 0 if current_state else 1
                save_machine_status(machine['id'], running_status)
                print(f"MCP Machine {machine['name']} (Pin {mcp_index}) initialized to {running_status}")
            except OSError:
                print(f"Error reading MCP pin for machine {machine['name']}")
                save_machine_status(machine['id'], 2)  # Error state
        mcp_index += 1

def cleanup():
    """Cleanup function yang dipanggil saat program berhenti"""
    print("\nCleaning up...")
    print("Menandai semua mesin sebagai berhenti...")
    
    # Dapatkan semua mesin
    machines = get_machine_defs()
    if machines:
        current_time = datetime.now()
        for machine in machines:
            save_machine_status(machine['id'], 0, current_time)
    
    # Matikan LED sebelum berhenti
    if 'status_led' in globals() and status_led is not None:
        status_led.off()
        print("LED dimatikan")
    
    # Tandai process sebagai berhenti
    mark_process_stopped()
    print("Cleanup completed. Program berhenti.")

def signal_handler(signum, frame):
    """Handle signals untuk graceful shutdown"""
    print(f"\nReceived signal {signum}. Shutting down gracefully...")
    cleanup()
    sys.exit(0)

# HANYA register signal handlers (HAPUS atexit.register)
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# Validasi konfigurasi sebelum memulai
validate_config()

# CEK RTC ANOMALY TERLEBIH DAHULU - jika ada anomali, langsung shutdown normal
if check_rtc_anomaly():
    cleanup()
    sys.exit(1)

# Cek apakah sebelumnya ada crash
check_previous_crash()

# Inisialisasi heartbeat pertama
update_heartbeat()

# Inisialisasi LED status
try:
    status_led = LED(LED_PIN)
    status_led.off()  # Pastikan LED mati di awal
    print(f"Status LED initialized on pin {LED_PIN}")
except Exception as e:
    print(f"Error initializing status LED on pin {LED_PIN}: {e}")
    status_led = None

# Inisialisasi GPIO buttons
buttons = []
for pin in pins:
    try:
        btn = Button(pin, pull_up=True, bounce_time=0.5)
        buttons.append(btn)
        print(f"GPIO button initialized on pin {pin}")
    except Exception as e:
        print(f"Error initializing GPIO pin {pin}: {e}")
        buttons.append(None)  # Placeholder untuk pin yang gagal

# Inisialisasi MCP23017
i2c = None
mcp_devices = []
mcp_pins = []

try:
    i2c = busio.I2C(board.SCL, board.SDA)
    print("I2C bus initialized successfully")
except Exception as e:
    print(f"Error initializing I2C bus: {e}")
    i2c = None

if i2c:
    for addr in mcp_addresses:
        try:
            mcp = MCP23017(i2c, address=addr)
            mcp_devices.append(mcp)
            print(f"MCP23017 found at address {hex(addr)}")
        except Exception as e:
            print(f"MCP23017 not found at address {hex(addr)}: {e}")
            continue

    # Inisialisasi MCP pins
    pin_index = 0
    for mcp in mcp_devices:
        for pin_num in range(16):
            try:
                pin = mcp.get_pin(pin_num)
                pin.direction = digitalio.Direction.INPUT
                pin.pull = digitalio.Pull.UP
                
                mcp_pins.append({
                    'pin': pin,
                    'index': pin_index,
                    'last_state': None,
                    'last_debounce_time': 0,
                    'device_addr': hex(id(mcp)),
                    'pin_num': pin_num
                })
                pin_index += 1
            except Exception as e:
                print(f"Error initializing MCP pin {pin_num} on device {hex(id(mcp))}: {e}")
                continue

print(f"Total GPIO pins: {len(pins)}")
print(f"Total MCP pins: {len(mcp_pins)}")

# Dapatkan data mesin dari database
machines = get_machine_defs()
if not machines:
    print("Error: No machines found in database!")
    sys.exit(1)

print(f"Total machines in database: {len(machines)}")

# Inisialisasi status mesin
initialize_machine_status()

def create_gpio_callback(machine_id, machine_name, index):
    """Membuat callback function untuk GPIO buttons"""
    def pressed():
        print(f"{machine_name} Ditekan! (State: LOW)")
        save_machine_status(machine_id, 1)
    
    def released():
        print(f"{machine_name} Dilepas! (State: HIGH)")
        save_machine_status(machine_id, 0)
    
    return pressed, released

# Setup GPIO button callbacks
for i, btn in enumerate(buttons):
    if i < len(machines) and btn is not None:
        machine = machines[i]
        pressed_func, released_func = create_gpio_callback(
            machine['id'], machine['name'], i
        )
        btn.when_pressed = pressed_func
        btn.when_released = released_func
        print(f"GPIO callback set for {machine['name']} on pin {pins[i]}")
    elif btn is None:
        print(f"Warning: GPIO pin {pins[i]} tidak dapat diinisialisasi, callback tidak diset")

print("Starting main loop...")

last_heartbeat_time = time.time()
last_led_toggle_time = time.time()
led_state = False

try:
    while True:
        current_time = time.time()
        
        # Update heartbeat secara periodic
        if current_time - last_heartbeat_time >= HEARTBEAT_INTERVAL:
            if update_heartbeat():
                print(f"Heartbeat updated at {datetime.now()}")
            last_heartbeat_time = current_time
        
        # Kontrol LED flip-flop
        if current_time - last_led_toggle_time >= LED_BLINK_INTERVAL:
            if status_led is not None:
                led_state = not led_state
                if led_state:
                    status_led.on()
                else:
                    status_led.off()
                last_led_toggle_time = current_time
        
        # Monitor MCP23017 pins
        for pin_info in mcp_pins:
            machine_index = len(pins) + pin_info['index']
            if machine_index >= len(machines):
                continue
                
            machine = machines[machine_index]
            
            try:
                current_state = pin_info['pin'].value
            except OSError:
                print(f"OSError reading MCP pin for {machine['name']}")
                continue

            # Debounce logic
            if current_state != pin_info['last_state']:
                pin_info['last_debounce_time'] = current_time
                pin_info['last_state'] = current_state

            elif (current_time - pin_info['last_debounce_time']) > DEBOUNCE_DELAY:
                if current_state != pin_info.get('last_fired_state', None):
                    if current_state == False:  # Button pressed
                        print(f"{machine['name']} Ditekan! (State: LOW)")
                        save_machine_status(machine['id'], 1)
                    else:  # Button released
                        print(f"{machine['name']} Dilepas! (State: HIGH)")
                        save_machine_status(machine['id'], 0)
                    
                    pin_info['last_fired_state'] = current_state

        time.sleep(0.05)

except KeyboardInterrupt:
    print("Program dihentikan oleh user.")
    cleanup()
except Exception as e:
    print(f"Unexpected error: {e}")
    cleanup()