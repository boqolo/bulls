defmodule Hw05Web.GameChannel do
  use Hw05Web, :channel # imports module functions to ns

  alias Hw05.{Game, SecretAgent} # aliasing modules for easier use
  require Logger

  @impl true
  def join("game:" <> number, _payload, socket0) do
    # This is required to be defined to handle joining the channel
    socket1 = assign(socket0, game: Game.new(), answer: Game.create4Digits())
    {:ok, socket1.assigns.game, socket1} # send response. {status, jsonResp, socketConn}
  end

  @impl true
  def handle_in("guess", guessStr, socket0) do
    # These are required to match requests hitting the channel
    %{game: game, answer: answer} = socket0.assigns
    Logger.debug(inspect(socket0.assigns.game))
    updatedGame = guessStr
    |> String.graphemes()
    |> Enum.map(fn(d) -> elem(Integer.parse(d), 0) end) # convert
    |> Game.makeGuess(answer, game)
    socket1 = assign(socket0, game: updatedGame)
    {:reply, {:ok, updatedGame}, socket1} # {status, {status response}, socketConn}
  end

  # this tells you that you are implementing functions from another module
  @impl true
  def handle_in("reset", _payload, socket0) do
    socket1 = assign(socket0, game: Game.new())
    {:reply, {:ok, socket1.assigns.game}, socket1}
  end

  @impl true
  def handle_in("validate", inputValue, socket0) do
    %{game: game0} = socket0.assigns
    invalidInput = Regex.match?(~r/\D|0/, inputValue)
    maxInput = String.length(inputValue) > Game.num_digits
    unless invalidInput || maxInput do
      game1 = %{game0 | inputValue: inputValue}
      socket1 = assign(socket0, game: game1)
      {:reply, {:ok, game1}, socket1}
    else
      {:reply, {:ok, game0}, socket0}
    end
  end

end
