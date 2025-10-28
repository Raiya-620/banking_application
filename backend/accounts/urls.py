from django.urls import path
from .views import TransactionListView, TransferView, UserAccountsView


urlpatterns = [
    path('my-accounts/', UserAccountsView.as_view(), name='my-accounts'),
    path('accounts/<int:account_id>/transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('transfer/', TransferView.as_view(), name='transfer'),
]