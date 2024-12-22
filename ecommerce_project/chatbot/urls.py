from django.urls import path
from .views import ChatHistoryViewSet ,send_message
from .views import UserViewSet
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView
urlpatterns = [
    path('api/chat-history/', ChatHistoryViewSet.as_view(), name='chat-history'),  # Direct path for the chat history endpoint
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', UserViewSet.as_view(), name='users'),
     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
      path('api/chat/', send_message, name='send_message'),
]
