defmodule Hw05Web.GameChannel do
  use Hw05Web, :channel # imports module functions to ns

  # @impl true
  def join("game:" <> subtopic, payload, socket) do
    case subtopic do
      "lobby" -> {:ok, "hello, lobbyist", socket}
      _ -> {:ok, "hello user", socket}
    end
  end

end
