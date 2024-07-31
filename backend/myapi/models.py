from django.db import models
from django.contrib.auth.models import User

class TestUpload(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='test_uploads/')

    def __str__(self):
        return self.title

class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to the user


    def __str__(self):
        return self.name