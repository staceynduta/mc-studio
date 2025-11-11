from django.contrib import admin
from .models import Event, EventCategory


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'event_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'organizer', 'event_date', 'location',
        'capacity', 'current_attendees', 'status', 'is_published'
    ]
    list_filter = ['status', 'is_published', 'is_free', 'category', 'event_date']
    search_fields = ['title', 'description', 'location', 'organizer__username']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'event_date'
    ordering = ['-event_date']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'organizer', 'category')
        }),
        ('Date & Time', {
            'fields': ('event_date', 'end_date', 'registration_deadline')
        }),
        ('Location', {
            'fields': ('location', 'latitude', 'longitude')
        }),
        ('Capacity', {
            'fields': ('capacity', 'current_attendees', 'allow_waitlist')
        }),
        ('Pricing', {
            'fields': ('is_free', 'price')
        }),
        ('Status', {
            'fields': ('status', 'is_published', 'image_url')
        }),
    )
    readonly_fields = ['current_attendees', 'slug']
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('organizer', 'category')
