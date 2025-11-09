from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('team/', views.team, name='team'),
    path('projects/', views.projects, name='projects'),
    path('contact/', views.contact, name='contact'),
    path('achievements/', views.achievements, name='achievements'),
    path('gallery/', views.gallery_index, name='gallery_index'),
    path('gallery/projects/', views.gallery_projects, name='gallery_projects'),
    path('gallery/<slug:slug>/', views.gallery_section, name='gallery_section'),
    path('studio/', views.studio, name='studio'),
    path('login/', views.auth_login, name='login'),
    path('signup/', views.auth_signup, name='signup'),
    path('profile/', views.profile, name='profile'),
]
