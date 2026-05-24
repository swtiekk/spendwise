from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.files.storage import default_storage
from .models import Receipt
from .serializers import ReceiptSerializer
from .services.ocr_service import run_ocr

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

            # Call real OCR
            image_full_path = default_storage.path(receipt.image.name)
            ocr_data = run_ocr(image_full_path)

            receipt.raw_ocr_text = ocr_data.get('raw_ocr_text', '')
            receipt.extracted_amount = ocr_data.get('extracted_amount')
            receipt.extracted_date = ocr_data.get('extracted_date')
            receipt.extracted_store = ocr_data.get('extracted_store')
            receipt.extracted_category = ocr_data.get('extracted_category', 'others')
            receipt.ocr_confidence = ocr_data.get('ocr_confidence', 0.0)
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