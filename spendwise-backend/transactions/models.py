from django.db import models
from django.conf import settings

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('food',          'Food'),
        ('beverage',      'Beverage'),
        ('snacks',        'Snacks'),
        ('utilities',     'Utilities'),
        ('personal_care', 'Personal Care'),
        ('others',        'Others'),
    ]

    SOURCE_CHOICES = [
        ('ocr',    'OCR Assisted'),
        ('manual', 'Manual Entry'),
    ]

    user             = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    amount           = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateField()
    store_branch     = models.CharField(max_length=255, blank=True, null=True)
    category         = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='others')
    item_description = models.TextField(blank=True, null=True)
    source           = models.CharField(max_length=10, choices=SOURCE_CHOICES, default='manual')
    created_at       = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.transaction_date}"