from django.db import models
from django.conf import settings

class Receipt(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('confirmed', 'Confirmed'),
        ('failed',    'Failed'),
    ]

    user             = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='receipts')
    image            = models.ImageField(upload_to='receipts/')
    raw_ocr_text     = models.TextField(blank=True, null=True)
    extracted_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    extracted_date   = models.DateField(blank=True, null=True)
    extracted_store  = models.CharField(max_length=255, blank=True, null=True)
    extracted_category = models.CharField(max_length=50, blank=True, null=True)
    ocr_confidence   = models.FloatField(blank=True, null=True)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at       = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.status} - {self.created_at}"