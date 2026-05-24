import sys
import json
import re
import cv2
import numpy as np
import pytesseract

# Windows Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_image(image_path: str) -> np.ndarray:
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh

def extract_amount(text_lines: list) -> str | None:
    for line in reversed(text_lines):
        match = re.search(r'(?:total|amount|due|pay)[^\d]*(\d+[\.,]\d{2})', line, re.IGNORECASE)
        if match:
            return match.group(1).replace(',', '.')
        match = re.search(r'[₱P]\s*(\d+[\.,]\d{2})', line)
        if match:
            return match.group(1).replace(',', '.')
    return None

def extract_date(text_lines: list) -> str | None:
    for line in text_lines:
        match = re.search(r'(\d{4}-\d{2}-\d{2})', line)
        if match:
            return match.group(1)
        match = re.search(r'(\d{2}/\d{2}/\d{4})', line)
        if match:
            parts = match.group(1).split('/')
            return f"{parts[2]}-{parts[0]}-{parts[1]}"
    return None

def extract_store(text_lines: list) -> str | None:
    for line in text_lines[:3]:
        cleaned = line.strip()
        if len(cleaned) > 3:
            return cleaned
    return None

def classify_category(text: str) -> str:
    text_lower = text.lower()
    if any(w in text_lower for w in ['coffee', 'cafe', 'starbucks', 'milk tea', 'juice', 'drink']):
        return 'beverage'
    if any(w in text_lower for w in ['restaurant', 'food', 'grill', 'pizza', 'burger', 'chicken', 'rice']):
        return 'food'
    if any(w in text_lower for w in ['electric', 'water', 'internet', 'meralco', 'pldt', 'globe']):
        return 'utilities'
    return 'others'

def process_image(image_path: str) -> dict:
    try:
        processed = preprocess_image(image_path)
        data = pytesseract.image_to_data(
            processed,
            output_type=pytesseract.Output.DICT,
            config='--psm 6'
        )
        words = [
            data['text'][i]
            for i in range(len(data['text']))
            if int(data['conf'][i]) > 30 and data['text'][i].strip()
        ]
        confidences = [
            int(data['conf'][i])
            for i in range(len(data['conf']))
            if int(data['conf'][i]) > 30 and data['text'][i].strip()
        ]
        full_text = pytesseract.image_to_string(processed, config='--psm 6')
        text_lines = [line for line in full_text.splitlines() if line.strip()]
        avg_confidence = (sum(confidences) / len(confidences) / 100) if confidences else 0.0

        return {
            'raw_ocr_text': full_text,
            'extracted_amount': extract_amount(text_lines),
            'extracted_date': extract_date(text_lines),
            'extracted_store': extract_store(text_lines),
            'extracted_category': classify_category(full_text),
            'ocr_confidence': round(avg_confidence, 2),
        }
    except Exception as e:
        return {
            'raw_ocr_text': '',
            'extracted_amount': None,
            'extracted_date': None,
            'extracted_store': None,
            'extracted_category': 'others',
            'ocr_confidence': 0.0,
            'error': str(e),
        }

if __name__ == '__main__':
    image_path = sys.argv[1]
    result = process_image(image_path)
    print(json.dumps(result))