from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils.text import slugify
from django.utils import timezone


class EventCategory(models.Model):
    """Event categories for classification"""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_categories'
        ordering = ['name']
        verbose_name = 'Event Category'
        verbose_name_plural = 'Event Categories'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def event_count(self):
        """Return count of active events in this category"""
        return self.events.filter(is_published=True).count()


class Event(models.Model):
    """Main Event model"""

    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    # Basic Information
    title = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()

    # Date and Time
    event_date = models.DateTimeField(db_index=True)
    end_date = models.DateTimeField(blank=True, null=True)
    registration_deadline = models.DateTimeField(blank=True, null=True)

    # Location
    location = models.CharField(max_length=300)
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    # Relationships
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organized_events'
    )
    category = models.ForeignKey(
        EventCategory,
        on_delete=models.SET_NULL,
        related_name='events',
        blank=True,
        null=True
    )

    # Capacity Management
    capacity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    current_attendees = models.PositiveIntegerField(default=0)
    allow_waitlist = models.BooleanField(default=False)

    # Pricing
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )
    is_free = models.BooleanField(default=True)

    # Status and Publishing
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='upcoming',
        db_index=True
    )
    is_published = models.BooleanField(default=True, db_index=True)

    # Media
    image_url = models.URLField(max_length=500, blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'events'
        ordering = ['-event_date']
        verbose_name = 'Event'
        verbose_name_plural = 'Events'
        indexes = [
            models.Index(fields=['event_date', 'is_published']),
            models.Index(fields=['status']),
            models.Index(fields=['organizer']),
            models.Index(fields=['category']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(capacity__gt=0),
                name='capacity_positive'
            ),
            models.CheckConstraint(
                check=models.Q(current_attendees__gte=0),
                name='attendees_non_negative'
            ),
            models.CheckConstraint(
                check=models.Q(price__gte=0),
                name='price_non_negative'
            ),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """Generate slug and update status"""
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Event.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # Auto-update status based on dates
        now = timezone.now()
        if self.status != 'cancelled':
            if self.event_date > now:
                self.status = 'upcoming'
            elif self.end_date and self.end_date < now:
                self.status = 'completed'
            elif self.event_date <= now and (not self.end_date or self.end_date >= now):
                self.status = 'ongoing'

        super().save(*args, **kwargs)

    @property
    def is_full(self):
        """Check if event is at capacity"""
        return self.current_attendees >= self.capacity

    @property
    def available_spots(self):
        """Return number of available spots"""
        return max(0, self.capacity - self.current_attendees)

    @property
    def is_past(self):
        """Check if event has passed"""
        return self.event_date < timezone.now()

    @property
    def is_upcoming(self):
        """Check if event is upcoming"""
        return self.event_date > timezone.now()

    def can_register(self):
        """Check if registration is still possible"""
        if self.is_past or not self.is_published or self.status == 'cancelled':
            return False
        if self.registration_deadline and self.registration_deadline < timezone.now():
            return False
        if self.is_full and not self.allow_waitlist:
            return False
        return True

    def increment_attendees(self):
        """Increment attendee count"""
        self.current_attendees += 1
        self.save(update_fields=['current_attendees'])

    def decrement_attendees(self):
        """Decrement attendee count"""
        if self.current_attendees > 0:
            self.current_attendees -= 1
            self.save(update_fields=['current_attendees'])
