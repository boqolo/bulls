import React from "react";
import {
    create4Digits,
    getGuessAccuracy,
    isDuplicateGuess,
    isGuessCorrect,
    getBulls,
    getCows
} from "./logic";
import { ch_join, ch_guess, ch_reset } from "./socket";

function GuessControls({
    inputValue,
    setInputValue,
    submitHandler,
    canSubmit
}) {

    /**
     * Checks if the change in the Input field initiated by key press is valid
     * (i.e. key pressed is a digit 0-9, the digit is unique, doesn't exceed
     * 4 digits, or is deleting a character).
     * @param currInputValue the current value of the input field
     * @param newInputValue the new value of the input field based on key press
     * @param keyPressed the key pressed
     * @returns True if key press is valid
     */
    function isValidInput(currInputValue, newInputValue, keyPressed) {
        const validKeys = "1234567890";
        return newInputValue.length < currInputValue.length ||
            (currInputValue.length < newInputValue.length &&
             !currInputValue.includes(keyPressed)
             && validKeys.includes(keyPressed));
    }

    /**
     * Validate input.
     * @param ev Keyboard event
     */
    function setTextInput(ev) {
        // TODO validate (send letter)?
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
        if (ev.key === "Enter") {
            submitHandler(inputValue);
        }
    }

    return (
        <div className={"input-container"} role={"group"}>
          <input className={"guess-field"} type={"text"} value={inputValue}
                 onKeyPress={pressedEnter}
                 autoFocus={false}
                 onChange={setTextInput}/>
          <div className={"buttons-container"}>
            <button className={"pure-button"}
                    onClick={() => setInputValue("")}>Clear
            </button>
            <button className={"pure-button pure-button-primary"}
                    disabled={!canSubmit}
                    onClick={() => submitHandler(inputValue)}>Submit
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
            {Object.keys(guesses).map(k => {
                return <div className={"pure-u-1-1 guess-item"}>
                         <div className={"pure-u-1-6"}>#{parseInt(k) + 1}</div>
                         <div className={"pure-u-1-4"}>{guesses[k][0]}</div>
                         <div className={"pure-u-1-4"}>B: {guesses[k][1]}</div>
                         <div className={"pure-u-1-4"}>C: {guesses[k][2]}</div>
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

    const MAX_DIGITS = 4;

    // 4-tuple of digits 0-9
    const [state, setState] = React.useState({
        answer: undefined, // TODO remove me
        inputValue: "",
        guessHistory: {},
        gameWon: false,
        gameOver: false,
        message: ""
    });
    const {answer, inputValue, guessHistory, gameWon, gameOver, message} = state;
    // const [answer, setAnswer] = React.useState(create4Digits());
    // // Array of [[n, n, n, n], numCorrectDigits, numCorrectPlacement]
    // const [inputValue, setInputValue] = React.useState("");
    // const [guessHistory, setGuessHistory] = React.useState([]);
    // const [gameWon, setGameIsWon] = React.useState(false);

    /**
     * Set channel callback.
     */
    React.useEffect(function() {
        console.log("Joining socket and setting callback from main component.");
        ch_join(setState);
    }, []);

    function setInputValue(newValue) {
        if (newValue.length <= MAX_DIGITS) {
            setState({...state, inputValue: newValue});
        }
    }

    function restartGame() {
        ch_reset();
    }

    function submitGuess(guess) {
        ch_guess(guess);
    }

    /**
     * Conditionally select body.
     */
    let body;

    if (gameOver) {
        body = <GameOver answer={answer} restartGame={restartGame}/>;
    } else {
        const canSubmit = inputValue.length === MAX_DIGITS;
        body =
            <>
              <h1 className={"game-title-header"}>4Digits</h1>
              {gameWon && <>
                            <h1 className={"game-won-header"}>You won!</h1>
                            <h2>The 4 digits were: {answer}</h2>
                            <button className={"pure-button pure-button-primary"}
                                    onClick={restartGame}>Restart
                            </button>
                          </>}
              {!gameWon && <>
       <GuessControls inputValue={inputValue}
                      setInputValue={setInputValue}
                      submitHandler={submitGuess}
                      guessesSoFar={guessHistory}
                      canSubmit={canSubmit}/>
       <div className={"button-main-restart-container"}>
         <button className={"pure-button button-main-restart"}
                 onClick={restartGame}>Restart
         </button>
       </div>
       {message && !canSubmit && <div className="alert-warning">{message}</div>}
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
