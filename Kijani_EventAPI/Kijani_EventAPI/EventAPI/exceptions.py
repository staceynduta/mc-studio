"""
Custom exception handler
"""

from rest_framework.views import exception_handler
from django.utils import timezone


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            'error': exc.__class__.__name__.replace('Exception', '').lower(),
            'message': str(exc),
            'details': response.data,
            'timestamp': timezone.now().isoformat(),
        }

    return response


