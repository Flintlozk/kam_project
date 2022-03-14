"""
Django settings for nlp project.

Generated by 'django-admin startproject' using Django 3.1.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'm6hpm5mv7**42_d_ff&#wzw(j-&hy83&4dvszmg*ay5t3i#^4s'

ALLOWED_HOSTS = ['localhost','172.16.10.4','10.148.15.192','10.148.15.193']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'analysis'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

# STATIC_ROOT = os.path.join(BASE_DIR, 'static')

ROOT_URLCONF = 'nlp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'nlp.wsgi.application'

DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'CLIENT' : {
            'name': 'plusmar-staging',
            'host': 'mongodb+srv://plusmar-staging:cA0lZMEiwQRG3sRd@itoppluscluster.ixeww.gcp.mongodb.net/plusmar-staging?retryWrites=true&w=majority',
            'username': 'plusmar-staging',
            'password': 'cA0lZMEiwQRG3sRd',
        }
    },
    'itppg': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'plusmar-staging',
        'USER': 'developer',
        'PASSWORD': 'tbdadmin',
        'HOST': '35.186.155.175',
        'PORT': '5432',
    }
}

if 'STAGE' in os.environ:
    if os.environ['STAGE'] == 'PRODUCTION':
        DEBUG = False
        DATABASES = {
            'default': {
                'ENGINE': 'djongo',
                'CLIENT' : {
                    'name': os.environ['DB_NAME_MONGO'],
                    'host': os.environ['DB_SERVICE_MONGO'],
                    'username': os.environ['DB_USER_MONGO'],
                    'password': os.environ['DB_PASS_MONGO'],
                }
            },
            'itppg': {
                'ENGINE': 'django.db.backends.postgresql_psycopg2',
                'NAME': os.environ['DB_NAME_PG'],
                'USER': os.environ['DB_USER_PG'],
                'PASSWORD': os.environ['DB_PASS_PG'],
                'HOST': os.environ['DB_SERVICE_PG'],
                'PORT': os.environ['DB_PORT_PG'],
            }
        }
        
# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
