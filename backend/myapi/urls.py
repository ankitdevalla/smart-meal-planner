from django.urls import path, include
from .views import TestUploadView, upload_form, register, login_view, google_login, IngredientViewSet, UserDetailView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet, basename='Ingredient')

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('test-upload/', TestUploadView.as_view(), name='test-upload'),
    path('upload-form/', upload_form, name='upload-form'),
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('google-login/', google_login, name='google_login'),
    path('', include(router.urls)),  # Include the router-generated URLs
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]