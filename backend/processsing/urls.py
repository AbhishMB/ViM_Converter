from django.urls import path
from .views import upload, process, stream_video
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('upload/', upload, name='upload'),
    path('process/', process, name='process'),
    path('stream/', stream_video, name='stream'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)