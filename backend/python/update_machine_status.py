from gpiozero import Button
import time
import board
import busio
import digitalio
from adafruit_mcp230xx.mcp23017 import MCP23017
import mysql.connector
from datetime import datetime
import sys
import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME'),
    'port': int(os.getenv('DB_PORT', 3306))
}

gpio_pins_str = os.getenv('GPIO_PINS', '5,6,7,8,9,10,11,12,13,27,25,16,17,18,19,20,21,22')
pins = [int(pin.strip()) for pin in gpio_pins_str.split(',')]

mcp_addresses_str = os.getenv('MCP_ADDRESSES', '0x20,0x21,0x22')
mcp_addresses = [int(addr.strip(), 16) for addr in mcp_addresses_str.split(',')]

DEBOUNCE_DELAY = float(os.getenv('DEBOUNCE_DELAY', 0.5))

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

def save_machine_status(machine_def_id, running_status):
    """Menyimpan status mesin ke database"""
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
        current_time = datetime.now()
        cursor.execute(query, (machine_def_id, running_status, current_time))
        connection.commit()
        print(f"Status saved - Machine ID: {machine_def_id}, Status: {running_status}")
    except mysql.connector.Error as err:
        print(f"Error saving machine status: {err}")
        connection.rollback()
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
    
    for i, pin in enumerate(pins):
        if i < len(machines):
            machine = machines[i]
            initial_state = 1 if buttons[i].is_pressed else 0
            save_machine_status(machine['id'], initial_state)
            print(f"GPIO Machine {machine['name']} (Pin {pin}) initialized to {initial_state}")
    
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
                save_machine_status(machine['id'], 2)  
        mcp_index += 1

validate_config()

buttons = []
for pin in pins:
    try:
        btn = Button(pin, pull_up=True, bounce_time=0.5)
        buttons.append(btn)
        print(f"GPIO button initialized on pin {pin}")
    except Exception as e:
        print(f"Error initializing GPIO pin {pin}: {e}")
        buttons.append(None)  

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

machines = get_machine_defs()
if not machines:
    print("Error: No machines found in database!")
    sys.exit(1)

print(f"Total machines in database: {len(machines)}")

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

try:
    while True:
        current_time = time.time()
        
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

            if current_state != pin_info['last_state']:
                pin_info['last_debounce_time'] = current_time
                pin_info['last_state'] = current_state

            elif (current_time - pin_info['last_debounce_time']) > DEBOUNCE_DELAY:
                if current_state != pin_info.get('last_fired_state', None):
                    if current_state == False:  
                        print(f"{machine['name']} Ditekan! (State: LOW)")
                        save_machine_status(machine['id'], 1)
                    else:  
                        print(f"{machine['name']} Dilepas! (State: HIGH)")
                        save_machine_status(machine['id'], 0)
                    
                    pin_info['last_fired_state'] = current_state

        time.sleep(0.05)

except KeyboardInterrupt:
    print("Program dihentikan.")
except Exception as e:
    print(f"Unexpected error: {e}")