#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from "gradient-string";
import { createSpinner } from "nanospinner";
import axios from "axios";

// Function to generate a random number between min and max (inclusive)
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to display welcome message
async function welcome() {
  const msg = `DIGIT DUEL`;
  figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 1000)
  ); // Wait for 1 second
  const rainbowTitle = chalkAnimation.rainbow("Welcome to digit duel");
  rainbowTitle.start();
  await new Promise((resolve) =>
    setTimeout(() => {
      rainbowTitle.stop();
      console.log(
        chalk.gray(
          "I've chosen a random number between 1 and 100. Can you guess it?\n"
        )
      );
      resolve();
    }, 1000)
  ); // Wait for 1 second
}

// Function to prompt the player for their name
async function askName() {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 1000)
  ); // Wait for 1 second
  const answer = await inquirer.prompt({
    name: "playerName",
    type: "input",
    message: "What is your name?",
    default: "Player",
  });
  return answer.playerName;
}

// Function to prompt the player to make a guess
async function makeGuess() {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 1000)
  ); // Wait for 1 second
  const answer = await inquirer.prompt({
    name: "guess",
    type: "input",
    message: "Make a guess (between 1 and 100):",
    validate: function (value) {
      const num = Number(value);
      if (isNaN(num)) {
        return "Please enter a valid number.";
      }
      if (num < 1 || num > 100) {
        return "Please enter a number between 1 and 100.";
      }
      return true;
    },
  });
  return parseInt(answer.guess);
}

// Function to display feedback based on the player's guess
async function displayFeedback(playerName, secretNumber, guess) {
  if (guess < secretNumber) {
    console.log(chalk.yellow("Too low!"));
  } else if (guess > secretNumber) {
    console.log(chalk.yellow("Too high!"));
  } else {
    const rainbowTitle = chalkAnimation.rainbow(
      `Congratulations, ${playerName}! You guessed the number correctly!`
    );
    rainbowTitle.start();
    await new Promise((resolve) =>
      setTimeout(() => {
        rainbowTitle.stop();
        resolve();
      }, 1000)
    ); // Wait for 1 second after rainbow animation
  }
}

// Function to display winner message with the number of attempts
async function displayWinner(playerName, attempts) {
  // Display winner message with attempts
  console.log(chalk.green(`You guessed the number in ${attempts} attempts.`));

  // Post data to the server
  try {
    // Define the player object to be sent to the server
    const playerData = {
      playerName: playerName,
      attempts: attempts,
    };

    // Make a POST request to the server endpoint
    const response = await axios.post(
      "http://localhost:4000/players",
      playerData
    );

    // Log success message if the request was successful
    console.log(
      chalk.green(
        "Player data saved successfully:",
        JSON.stringify(response.data)
      )
    );
  } catch (error) {
    // Log error message if the request fails
    console.error(chalk.red("Error saving player data:", error.message));
  }
}

// Main function to run the game
async function startGame() {
  // Display initial loading spinner
  const loadingSpinner = createSpinner("Loading...").start();
  await new Promise((resolve) =>
    setTimeout(() => {
      loadingSpinner.success();
      resolve();
    }, 1000)
  ); // Wait for 1 second

  // Display welcome message
  await welcome();

  // Ask for player's name
  const playerName = await askName();

  // Generate a random number between 1 and 100
  const secretNumber = generateRandomNumber(1, 100);
  // console.log("### Testing environment... ###");
  // console.log(secretNumber);

  let attempts = 0; // Counter for number of attempts

  // Start guessing loop
  while (true) {
    attempts++; // Increment attempts counter

    // Prompt player to make a guess
    const guess = await makeGuess();

    // Display feedback based on the guess
    await displayFeedback(playerName, secretNumber, guess);

    // If guess is correct, display winner message and exit loop
    if (guess === secretNumber) {
      // Display winner message and save player data
      await displayWinner(playerName, attempts);
      break;
    }
  }
}

// Start the game
startGame();
