from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView

from .models import FifteenPuzzle
from .serializers import FifteenPuzzleDetailsSerializer, FifteenPuzzleSerializer


class FifteenPuzzleAPIView(CreateAPIView):
    queryset = FifteenPuzzle.objects.all()
    serializer_class = FifteenPuzzleSerializer


class FifteenPuzzleDetailsAPIView(RetrieveUpdateAPIView):
    queryset = FifteenPuzzle.objects.all()
    serializer_class = FifteenPuzzleDetailsSerializer
    lookup_field = "username"
