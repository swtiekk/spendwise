from django.urls import path
from . import views

urlpatterns = [
    path('',        views.budget_list,    name='budget-list'),
    path('summary/', views.budget_summary, name='budget-summary'),
]