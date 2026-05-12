from rest_framework import serializers
from .models import Receipt

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = [
            'id', 'user', 'image', 'raw_ocr_text', 
            'extracted_amount', 'extracted_date', 
            'extracted_store', 'extracted_category', 
            'ocr_confidence', 'status', 'created_at'
        ]
        read_only_fields = ['user', 'raw_ocr_text', 'ocr_confidence', 'status', 'created_at']
