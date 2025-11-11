from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('', views.EventListCreateView.as_view(), name='event-list-create'),
    path('upcoming/', views.UpcomingEventsView.as_view(), name='upcoming-events'),
    path('<slug:slug>/', views.EventDetailView.as_view(), name='event-detail'),
]

category_urlpatterns = [
    path('', views.CategoryListView.as_view(), name='category-list'),
    path('<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
]


