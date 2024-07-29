from django.urls import path, include
from .views import TestUploadView, upload_form, register, login_view, google_login, IngredientViewSet
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet)

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('test-upload/', TestUploadView.as_view(), name='test-upload'),
    path('upload-form/', upload_form, name='upload-form'),
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('google-login/', google_login, name='google_login'),
    path('', include(router.urls)),  # Include the router-generated URLs
]