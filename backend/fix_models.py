import glob
import re

for filepath in glob.glob("c:/Documents/Hackathon/drm-platform/backend/app/models/*.py"):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    
    # Remove " | None" from Mapped types
    new_data = re.sub(r'Mapped\[([a-zA-Z0-9_\.]+) \| None\]', r'Mapped[\1]', data)
    
    if data != new_data:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_data)
        print(f"Updated {filepath}")
