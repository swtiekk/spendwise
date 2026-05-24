import subprocess
import json
from pathlib import Path

ML_PYTHON = Path("C:/Users/skatr/spendwise/venv/Scripts/python.exe")
OCR_SCRIPT = Path("C:/Users/skatr/spendwise/spendwise-ml/scripts/batch_ocr.py")

def run_ocr(image_path: str) -> dict:
    try:
        result = subprocess.run(
            [str(ML_PYTHON), str(OCR_SCRIPT), image_path],
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode != 0:
            print(f"[OCR ERROR] {result.stderr}")
            return _empty_result()
        return json.loads(result.stdout)
    except subprocess.TimeoutExpired:
        print("[OCR ERROR] Timed out")
        return _empty_result()
    except Exception as e:
        print(f"[OCR ERROR] {e}")
        return _empty_result()

def _empty_result() -> dict:
    return {
        "raw_ocr_text": "",
        "extracted_amount": None,
        "extracted_date": None,
        "extracted_store": None,
        "extracted_category": "others",
        "ocr_confidence": 0.0,
    }