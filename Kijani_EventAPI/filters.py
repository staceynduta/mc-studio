"""
Filters for Event queries
"""

import django_filters
from django.db import models
from .models import Event


class EventFilter(django_filters.FilterSet):
    """Custom filter for Event model"""

    date_from = django_filters.DateTimeFilter(field_name='event_date', lookup_expr='gte')
    date_to = django_filters.DateTimeFilter(field_name='event_date', lookup_expr='lte')
    category = django_filters.CharFilter(method='filter_category')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    is_free = django_filters.BooleanFilter(field_name='is_free')
    status = django_filters.CharFilter(field_name='status')
    organizer = django_filters.NumberFilter(field_name='organizer__id')
    has_spots = django_filters.BooleanFilter(method='filter_has_spots')

    class Meta:
        model = Event
        fields = ['date_from', 'date_to', 'category', 'location', 'is_free', 'status', 'organizer']

    def filter_category(self, queryset, name, value):
        try:
            category_id = int(value)
            return queryset.filter(category__id=category_id)
        except ValueError:
            return queryset.filter(category__slug=value)

    def filter_has_spots(self, queryset, name, value):
        if value:
            return queryset.filter(current_attendees__lt=models.F('capacity'))
        return queryset


