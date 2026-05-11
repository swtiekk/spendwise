from rest_framework import serializers
from .models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Budget
        fields = [
            'id', 'income', 'cycle',
            'start_date', 'end_date', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']