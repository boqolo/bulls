defmodule Hw05Web.GameChannel do
  use Hw05Web, :channel # imports module functions to ns

  alias Hw05.Game

  @impl true
  def join("game:" <> number, _payload, socket0) do
    # This is required to be defined to handle joining the channel
    game = Game.new()
    socket1 = assign(socket0, game: game) # setting a new socket state
    {:ok, game, socket1} # send response. {status, jsonResp, socketConn}
  end

  @impl true
  def handle_in("guess", guessStr, socket0) do
    # These are required to match requests hitting the channel
    game = guessStr
    |> String.graphemes()
    |> Enum.map(fn(d) -> elem(Integer.parse(d), 0) end)
    |> Game.makeGuess(socket0.assigns.game)
    socket1 = assign(socket0, game: game)
    {:reply, {:ok, game}, socket1} # {status, {status response}, socketConn}
  end

  # this tells you that you are implementing functions from another module
  @impl true
  def handle_in("reset", _payload, socket0) do
    game = Game.new()
    socket1 = assign(socket0, game: game)
    {:reply, {:ok, game}, socket1}
  end

end
