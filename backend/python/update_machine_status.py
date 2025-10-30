from gpiozero import Button
import time
import board
import busio
import digitalio
from adafruit_mcp230xx.mcp23017 import MCP23017
import json
import os
from datetime import datetime

json_path = "../storage/app/public/data/machine_defs.json"
status_path = "../storage/app/public/data/machine_status.json"

with open(json_path, 'r') as f:
    machine_data = json.load(f)

machine_names = []
spare_names = []
for item in machine_data.get("data", []):
    name = item.get("name", "").lower()
    if name.startswith("spare"):
        spare_names.append(item.get("name"))
    else:
        machine_names.append(item.get("name"))

pins = [5, 6, 7, 8, 9, 10, 11, 12, 13, 27, 25, 16, 17, 18, 19, 20, 21, 22]

all_names = machine_names[:len(pins)] + spare_names[:48]

initial_active_machine = [2] * len(all_names)

if os.path.exists(status_path):
    os.remove(status_path)

status_data = {
    "tanggal": datetime.now().strftime("%Y-%m-%d"),
    "waktu": datetime.now().strftime("%H:%M:%S"),
    "activeMachine": initial_active_machine
}

buttons = []
button_states = {}

for i, pin in enumerate(pins):
    btn = Button(pin, pull_up=True, bounce_time=0.5)
    button_states[i] = 1 if btn.is_pressed else 0
    buttons.append(btn)

i2c = busio.I2C(board.SCL, board.SDA)

mcp_addresses = [0x20, 0x21, 0x22]
mcp_devices = []
mcp_pins = []

for addr in mcp_addresses:
    try:
        mcp = MCP23017(i2c, address=addr)
        mcp_devices.append(mcp)
    except Exception as e:
        continue

pin_index = 0
for mcp in mcp_devices:
    for pin_num in range(16):
        pin = mcp.get_pin(pin_num)
        pin.direction = digitalio.Direction.INPUT
        pin.pull = digitalio.Pull.UP

        global_index = len(pins) + pin_index
        try:
            initial_state = pin.value
            button_states[global_index] = 0 if initial_state else 1
        except OSError:
            button_states[global_index] = 2
        mcp_pins.append({
            'pin': pin,
            'index': global_index,
            'last_state': None,
            'last_debounce_time': 0
        })
        pin_index += 1

for i in range(len(all_names)):
    if i in button_states:
        initial_active_machine[i] = button_states[i]
    else:
        initial_active_machine[i] = 2

def update_status_file(active_machine_values):
    current_time = datetime.now()
    status_data["tanggal"] = current_time.strftime("%Y-%m-%d")
    status_data["waktu"] = current_time.strftime("%H:%M:%S")
    status_data["activeMachine"] = active_machine_values
    with open(status_path, 'w') as f:
        json.dump(status_data, f, indent=4)

update_status_file(initial_active_machine)

def create_callback(name, index, state_list):
    def pressed():
        print(f"{name} Ditekan! (State: LOW)")
        state_list[index] = 1
        update_status_file(state_list)
    def released():
        print(f"{name} Dilepas! (State: HIGH)")
        state_list[index] = 0
        update_status_file(state_list)
    return pressed, released

for i, btn in enumerate(buttons):
    pressed_func, released_func = create_callback(all_names[i], i, initial_active_machine)
    btn.when_pressed = pressed_func
    btn.when_released = released_func

DEBOUNCE_DELAY = 0.5

try:
    while True:
        for pin_info in mcp_pins:
            try:
                current_state = pin_info['pin'].value
            except OSError:
                if pin_info['index'] < len(initial_active_machine) and initial_active_machine[pin_info['index']] != 2:
                    initial_active_machine[pin_info['index']] = 2
                    update_status_file(initial_active_machine)
                continue

            if current_state != pin_info['last_state']:
                pin_info['last_debounce_time'] = time.time()
                pin_info['last_state'] = current_state

            elif (time.time() - pin_info['last_debounce_time']) > DEBOUNCE_DELAY:
                if current_state != pin_info.get('last_fired_state', None):
                    global_idx = pin_info['index']
                    if current_state == False:
                        print(f"{all_names[global_idx]} Ditekan! (State: LOW)")
                        initial_active_machine[global_idx] = 1
                    else:
                        print(f"{all_names[global_idx]} Dilepas! (State: HIGH)")
                        initial_active_machine[global_idx] = 0
                    pin_info['last_fired_state'] = current_state
                    update_status_file(initial_active_machine)

        time.sleep(0.05)
        update_status_file(initial_active_machine)

except KeyboardInterrupt:
    print("Program dihentikan.")