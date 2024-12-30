import os
import logging.config
from datetime import datetime

# Create logs directory if it doesn't exist
LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
os.makedirs(LOGS_DIR, exist_ok=True)

# Generate log filenames with timestamp
timestamp = datetime.now().strftime('%Y%m%d')
ERROR_LOG = os.path.join(LOGS_DIR, f'error_{timestamp}.log')
INFO_LOG = os.path.join(LOGS_DIR, f'info_{timestamp}.log')
DEBUG_LOG = os.path.join(LOGS_DIR, f'debug_{timestamp}.log')

# Logging configuration
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': ERROR_LOG,
            'formatter': 'verbose',
        },
        'info_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': INFO_LOG,
            'formatter': 'verbose',
        },
        'debug_file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': DEBUG_LOG,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'error_file'],
            'level': 'INFO',
            'propagate': True,
        },
        'apps': {
            'handlers': ['console', 'error_file', 'info_file', 'debug_file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'apps.core': {
            'handlers': ['console', 'error_file', 'info_file', 'debug_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'apps.accounts': {
            'handlers': ['console', 'error_file', 'info_file', 'debug_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'apps.finance': {
            'handlers': ['console', 'error_file', 'info_file', 'debug_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# Apply logging configuration
logging.config.dictConfig(LOGGING_CONFIG)
