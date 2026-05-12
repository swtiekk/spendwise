from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Receipt
from .serializers import ReceiptSerializer
import random
from decimal import Decimal
from datetime import date

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def receipt_list(request):
    if request.method == 'GET':
        receipts = Receipt.objects.filter(user=request.user).order_by('-created_at')
        serializer = ReceiptSerializer(receipts, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ReceiptSerializer(data=request.data)
        if serializer.is_valid():
            receipt = serializer.save(user=request.user)
            
            # Mocking ML OCR Extraction
            # In a real scenario, this would call spendwise-ml scripts
            receipt.extracted_amount = Decimal(str(round(random.uniform(10.0, 500.0), 2)))
            receipt.extracted_date = date.today()
            receipt.extracted_store = random.choice(['Starbucks', 'Walmart', 'Shell', 'McDonalds', 'SM Supermarket'])
            receipt.extracted_category = random.choice(['food', 'beverage', 'utilities', 'others'])
            receipt.ocr_confidence = round(random.uniform(0.8, 0.99), 2)
            receipt.status = 'pending'
            receipt.save()
            
            return Response(ReceiptSerializer(receipt).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def receipt_detail(request, pk):
    try:
        receipt = Receipt.objects.get(pk=pk, user=request.user)
    except Receipt.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(ReceiptSerializer(receipt).data)

    if request.method == 'DELETE':
        receipt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
