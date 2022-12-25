from django.contrib import messages
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect, render

from .models import Game


def home(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        username = request.POST.get("username")
        room = request.POST.get("room")
        option = request.POST.get("option")
        if option == "1":
            game = Game.objects.filter(room=room).first()
            if game is None:
                messages.success(request, "Room not found")
                return redirect("/tictactoe")
            if game.is_over:
                messages.success(request, "Game is over")
                return redirect("/tictactoe")
            game.opponent = username
            game.save()
            return redirect(f"play/{room}?username={username}")
        else:
            if username and room:
                game = Game(host=username, room=room)
                game.save()
                return redirect(f"play/{room}?username={username}")
    return render(request, "tictactoe/home.html")


def play(request: HttpRequest, room: str) -> HttpResponse:
    username = request.GET.get("username")
    context = {"room": room, "username": username}
    return render(request, "tictactoe/play.html", context)
