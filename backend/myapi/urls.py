from django.urls import path
from .views import TestUploadView, upload_form
from . import views

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('test-upload/', TestUploadView.as_view(), name='test-upload'),
    path('upload-form/', upload_form, name='upload-form'),
]