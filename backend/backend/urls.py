from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("bingo/", include("bingo.urls")),
    path("admin/", admin.site.urls),
]
