from django.shortcuts import render

# Create your views here.
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model
from django.forms.models import model_to_dict

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        serializer.save()


class UserLoginView(APIView):
    """
    Custom login view using email + password and Token authentication.
    Avoids using ObtainAuthToken directly so the project can use email as the
    credential field if the custom user model expects that.
    """

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            # return basic user info along with token
            user_data = {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
            return Response({'token': token.key, 'user': user_data})
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
