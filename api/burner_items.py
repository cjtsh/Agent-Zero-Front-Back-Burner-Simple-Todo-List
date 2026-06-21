import os
import json
from helpers.api import ApiHandler

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "items.json")

def load_items():
    if not os.path.exists(DATA_FILE):
        return {"front": [], "back": []}
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_items(data):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

class BurnerItems(ApiHandler):
    @classmethod
    def requires_auth(cls) -> bool:
        return True

    async def process(self, input: dict, request) -> dict:
        action = input.get("action", "get")

        if action == "get":
            return load_items()

        elif action == "save":
            items = input.get("items", {"front": [], "back": []})
            save_items(items)
            return {"status": "success", "items": items}

        return {"status": "error", "message": "Invalid action"}
