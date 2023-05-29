import factory

from tictactoe.models import TicTacToePlayer, TicTacToeRoom


class TicTacToeRoomFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TicTacToeRoom

    room_name = "testroom"
    game_state = True
    total_players = 0
    board_state = ["", "", "", "", "", "", "", "", ""]

    @factory.post_generation
    def players(self, create, extracted, **kwargs) -> None:
        if create and extracted:
            for player in extracted:
                self.players.add(player)


class TicTacToePlayerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TicTacToePlayer

    username = "player"
    figure = "O"
    is_active = True
    is_winner = False
    is_ready = False
