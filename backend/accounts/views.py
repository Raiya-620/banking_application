from django.shortcuts import render
from django.db import transaction
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Account, Transaction
from .serializers import AccountSerializer, TransactionSerializer, TransferSerializer
from rest_framework.generics import ListAPIView

# Create your views here.


class UserAccountsView(ListAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)


class TransactionListView(ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        account_id = self.kwargs.get('account_id')
        try:
            account = Account.objects.get(
                id=account_id, user=self.request.user)
        except Account.DoesNotExist:
            raise PermissionDenied("Account not found or access denied.")

        if account.user != self.request.user:
            raise PermissionDenied(
                "You do not have permission to view transactions for this account.")

        return Transaction.objects.filter(account=account).order_by('-timestamp')


class TransferView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransferSerializer(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        from_account = Account.objects.get(id=data['from_account_id'])
        to_account = Account.objects.get(id=data['to_account_id'])
        amount = data['amount']

        # Perform the transfer atomically
        with transaction.atomic():
            # subtract and add
            from_account.balance -= amount
            to_account.balance += amount
            from_account.save()
            to_account.save()

            # Record the transactions. Use 'transfer' transaction_type and descriptive text
            Transaction.objects.create(
                account=from_account,
                amount=amount * -1,
                transaction_type='transfer',
                description=f'Transfer to account {to_account.account_number}'
            )
            Transaction.objects.create(
                account=to_account,
                amount=amount,
                transaction_type='transfer',
                description=f'Transfer from account {from_account.account_number}'
            )

        return Response({"message": "Transfer successful."}, status=status.HTTP_200_OK)
