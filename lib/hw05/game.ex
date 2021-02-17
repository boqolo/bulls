defmodule Hw05.Game do

  @max_guesses 8

  def new do
    %{
      answer: create4Digits(),
      inputValue: "",
      guessHistory: %{},
      gameWon: false,
      gameOver: false,
      message: ""
    }
  end

  def makeGuess(guess, %{answer: answer, guessHistory: history} = game0) do
    if validGuess?(guess) do
      accuracy = guessAccuracy(guess, answer)
      if correctGuess?(accuracy) do
        %{game0 | gameWon: true}
      else
        bulls = numBulls(accuracy)
        cows = numCows(guess, answer) - bulls
        guessNumber = Enum.count(Map.keys(game0.guessHistory))
        newHistory = Map.put(history, guessNumber, [guess, bulls, cows])
        game1 = %{game0 | inputValue: "", guessHistory: newHistory}
        if Enum.count(Map.keys(game1.guessHistory)) == @max_guesses do
          %{game1 | game0Over: true}
        else
          %{game1 | message: ""}
        end
      end
    else
      # TODO append user message
      %{game0 | message: "Try again playa"}
    end
  end

  def validGuess?(guess) do
      # TODO
      true
  end

  # answer, guess -> [Integer, Integer, Integer, Integer]
  # guessAccuracy -> [true/false, t/f, t/f, t/f]
  # guessHistory  -> [numBulls (Integer), numCows (Integer)]

  @doc"""
  Generate the 4 random, unique digits in [1, 9] as the answer to a game.
  """
  def create4Digits() do
    digits = Enum.map(1..4, fn(_) -> :rand.uniform(9) end)
    numUniq = Enum.count(Enum.uniq(digits))
    case numUniq do
      4 -> digits
      _ -> create4Digits()
    end
  end

  @doc"""
  Given a guess and answer, returns a representation of the accuracy of the
  guess as a 4-tuple of true/false.
  """
  def guessAccuracy(guess, answer) do
    indices = Enum.count(answer) - 1
    Enum.map(0..indices, fn(i) -> Enum.at(guess, i) == Enum.at(answer, i) end)
  end

  @doc"""
  Check if the guessAccuracy contains all true indicating a correct guess.
  """
  def correctGuess?(guessAccuracy) do
    Enum.all?(guessAccuracy, fn(e) -> e end)
  end

  @doc"""
  Check if a guess is already represented in the guessHistory.
  """
  def duplicateGuess?(guess, guessHistory) do
    numPrevGuesses = Map.keys(guessHistory)
    Enum.any?(numPrevGuesses, fn(i) -> {prevGuess, _, _} = Map.get(guessHistory, i)
      prevGuess == guess
    end)
  end

  @doc"""
  Calculate the number of correct digits based on the guessAccuracy (count trues)
  """
  def numBulls(guessAccuracy) do
    Enum.count(guessAccuracy, fn(correct) -> correct end)
  end

  @doc"""
  Calculate number of common digits between the guess and answer.
  """
  def numCows(guess, answer) do
    Enum.count(guess, fn(d) -> Enum.member?(answer, d) end)
  end

end # end module
