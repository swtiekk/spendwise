import json
import csv
import os

annotations = [
    # ── FRESH ──────────────────────────────────────────────
    {
        "file": "receipt_01.jpg",
        "condition": "fresh",
        "ground_truth": {
            "transaction_amount": 50.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Eleven Neribros Inc. Store#2006",
            "item_descriptions": ["NatureSPuriDW500ml", "JnJ Mr Chips 98g"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_02.jpg",
        "condition": "fresh",
        "ground_truth": {
            "transaction_amount": 203.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Eleven Neribros Inc. Store#2006",
            "item_descriptions": ["7-CONNECT GCash Cash In"],
            "expense_category": "utilities"
        }
    },
    {
        "file": "receipt_03.jpg",
        "condition": "fresh",
        "ground_truth": {
            "transaction_amount": 44.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Eleven Neribros Inc. Store#2006",
            "item_descriptions": ["SelectaBPipCaC60ml x2"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_04.jpg",
        "condition": "fresh",
        "ground_truth": {
            "transaction_amount": 24.00,
            "transaction_date": "2026-05-11",
            "store_branch": "7-Eleven Rhainella Store#2423",
            "item_descriptions": ["7SelectDistDW525ml"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_05.jpg",
        "condition": "fresh",
        "ground_truth": {
            "transaction_amount": 1300.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Connect Kiosk",
            "item_descriptions": ["GCash Cash In"],
            "expense_category": "utilities"
        }
    },
    {
        "file": "receipt_06.jpg",
        "condition": "fresh",
        "ground_truth": {
            "transaction_amount": 2000.00,
            "transaction_date": "2026-05-11",
            "store_branch": "7-Eleven Rhainella Store#2423",
            "item_descriptions": ["7-CONNECT Bills Payment"],
            "expense_category": "utilities"
        }
    },
    {
        "file": "receipt_07.jpg",
        "condition": "fresh",
        "ground_truth": {
            "transaction_amount": 11.00,
            "transaction_date": "2026-05-11",
            "store_branch": "7-Eleven Rhainella Store#2423",
            "item_descriptions": ["Cloud9ClassiBar28g"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_08.jpg",
        "condition": "fresh",
        "ground_truth": {
            "transaction_amount": 73.00,
            "transaction_date": "2026-05-11",
            "store_branch": "7-Eleven Rhainella Store#2423",
            "item_descriptions": ["C2GreenTApple1L", "IceCupSelling"],
            "expense_category": "food"
        }
    },
    # ── FADED ──────────────────────────────────────────────
    {
        "file": "receipt_09.jpg",
        "condition": "faded",
        "ground_truth": {
            "transaction_amount": 10.00,
            "transaction_date": "2026-05-11",
            "store_branch": "7-Eleven Rhainella Store#2423",
            "item_descriptions": ["NaturesSDWter350ml"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_10.jpg",
        "condition": "faded",
        "ground_truth": {
            "transaction_amount": 81.00,
            "transaction_date": "2026-05-11",
            "store_branch": "7-Eleven Rhainella Store#2423",
            "item_descriptions": ["7Select PH9DW525ml", "7FRSHSIOPPREMASADO"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_11.jpg",
        "condition": "faded",
        "ground_truth": {
            "transaction_amount": 59.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Eleven Avida Towers Store#4245",
            "item_descriptions": ["7-CONNECT Top Up"],
            "expense_category": "utilities"
        }
    },
    {
        "file": "receipt_12.jpg",
        "condition": "faded",
        "ground_truth": {
            "transaction_amount": 7.00,
            "transaction_date": "2026-05-11",
            "store_branch": "7-Eleven Rhainella Store#2423",
            "item_descriptions": ["ModCotMaxNnWngSngl"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_13.jpg",
        "condition": "faded",
        "ground_truth": {
            "transaction_amount": 22.00,
            "transaction_date": "2026-05-11",
            "store_branch": "7-Eleven Rhainella Store#2423",
            "item_descriptions": ["Cloud9Classibar28g x2"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_14.jpg",
        "condition": "faded",
        "ground_truth": {
            "transaction_amount": 8.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Eleven JR Borja St. Store#2061",
            "item_descriptions": ["TigerBitesChclt18g"],
            "expense_category": "food"
        }
    },
    # ── WITHERED ───────────────────────────────────────────
    {
        "file": "receipt_15.jpg",
        "condition": "withered",
        "ground_truth": {
            "transaction_amount": 38.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Eleven Avida Towers Store#4245",
            "item_descriptions": ["ArcysRootbeer500ml"],
            "expense_category": "food"
        }
    },
    {
        "file": "receipt_16.jpg",
        "condition": "withered",
        "ground_truth": {
            "transaction_amount": 50.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Eleven Avida Towers Store#4245",
            "item_descriptions": ["Toys and Novelty P", "Toys and Novelty P"],
            "expense_category": "shopping"
        }
    },
    {
        "file": "receipt_17.jpg",
        "condition": "withered",
        "ground_truth": {
            "transaction_amount": 59.00,
            "transaction_date": "2026-05-10",
            "store_branch": "7-Eleven Avida Towers Store#4245",
            "item_descriptions": ["7-CONNECT Top Up Duplicate"],
            "expense_category": "utilities"
        }
    },
]

# Save JSON
json_path = os.path.join(os.path.dirname(__file__), "../data/annotated/ground_truth.json")
with open(json_path, "w") as f:
    json.dump(annotations, f, indent=2)

# Save CSV for notebooks
csv_path = os.path.join(os.path.dirname(__file__), "../data/annotated/ground_truth.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["filename", "amount", "date", "store_branch", "condition"])
    writer.writeheader()
    for a in annotations:
        writer.writerow({
            "filename":     a["file"],
            "amount":       a["ground_truth"]["transaction_amount"],
            "date":         a["ground_truth"]["transaction_date"],
            "store_branch": a["ground_truth"]["store_branch"],
            "condition":    a["condition"],
        })

fresh    = [a for a in annotations if a["condition"] == "fresh"]
faded    = [a for a in annotations if a["condition"] == "faded"]
withered = [a for a in annotations if a["condition"] == "withered"]

print(f"✅ Saved {len(annotations)} annotations")
print(f"   Fresh:    {len(fresh)}")
print(f"   Faded:    {len(faded)}")
print(f"   Withered: {len(withered)}")
print(f"   JSON: {json_path}")
print(f"   CSV:  {csv_path}")