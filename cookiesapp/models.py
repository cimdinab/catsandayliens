from django.db import models

# Create your models here.
class Description(models.Model):
    cats_descriptions = models.Manager()
    breed_id = models.CharField(max_length=4, primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
       return str(self.name)

class Image(models.Model):
    cats_pics = models.Manager()
    img_url = models.URLField()

    def __str__(self):
        return str(self.img_url)
