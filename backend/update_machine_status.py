import json
import time
import random
from datetime import datetime
import os
import tempfile

JSON_FILE_PATH = 'storage/app/public/data/machine_status.json'
TIME_UPDATE_INTERVAL_SECONDS = 1     
CBC_UPDATE_INTERVAL_SECONDS = 10    

def ensure_parent_dir(path):
    parent = os.path.dirname(path)
    if parent and not os.path.exists(parent):
        os.makedirs(parent, exist_ok=True)

def atomic_write_json(path, data, indent=4):
    ensure_parent_dir(path)
    dirpath = os.path.dirname(path) or '.'
    with tempfile.NamedTemporaryFile('w', delete=False, dir=dirpath, encoding='utf-8') as tmpf:
        json.dump(data, tmpf, indent=indent, ensure_ascii=False)
        tmpname = tmpf.name
    os.replace(tmpname, path)

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_default_structure(now, cbc1=0, cbc2=0):
    active = [0] * 18 + [2] * 46 

    active[0] = cbc1  
    active[1] = cbc2  

    return {
        "tanggal": now.strftime("%Y-%m-%d"),
        "waktu": now.strftime("%H:%M:%S"),
        "activeMachine": active
    }

def update_machine_status(update_cbc=False):
    now = datetime.now()
    current_date = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%H:%M:%S")

    if update_cbc:
        cbc1_value = random.randint(0, 1)
        cbc2_value = random.randint(0, 1)
    else:
        cbc1_value = None
        cbc2_value = None

    try:
        data = load_json(JSON_FILE_PATH)

        if not isinstance(data, dict):
            raise ValueError("Root JSON is not an object/dict")

        active = data.get('activeMachine')
        if active is None or not isinstance(active, list):
            active = []
            data['activeMachine'] = active

        data['tanggal'] = current_date
        data['waktu'] = current_time

        if update_cbc:
            while len(active) < 64:
                active.append(0)

            active[0] = cbc1_value   
            active[1] = cbc2_value   

            atomic_write_json(JSON_FILE_PATH, data)
            print(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Updated waktu + CBC (CBC1={cbc1_value}, CBC2={cbc2_value})")
        else:
            atomic_write_json(JSON_FILE_PATH, data)
            print(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Updated waktu only")

    except FileNotFoundError:
        if update_cbc:
            c1 = cbc1_value
            c2 = cbc2_value
        else:
            c1 = 0
            c2 = 0
        data = create_default_structure(now, c1, c2)
        atomic_write_json(JSON_FILE_PATH, data)
        print(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] File not found. Created new file at {JSON_FILE_PATH} (CBC1={c1}, CBC2={c2})")

    except json.JSONDecodeError:
        backup_path = JSON_FILE_PATH + '.corrupt.' + now.strftime("%Y%m%d%H%M%S")
        try:
            os.rename(JSON_FILE_PATH, backup_path)
            print(f"Warning: JSON decode error. Backed up corrupted file to {backup_path}")
        except Exception as e:
            print(f"Warning: failed to backup corrupted file: {e}")
        if update_cbc:
            c1 = cbc1_value
            c2 = cbc2_value
        else:
            c1 = 0
            c2 = 0
        data = create_default_structure(now, c1, c2)
        atomic_write_json(JSON_FILE_PATH, data)
        print(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Created new file at {JSON_FILE_PATH} after corruption (CBC1={c1}, CBC2={c2})")

    except Exception as e:
        print(f"An unexpected error occurred while updating machine status: {e}")

def main():
    print("Starting machine status updater script.")
    print(f"Target file: {JSON_FILE_PATH}")
    print(f"Update waktu tiap {TIME_UPDATE_INTERVAL_SECONDS} detik; update CBC tiap {CBC_UPDATE_INTERVAL_SECONDS} detik.")
    print("Press Ctrl+C to stop the script.")

    next_cbc_time = time.time() + CBC_UPDATE_INTERVAL_SECONDS

    try:
        while True:
            now_ts = time.time()
            do_cbc = False
            if now_ts >= next_cbc_time:
                do_cbc = True
                next_cbc_time = now_ts + CBC_UPDATE_INTERVAL_SECONDS

            update_machine_status(update_cbc=do_cbc)
            time.sleep(TIME_UPDATE_INTERVAL_SECONDS)
    except KeyboardInterrupt:
        print("\nStopped by user (KeyboardInterrupt). Goodbye.")
    except Exception as e:
        print(f"Fatal error in main loop: {e}")

if __name__ == "__main__":
    main()
