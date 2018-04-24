from django.shortcuts import render, redirect
from django.http import HttpResponse

def snow(request):
    return HttpResponse('test_ok')