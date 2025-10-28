from gpiozero import Button
from signal import pause
import time
import board
import busio
import digitalio
from adafruit_mcp230xx.mcp23017 import MCP23017

pins = [5, 6, 7, 8, 9, 10, 11, 12, 13, 27, 25, 16, 17, 18, 19, 20, 21, 22]

names = [
    "CBC1", "CBC2", "PRS1", "PRS2", "PRS3", "PRS4", "PRS5", "PRS6", "PRS7",
    "PRS8", "DTR1", "DTR2", "DTR3", "DTR4", "DTR5", "DTR6", "DTR7", "DTR8"
]

buttons = []

def create_callback(name):
    def pressed():
        print(f"{name} Ditekan! (State: HIGH)")
    def released():
        print(f"{name} Dilepas! (State: LOW)")
    return pressed, released

for i, pin in enumerate(pins):
    btn = Button(pin, pull_up=True, bounce_time=0.5)
    pressed_func, released_func = create_callback(names[i])
    btn.when_pressed = pressed_func
    btn.when_released = released_func
    buttons.append(btn)

print("Menginisialisasi MCP23017...")
i2c = busio.I2C(board.SCL, board.SDA)

mcp_addresses = [0x20, 0x21, 0x22]
mcp_devices = []
mcp_pins = []

spare_names = [f"SPARE{i}" for i in range(48)]
DEBOUNCE_DELAY = 0.5

for addr in mcp_addresses:
    mcp = MCP23017(i2c, address=addr)
    mcp_devices.append(mcp)

pin_index = 0
for mcp in mcp_devices:
    for pin_num in range(16):
        pin = mcp.get_pin(pin_num)
        pin.direction = digitalio.Direction.INPUT
        pin.pull = digitalio.Pull.UP
        
        name = spare_names[pin_index]
        pressed_func, released_func = create_callback(name)
        
        initial_state = pin.value
        mcp_pins.append({
            'pin': pin,
            'name': name,
            'pressed': pressed_func,
            'released': released_func,
            'last_state': initial_state,
            'last_fired_state': initial_state,
            'last_debounce_time': 0
        })
        pin_index += 1

print("Menunggu input...")

def check_mcp_pins():
    for pin_info in mcp_pins:
        current_state = pin_info['pin'].value

        if current_state != pin_info['last_state']:
            pin_info['last_debounce_time'] = time.time()
            pin_info['last_state'] = current_state

        else:
            if (time.time() - pin_info['last_debounce_time']) > DEBOUNCE_DELAY:
                if current_state != pin_info['last_fired_state']:
                    if current_state == False:
                        pin_info['pressed']()
                    else:
                        pin_info['released']()
                    
                    pin_info['last_fired_state'] = current_state

try:
    while True:
        check_mcp_pins()
        time.sleep(0.05)
except KeyboardInterrupt:
    print("Program dihentikan.")