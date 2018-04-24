from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic import TemplateView

# Create your views here.
class SnowView(TemplateView):
	template_name = "snow.html"

class BulletView(TemplateView):
	template_name = 'bullet.html'