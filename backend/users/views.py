from django.shortcuts import render

# Create your views here.
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model
from django.forms.models import model_to_dict

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        serializer.save()


class UserLoginView(ObtainAuthToken):
    """
    Login view that uses DRF's ObtainAuthToken to exchange credentials for a token.
    We subclass to return the token plus basic user info (id, email, first_name, last_name)
    in the response for convenience on the frontend.
    """

    def post(self, request, *args, **kwargs):
        # Use ObtainAuthToken behavior to validate credentials and create token
        response = super().post(request, *args, **kwargs)
        token_key = response.data.get('token')
        if not token_key:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token = Token.objects.get(key=token_key)
        user = token.user
        user_data = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        return Response({'token': token.key, 'user': user_data})
