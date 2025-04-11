document.addEventListener('DOMContentLoaded', function() {
    const rockBtn = document.getElementById('rock');
    const paperBtn = document.getElementById('paper');
    const scissorsBtn = document.getElementById('scissors');

    const userChoiceElement = document.getElementById('user-choice');
    const computerChoiceElement = document.getElementById('computer-choice');
    const resultElement = document.getElementById('result');

    rockBtn.addEventListener('click', function() {
        playGame('rock');
    });

    paperBtn.addEventListener('click', function() {
        playGame('paper');
    });

    scissorsBtn.addEventListener('click', function() {
        playGame('scissors');
    });

    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }

    function determineWinner(userChoice, computerChoice) {
        if (userChoice === computerChoice) {
            return "It's a tie!";
        }

        if (userChoice === 'rock') {
            if (computerChoice === 'scissors') {
                return "You win!";
            } else {
                return "Computer wins!";
            }
        } else if (userChoice === 'paper') {
            if (computerChoice === 'rock') {
                return "You win!";
            } else {
                return "Computer wins!";
            }
        } else if (userChoice === 'scissors') {
            if (computerChoice === 'paper') {
                return "You win!";
            } else {
                return "Computer wins!";
            }
        }
    }

    function playGame(userChoice) {
        const computerChoice = getComputerChoice();

        userChoiceElement.textContent = 'Your choice: ' + userChoice;
        computerChoiceElement.textContent = 'Computers choice: ' + computerChoice;

        const result = determineWinner(userChoice, computerChoice);
        resultElement.textContent = 'Result: ' + result;
    }
});