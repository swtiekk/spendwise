from django.db import models
from django.conf import settings

class Budget(models.Model):
    CYCLE_CHOICES = [
        ('weekly',    'Weekly'),
        ('biweekly',  'Bi-Weekly'),
        ('monthly',   'Monthly'),
    ]

    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budgets')
    income       = models.DecimalField(max_digits=10, decimal_places=2)
    cycle        = models.CharField(max_length=20, choices=CYCLE_CHOICES, default='monthly')
    start_date   = models.DateField()
    end_date     = models.DateField()
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.cycle} - {self.income}"