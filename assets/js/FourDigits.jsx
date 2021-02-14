import React from "react";
import {
    create4Digits,
    getGuessAccuracy,
    isDuplicateGuess,
    isGuessCorrect,
    getBulls,
    getCows
} from "./logic";
// TODO: import socket functions

function GuessControls({
    inputValue,
    setInputValue,
    submitHandler,
    guessesSoFar
}) {

    const MAX_LENGTH = 4;

    // 4-tuple of digits 0-9
    const [guess, setGuess] = React.useState([]);
    const [canSubmit, setCanSubmit] = React.useState(false);

    function submitGuess() {
        submitHandler(guess);
        setInputValue("");
    }

    /***
     * Determine if input is valid and can be submitted as a guess.
     */
    React.useEffect(function () {
        const validGuess = inputValue.length === MAX_LENGTH;
        if (validGuess) {
            const nextGuess = Array.from(inputValue).map((e) => parseInt(e));
            const hasGuessedBefore = isDuplicateGuess(nextGuess, guessesSoFar);

            if (!hasGuessedBefore) {
                setGuess(nextGuess);
                setCanSubmit(true);
            }
        } else {
            setCanSubmit(false);
        }
    }, [inputValue]);

    /**
     * Validate input.
     * @param ev Keyboard event
     */
    function controlTextInput(ev) {
        const newInputValue = ev.target.value;
        const keyPressed = newInputValue[newInputValue.length - 1];
        if (isValidInput(inputValue, newInputValue, keyPressed)) {
            setInputValue(newInputValue);
        }
    }

    /**
     * Allow pressing enter for guess submission.
     * @param ev Keyboard event
     */
    function pressedEnter(ev) {
        if (ev.key === "Enter" && canSubmit) {
            submitGuess(guess);
        }
    }

    return (
        <div className={"input-container"} role={"group"}>
          <input className={"guess-field"} type={"text"} value={inputValue}
                 onKeyPress={pressedEnter}
                 maxLength={MAX_LENGTH} autoFocus={false}
                 onChange={controlTextInput}/>
          <div className={"buttons-container"}>
            <button className={"pure-button"}
                    onClick={() => setInputValue("")}>Clear
            </button>
            <button className={"pure-button pure-button-primary"}
                    disabled={!canSubmit}
                    onClick={() => submitGuess(guess)}>Submit
            </button>
          </div>
        </div>
    );
}

function GuessHistory({guesses}) {

    return (
        <div className={"guesses-container"}>
          <label className={"guess-list-label"}>Guesses:</label>
          <div className={"pure-g guess-list"}>
            {guesses.map((guess, i) => {
                return <div className={"pure-u-1-1 guess-item"}>
                         <div className={"pure-u-1-6"}>#{i + 1}</div>
                         <div className={"pure-u-1-4"}>{guess[0]}</div>
                         <div className={"pure-u-1-4"}>B: {guess[2]}</div>
                         <div className={"pure-u-1-4"}>C: {guess[1]}</div>
                       </div>;
            })}
          </div>
        </div>
    );

}

function GameOver({answer, restartGame}) {
    return <>
             <h1>Game Over.</h1>
             <p>The 4 digits were {answer}</p>
             <button className={"pure-button pure-button-primary"}
                     onClick={restartGame}>Restart
             </button>
           </>;
}

// Main Game Component
export default function FourDigits() {

    const MAX_GUESSES = 8;

    // 4-tuple of digits 0-9
    const [answer, setAnswer] = React.useState(create4Digits());
    // Array of [[n, n, n, n], numCorrectDigits, numCorrectPlacement]
    const [inputValue, setInputValue] = React.useState("");
    const [guessHistory, setGuessHistory] = React.useState([]);
    const [gameIsWon, setGameIsWon] = React.useState(false);

    function restartGame() {
        setAnswer(create4Digits());
        setGuessHistory([]);
        setGameIsWon(false);
        setInputValue("");
    }

    function submitGuess(guess) {
        if (isDuplicateGuess(guess, guessHistory)) {
            return;
        }

        const guessAccuracy = getGuessAccuracy(guess, answer);
        const guessIsCorrect = isGuessCorrect(guessAccuracy);

        if (guessIsCorrect) {
            setGameIsWon(true);
        } else {
            const numCorrectPlace = getBulls(guessAccuracy);
            const numCorrectDigits = getCows(guess, answer) - numCorrectPlace;
            const archivedGuess = [[guess, numCorrectDigits, numCorrectPlace]];
            setGuessHistory(guessHistory.concat(archivedGuess));
        }
    }

    /**
     * Conditionally select body.
     */
    let body;

    if (guessHistory.length === MAX_GUESSES) {
        body = <GameOver answer={answer} restartGame={restartGame}/>;
    } else {
        body =
            <>
              <h1 className={"game-title-header"}>4Digits</h1>
              {gameIsWon && <>
                              <h1 className={"game-won-header"}>You won!</h1>
                              <h2>The 4 digits were: {answer}</h2>
                              <button className={"pure-button pure-button-primary"}
                                      onClick={restartGame}>Restart
                              </button>
                            </>}
              {!gameIsWon && <>
                               <GuessControls inputValue={inputValue}
                                              setInputValue={setInputValue}
                                              submitHandler={submitGuess}
                                              guessesSoFar={guessHistory}/>
                               <div className={"button-main-restart-container"}>
                                 <button className={"pure-button button-main-restart"}
                                         onClick={restartGame}>Restart
                                 </button>
                               </div>
                             </>}
              <GuessHistory guesses={guessHistory}/>
            </>;
    }


    return (
        <div className={"game-container"}>
          {body}
        </div>
    );

}
