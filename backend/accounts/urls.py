from django.urls import path
from .views import UserAccountsView


urlpatterns = [
    path('my-accounts/', UserAccountsView.as_view(), name='my-accounts'),
]