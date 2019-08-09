from django.contrib import admin
from .models import Description, Image

# Register your models here.
class DescriptionAdmin(admin.ModelAdmin):
    list_display = ('pk', 'breed_id', 'name', 'description')
    search_fields = ['pk', 'breed_id', 'name']

class ImageAdmin(admin.ModelAdmin):
    list_display = ('pk', 'img_url')

admin.site.register(Description, DescriptionAdmin)
admin.site.register(Image, ImageAdmin)