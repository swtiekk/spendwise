from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Budget
from .serializers import BudgetSerializer
from transactions.models import Transaction
from decimal import Decimal

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def budget_list(request):
    if request.method == 'GET':
        budgets = Budget.objects.filter(user=request.user).order_by('-start_date')
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_summary(request):
    try:
        budget = Budget.objects.filter(
            user=request.user
        ).latest('created_at')

        transactions = Transaction.objects.filter(
            user=request.user,
            transaction_date__gte=budget.start_date,
            transaction_date__lte=budget.end_date,
        )

        total_spent = sum(t.amount for t in transactions)
        remaining   = Decimal(str(budget.income)) - Decimal(str(total_spent))

        return Response({
            'income':       budget.income,
            'cycle':        budget.cycle,
            'start_date':   budget.start_date,
            'end_date':     budget.end_date,
            'total_spent':  total_spent,
            'remaining':    remaining,
            'transactions': len(transactions),
        })

    except Budget.DoesNotExist:
        # Return default zeroed-out summary for new users
        return Response({
            'income':       0,
            'cycle':        'N/A',
            'start_date':   None,
            'end_date':     None,
            'total_spent':  0,
            'remaining':    0,
            'transactions': 0,
        })