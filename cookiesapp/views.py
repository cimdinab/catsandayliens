from django.shortcuts import render, render_to_response
from .models import Description, Image
from django.http import JsonResponse
from django.core import serializers
import requests

# Create your views here.
def index(request):
    return render_to_response('index.html')

def save_img(request):
    if request.method == 'POST':
        cat_url = request.POST['img_url']
        new_cat_img = Image(img_url=cat_url)
        new_cat_img.save()
        return JsonResponse({})

def save_desc(request):
    if request.method == 'POST':
        new_cat_desc = Description()
        new_cat_desc.breed_id = request.POST['breed_id']
        new_cat_desc.name = request.POST.get('name')
        new_cat_desc.description = request.POST.get('description')
        new_cat_desc.save()
        return JsonResponse({})

def space(request):
        if request.method == 'GET':
                date = request.GET.get("date")
                query_params = "?date=" + date
                link = "http://localhost:7073/GET_nasa_aylien" + query_params
                data = requests.get(link).json()
                return JsonResponse(data)
                