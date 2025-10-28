import uuid
from rest_framework import serializers
from users.serializers import UserDisplaySerializer
from .models import Account, Transaction


class AccountSerializer(serializers.ModelSerializer):
    user = UserDisplaySerializer(read_only=True)

    class Meta:
        model = Account
        fields = ['id', 'user', 'account_number', 'balance', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'account', 'amount',
                  'transaction_type', 'timestamp', 'description']
        read_only_fields = ['timestamp']
 

class TransferSerializer(serializers.Serializer):
    from_account_id = serializers.IntegerField()
    to_account_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)

    def validate(self, data):
        # Basic check: cannot transfer to same account
        if data['from_account_id'] == data['to_account_id']:
            raise serializers.ValidationError("Cannot transfer to the same account.")

        request = self.context.get('request')
        if not request or not getattr(request, 'user', None) or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required to perform this action.")

        try:
            from_account = Account.objects.get(id=data['from_account_id'])
            to_account = Account.objects.get(id=data['to_account_id'])
        except Account.DoesNotExist:
            raise serializers.ValidationError("Invalid account.")

        # Verify ownership: both accounts must belong to the authenticated user
        user = request.user
        if from_account.user != user or to_account.user != user:
            raise serializers.ValidationError("Accounts must belong to the authenticated user.")

        # Check sufficient balance
        if from_account.balance < data['amount']:
            raise serializers.ValidationError("Insufficient funds.")

        return data
    
