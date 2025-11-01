from gpiozero import Button, LED
import time
import board
import busio
import digitalio
from adafruit_mcp230xx.mcp23017 import MCP23017
import mysql.connector
from datetime import datetime, timedelta, timezone
import sys
import os
import signal
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

HEARTBEAT_INTERVAL = int(os.getenv('HEARTBEAT_INTERVAL', 10))
PROCESS_NAME = "machine_monitor"

LED_PIN = 23
LED_BLINK_INTERVAL = 0.5

RUNHOUR_UPDATE_INTERVAL = int(os.getenv('RUNHOUR_UPDATE_INTERVAL', 10))


class RunHourCalculator:
    def __init__(self):
        self.machine_states = {}
        self.last_runhour_update = time.time()
        self.initialize_machine_states()

    def initialize_machine_states(self):
        connection = self.get_db_connection()
        if not connection:
            print("Failed to connect to database during initialization.")
            return

        cursor = connection.cursor(dictionary=True)

        try:
            query = """
            SELECT * FROM machine_defs
            """
            cursor.execute(query)
            db_machines = cursor.fetchall()

            for machine in db_machines:
                last_change_timestamp = machine['last_status_change'].timestamp() if machine['last_status_change'] else time.time()
                self.machine_states[machine['id']] = {
                    'last_status': bool(machine['last_running_status']),
                    'last_update': last_change_timestamp,
                    'current_run_hour': float(machine['run_hour']) if machine['run_hour'] is not None else 0.0
                }
            print(f"Initialized {len(self.machine_states)} machine states from database.")

        except mysql.connector.Error as err:
            print(f"Error initializing machine states from DB: {err}")
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def get_db_connection(self):
        try:
            connection = mysql.connector.connect(**db_config)
            return connection
        except mysql.connector.Error as err:
            print(f"Error connecting to database: {err}")
            return None

    def update_machine_status(self, machine_id, new_status, status_time=None):
        if status_time is None:
            status_time = time.time()

        if machine_id not in self.machine_states:
            self.machine_states[machine_id] = {
                'last_status': False,
                'last_update': status_time,
                'current_run_hour': 0.0
            }

        current_state = self.machine_states[machine_id]

        if new_status != current_state['last_status']:
            time_diff = status_time - current_state['last_update']

            print(
                f"DEBUG: Machine {machine_id} - status_time: {status_time}, current_state['last_update']: {current_state['last_update']}"
            )

            if current_state['last_status']:
                current_state['current_run_hour'] += time_diff
                print(
                    f"Machine {machine_id} stopped. Added {time_diff:.2f} seconds. "
                    f"Total Run Hour: {current_state['current_run_hour']:.2f}s"
                )

            current_state['last_status'] = new_status
            current_state['last_update'] = status_time

            self._update_database_runhour(
                machine_id, current_state['current_run_hour'], new_status, status_time, include_status_change=True
            )

    def periodic_runhour_update(self):
        current_time = time.time()

        if current_time - self.last_runhour_update >= RUNHOUR_UPDATE_INTERVAL:
            updated_count = 0
            for machine_id, state in self.machine_states.items():
                if state['last_status']:
                    time_diff = current_time - state['last_update']
                    state['current_run_hour'] += time_diff
                    state['last_update'] = current_time

                    self._update_database_runhour(
                        machine_id, state['current_run_hour'], state['last_status'], current_time, include_status_change=False
                    )
                    updated_count += 1

            if updated_count > 0:
                print(f"Periodic runhour update: Updated {updated_count} running machines.")
            self.last_runhour_update = current_time

    def _update_database_runhour(self, machine_id, run_hour, current_status, update_time, include_status_change=False):
        connection = self.get_db_connection()
        if not connection:
            print(f"Failed to connect to DB for runhour update for machine {machine_id}.")
            return

        cursor = connection.cursor()
        try:
            if include_status_change:
                query = """
                UPDATE machine_defs
                SET run_hour = %s, last_running_status = %s, last_status_change = %s,
                    last_runhour_update = %s, updated_at = %s
                WHERE id = %s
                """

                update_datetime = datetime.fromtimestamp(update_time, tz=timezone.utc)
                cursor.execute(query, (run_hour, current_status, update_datetime, update_datetime, update_datetime, machine_id))
            else:
                query = """
                UPDATE machine_defs
                SET run_hour = %s, last_running_status = %s, last_runhour_update = %s, updated_at = %s
                WHERE id = %s
                """

                update_datetime = datetime.fromtimestamp(update_time, tz=timezone.utc)
                cursor.execute(query, (run_hour, current_status, update_datetime, update_datetime, machine_id))

            connection.commit()

        except Exception as err:
            print(f"Error updating run hour for machine {machine_id} in DB: {err}")
            connection.rollback()
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def get_machine_runhour(self, machine_id):
        if machine_id in self.machine_states:
            return self.machine_states[machine_id]['current_run_hour']
        return 0.0


def validate_config():
    required_vars = ['DB_USER', 'DB_PASSWORD', 'DB_NAME']
    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        print(f"Error: Environment variables berikut tidak ditemukan: {', '.join(missing_vars)}")
        print("Pastikan file .env sudah dibuat dan berisi konfigurasi yang diperlukan.")
        sys.exit(1)

    print("Konfigurasi berhasil dimuat:")
    print(f"  Database: {db_config['database']}@{db_config['host']}:{db_config['port']}")
    print(f"  GPIO Pins: {pins}")
    print(f"  MCP Addresses: {[hex(addr) for addr in mcp_addresses]}")
    print(f"  Debounce Delay: {DEBOUNCE_DELAY}")
    print(f"  LED Pin: {LED_PIN} dengan interval blink {LED_BLINK_INTERVAL} detik")
    print(f"  RunHour Update Interval: {RUNHOUR_UPDATE_INTERVAL} detik")


def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None


def get_machine_defs():
    connection = get_db_connection()
    if not connection:
        return []

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM machine_defs ORDER BY id")
        machines = cursor.fetchall()
        return machines
    except mysql.connector.Error as err:
        print(f"Error fetching machine definitions: {err}")
        return []
    finally:
        cursor.close()
        connection.close()


def save_machine_status(machine_def_id, running_status, recorded_at=None):
    if recorded_at is None:
        recorded_at = datetime.now(timezone.utc)

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
    connection = get_db_connection()
    if not connection:
        return False

    cursor = connection.cursor()

    try:
        check_query = "SELECT id FROM heartbeats WHERE process_name = %s"
        cursor.execute(check_query, (PROCESS_NAME,))
        result = cursor.fetchone()

        current_time = datetime.now(timezone.utc)

        if result:
            update_query = """
            UPDATE heartbeats
            SET last_heartbeat = %s, is_running = TRUE, updated_at = %s
            WHERE process_name = %s
            """
            cursor.execute(update_query, (current_time, current_time, PROCESS_NAME))
        else:
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
    connection = get_db_connection()
    if not connection:
        return False

    cursor = connection.cursor()

    try:
        update_query = "UPDATE heartbeats SET is_running = FALSE, updated_at = %s WHERE process_name = %s"
        cursor.execute(update_query, (datetime.now(timezone.utc), PROCESS_NAME))
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
    connection = get_db_connection()
    if not connection:
        return False

    cursor = connection.cursor(dictionary=True)

    try:
        query = "SELECT last_heartbeat FROM heartbeats WHERE process_name = %s"
        cursor.execute(query, (PROCESS_NAME,))
        result = cursor.fetchone()

        if result:
            last_heartbeat = result['last_heartbeat']
            current_time = datetime.now(timezone.utc)

            if last_heartbeat.tzinfo is None:
                last_heartbeat = last_heartbeat.replace(tzinfo=timezone.utc)

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
    connection = get_db_connection()
    if not connection:
        return False

    cursor = connection.cursor(dictionary=True)

    try:
        print(f"🚨 DETECTED PREVIOUS CRASH!")

        machines = get_machine_defs()
        if machines:
            for machine in machines:
                if machine['last_running_status'] == 1:
                    last_runhour_update_db = machine['last_runhour_update']

                    if last_runhour_update_db is not None:
                        update_query = """
                        UPDATE machine_defs
                        SET last_running_status = 0, last_status_change = %s, updated_at = %s
                        WHERE id = %s
                        """
                        update_cursor = connection.cursor()
                        try:
                            update_cursor.execute(update_query, (last_runhour_update_db, last_runhour_update_db, machine['id']))
                            connection.commit()
                            print(f"Machine {machine['id']} last status updated.")
                        except mysql.connector.Error as err:
                            print(f"Error updating run hour for machine {machine['id']} during crash recovery: {err}")
                            connection.rollback()
                        finally:
                            update_cursor.close()

                    save_machine_status(machine['id'], 0, last_runhour_update_db)

            return True
        return False
    except mysql.connector.Error as err:
        print(f"Error checking previous crash: {err}")
        return False
    finally:
        cursor.close()
        connection.close()


def initialize_machine_status():
    machines = get_machine_defs()
    if not machines:
        print("No machine definitions found!")
        return

    print("Initializing machine status based on current hardware state...")

    for i, pin in enumerate(pins):
        if i < len(machines):
            machine = machines[i]
            if buttons[i] is not None:
                initial_state = 1 if buttons[i].is_pressed else 0

                if initial_state == 1:
                    runhour_calc.update_machine_status(machine['id'], initial_state)
                    save_machine_status(machine['id'], initial_state)
                    print(f"GPIO Machine {machine['name']} (Pin {pin}) initialized to {initial_state}")
            else:
                print(f"GPIO Machine {machine['name']} (Pin {pin}) skipped - button not initialized")

    mcp_index = 0
    for pin_info in mcp_pins:
        machine_index = len(pins) + mcp_index
        if machine_index < len(machines):
            machine = machines[machine_index]
            try:
                current_state = pin_info['pin'].value
                running_status = 0 if current_state else 1

                pin_info['last_state'] = current_state
                pin_info['last_fired_state'] = current_state

                if running_status == 1:
                    runhour_calc.update_machine_status(machine['id'], running_status)
                    save_machine_status(machine['id'], running_status)
                    print(f"MCP Machine {machine['name']} (Pin {mcp_index}) initialized to {running_status}")
            except OSError:
                print(f"Error reading MCP pin for machine {machine['name']}")
                save_machine_status(machine['id'], 2)
        mcp_index += 1


def cleanup():
    print("\nCleaning up...")
    print("Menandai semua mesin sebagai berhenti...")

    machines = get_machine_defs()
    if machines:
        current_time = datetime.now(timezone.utc)
        for machine in machines:
            if machine['last_running_status'] == 1:
                runhour_calc.update_machine_status(machine['id'], 0, current_time.timestamp())
                save_machine_status(machine['id'], 0, current_time)

    if 'status_led' in globals() and status_led is not None:
        status_led.off()
        print("LED dimatikan")

    mark_process_stopped()
    print("Cleanup completed. Program berhenti.")


def signal_handler(signum, frame):
    print(f"\nReceived signal {signum}. Shutting down gracefully...")
    cleanup()
    sys.exit(0)


def create_gpio_callback(machine_id, machine_name, index):
    def pressed():
        print(f"{machine_name} Ditekan! (State: LOW)")
        runhour_calc.update_machine_status(machine_id, 1)
        save_machine_status(machine_id, 1)

    def released():
        print(f"{machine_name} Dilepas! (State: HIGH)")
        runhour_calc.update_machine_status(machine_id, 0)
        save_machine_status(machine_id, 0)

    return pressed, released


runhour_calc = RunHourCalculator()


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

validate_config()

if check_rtc_anomaly():
    print("Shutting down due to RTC anomaly...")
    sys.exit(1)

check_previous_crash()

update_heartbeat()

try:
    status_led = LED(LED_PIN)
    status_led.off()
    print(f"Status LED initialized on pin {LED_PIN}")
except Exception as e:
    print(f"Error initializing status LED on pin {LED_PIN}: {e}")
    status_led = None

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

for i, btn in enumerate(buttons):
    if i < len(machines) and btn is not None:
        machine = machines[i]
        pressed_func, released_func = create_gpio_callback(
            machine['id'], machine['name'], i
        )
        btn.when_pressed = pressed_func
        btn.when_released = released_func
        print(f"GPIO callback set for {machine['name']} on pin {pins[i]}")
    elif btn is None and i < len(machines):
        print(f"Warning: GPIO pin {pins[i]} tidak dapat diinisialisasi, callback tidak diset untuk {machines[i]['name']}")

initialize_machine_status()

print("Starting main loop...")

last_heartbeat_time = time.time()
last_led_toggle_time = time.time()
last_runhour_update_time = time.time()
led_state = False

try:
    while True:
        current_time = time.time()

        if current_time - last_heartbeat_time >= HEARTBEAT_INTERVAL:
            if update_heartbeat():
                print(f"Heartbeat updated at {datetime.now(timezone.utc)}")
            last_heartbeat_time = current_time

        runhour_calc.periodic_runhour_update()

        if current_time - last_led_toggle_time >= LED_BLINK_INTERVAL:
            if status_led is not None:
                led_state = not led_state
                if led_state:
                    status_led.on()
                else:
                    status_led.off()
            last_led_toggle_time = current_time

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
                        runhour_calc.update_machine_status(machine['id'], 1)
                        save_machine_status(machine['id'], 1)
                    else:
                        print(f"{machine['name']} Dilepas! (State: HIGH)")
                        runhour_calc.update_machine_status(machine['id'], 0)
                        save_machine_status(machine['id'], 0)

                    pin_info['last_fired_state'] = current_state

        time.sleep(0.05)

except KeyboardInterrupt:
    print("Program dihentikan oleh user.")
    cleanup()
except Exception as e:
    print(f"Unexpected error: {e}")
    import traceback
    traceback.print_exc()
    cleanup()
