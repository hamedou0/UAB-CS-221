function grabUserInput() {
    let userInput = prompt("Enter your choice: Rock, Paper, or Scissors");

    if (userInput === null) {
        return null;
    }

    userInput = userInput.toLowerCase();

    if (userInput !== "rock" && userInput !== "paper" && userInput !== "scissors") {
        alert("Invalid choice! Please enter Rock, Paper, or Scissors.");
        return grabUserInput();
    }

    return userInput;
}

function getComputerChoice() {
    let randomNumber = Math.random();

    if (randomNumber < 0.33) {
        return "rock";
    } else if (randomNumber < 0.67) {
        return "paper";
    } else {
        return "scissors";
    }
}

function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return "tie";
    }

    if (userChoice === "rock") {
        if (computerChoice === "scissors") {
            return "user";
        } else {
            return "computer";
        }
    } else if (userChoice === "paper") {
        if (computerChoice === "rock") {
            return "user";
        } else {
            return "computer";
        }
    } else if (userChoice === "scissors") {
        if (computerChoice === "paper") {
            return "user";
        } else {
            return "computer";
        }
    }
}

function announceResult(userChoice, computerChoice, winner) {
    console.log("User chose: " + userChoice);
    console.log("Computer chose: " + computerChoice);

    if (winner === "tie") {
        console.log("It's a tie!");
    } else if (winner === "user") {
        console.log("User wins!");
    } else {
        console.log("Computer wins!");
    }

    let playAgain = confirm("Do you want to continue the game?");
    if (playAgain) {
        playGame();
    } else {
        console.log("Thanks for playing!");
    }
}

function playGame() {
    let userChoice = grabUserInput();

    if (userChoice === null) {
        console.log("Game over.");
        return;
    }

    let computerChoice = getComputerChoice();

    let winner = determineWinner(userChoice, computerChoice);

    announceResult(userChoice, computerChoice, winner);
}

playGame();