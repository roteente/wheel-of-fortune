const readcons = require('readline-sync');
const nReadlines = require('n-readlines');
const file = new nReadlines('defaultlist.txt');

const fileLength = 3;
const playerNum = 3;

class Player {
  constructor(name) {
    this.name = name;
    this.tempScore = 0;
    this.permScore = 0;
  }
}

const wheel = [600, 300, 400, "LOSE A TURN", 800, 350, 450, 700, 300, 600, 5000, 600, 500, 300, 500, 800, 550, 400, 300, 900, 500, 300, 900, "BANKRUPT"];
function spinWheel() {
  return wheel[Math.floor(Math.random() * wheel.length)];
}

var round = 0;
var puzzle;
var puzzleHid = [];

function handleRound() {
  if (round <= fileLength) {
    round++;
    puzzle = file.next().toString().replace("\r", "");
    puzzleHid = [];
    for (let i = 0; i < puzzle.length; i++) {
      if (puzzle[i] == " ") {
        puzzleHid.push(" ");
      } else {
        puzzleHid.push("_");
      }
    }
  } else {
    console.log("The game is over!!!");
    let winner = 0;
    players[0].permScore += players[0].tempScore;
    let highScore = players[0].permScore;
    for (let i = 1; i < playerNum; i++) {
      players[i].permScore += players[i].tempScore;
      if (players[i].permScore > highScore) {
        winner = i;
        highScore = players[i].permScore;
      }
    }
    console.log(players[winner].name + " has won!!! With a score of " + highScore);
  }
}

function checkSolved() {
  if (puzzleHid.join("") == puzzle) {
    handleRound();
  }
}

const players = [];
for (let i = 0; i < playerNum; i++) {
  players[i] = new Player (readcons.question("Enter name of Player " + (i + 1) + ": ").toString());
}

handleRound();
for (let i = 0; i < playerNum; i++) {
  let theirTurn = true;
  while (theirTurn) {
    console.log(" ");
    console.log("Round " + round);
    console.log("Puzzle:");
    console.log(puzzleHid.join(""));
    console.log(players[i].name + "'s turn.");
    console.log("Current Score: " + players[i].tempScore);
    console.log("Permanent Score: " + players[i].permScore);
    console.log("Pick '1' to SPIN the wheel.");
    console.log("Pick '2' to buy a VOWEL.");
    console.log("Pick '3' to GUESS.");
    switch(parseInt(readcons.question("Choice: "))) {
      case 1:
        var wheelSpace = spinWheel();
        console.log("Landed on " + wheelSpace);
        if (wheelSpace == "LOSE A TURN") {
          console.log(players[i].name + " has lost their turn!");
          theirTurn = false;
          break;
        } else if (wheelSpace == "BANKRUPT") {
          console.log(players[i].name + " has gone bankrupt!");
          players[i].tempScore = 0;
          theirTurn = false;
          break;
        }

        var consonant = readcons.question("Choose a consonant: ").toString().toUpperCase();
        var count = 0;
        for (let i = 0; i < puzzle.length; i++) {
          if (puzzle[i] == consonant) {
            count++;
            puzzleHid[i] = consonant;
          }
        }

        if (count == 0) {
          console.log(players[i] + " guessed wrong!");
          theirTurn = false;
        } else {
          let prize = wheelSpace * count;
          players[i].tempScore += prize;
          console.log(players[i].name + " has earned " + prize);
          checkSolved();
        }
        break;
      case 2:
        players[i].tempScore -= 250;
        var vowel = readcons.question("Choose a vowel: ").toString().toUpperCase();
        var count = 0;
        for (let i = 0; i < puzzle.length; i++) {
          if (puzzle[i] == vowel) {
            count++;
            puzzleHid[i] = vowel;
          }
        }
        if (count == 0) {
          console.log(players[i].name + " guessed wrong!");
          theirTurn = false;
          break;
        }
        checkSolved();
        break;
      case 3:
        if (puzzle == readcons.question("What is your guess? ").toString().toUpperCase()) {
          console.log(players[i].name + " has guessed correctly!!!");
          if (players[i].tempScore < 1000) {
            console.log(players[i].name + " has been given 1000 permanent score.");
            players[i].permScore = 1000;
            players[i].tempScore = 0;
          } else {
            players[i].permScore = players[i].tempScore;
            players[i].tempScore = 0;
          }
          handleRound();
        } else {
          console.log(players[i].name + " has guessed wrong!!!");
          theirTurn = false;
        }
        break;
      default:
        console.log("Error, pick again.");
    }
  }
}