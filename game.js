const storyEl = document.getElementById('story');
const choicesEl = document.getElementById('choices');
const promptEl = document.getElementById('promptText');
const bgmEl = document.getElementById('bgm');

let musicStarted = false;

function ensureMusic() {
  if (!bgmEl || musicStarted) return;

  bgmEl.volume = 0.35;

  try {
    bgmEl.muted = false;
    const playPromise = bgmEl.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicStarted = true;
        })
        .catch(err => {
          console.warn("Audio blocked until user gesture:", err);
        });
    } else {
      musicStarted = true;
    }
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}



function clearChoices() {
  choicesEl.innerHTML = '';
  promptEl.textContent = '';
}

function logMessage(text) {
  const p = document.createElement('p');
  p.textContent = text;
  storyEl.appendChild(p);
  storyEl.scrollTop = storyEl.scrollHeight;
}

function resetGame() {
  reachedFinal = 0;
  storyEl.innerHTML = '';
  startGame();
}

// =============================
// Game Flow (C logic in JS) - reffer my Hackerrank repo for C logic (39th Problem)
// =============================

function startGame() {
  logMessage("You stand at the entrance of the labyrinth.");
  promptEl.textContent = "Choose a path through the labyrinth:";
  clearChoices();

  const leftBtn = document.createElement('button');
  leftBtn.textContent = "1: Left Path (Swamp)";
  leftBtn.onclick = () => handlePath(1);

  const middleBtn = document.createElement('button');
  middleBtn.textContent = "2: Middle Path (Maze)";
  middleBtn.onclick = () => handlePath(2);

  const rightBtn = document.createElement('button');
  rightBtn.textContent = "3: Right Path (Vault)";
  rightBtn.onclick = () => handlePath(3);

  choicesEl.appendChild(leftBtn);
  choicesEl.appendChild(middleBtn);
  choicesEl.appendChild(rightBtn);
}

function endGame() {

  const btns = choicesEl.querySelectorAll('button');
  btns.forEach(b => b.disabled = true);

  const restart = document.createElement('button');
  restart.textContent = "Play Again";
  restart.onclick = resetGame;
  choicesEl.innerHTML = '';
  choicesEl.appendChild(restart);
  promptEl.textContent = "The journey has ended. Dare to try again?";
}

function gotoFinalRoom() {
  reachedFinal = 1;
 
  if (reachedFinal === 1) {
    promptEl.textContent = "You reach the final treasure room. Choose a chest:";
    choicesEl.innerHTML = '';

    const chest1 = document.createElement('button');
    chest1.textContent = "1: Golden Chest";
    chest1.onclick = () => handleChest(1);

    const chest2 = document.createElement('button');
    chest2.textContent = "2: Silver Chest";
    chest2.onclick = () => handleChest(2);

    const chest3 = document.createElement('button');
    chest3.textContent = "3: Bronze Chest";
    chest3.onclick = () => handleChest(3);

    choicesEl.appendChild(chest1);
    choicesEl.appendChild(chest2);
    choicesEl.appendChild(chest3);
  }
}


function handlePath(path) {
  ensureMusic(); 
  clearChoices();

  if (path === 1) {
    
    logMessage("Player chooses the Left path.");
    promptEl.textContent = "A murky swamp blocks your way. What will you do?";

    
    const onFootBtn = document.createElement('button');
    onFootBtn.textContent = "1: Attempt to cross on foot";
    onFootBtn.onclick = () => {
      
      logMessage("Poor choice, Game Over!");
      endGame();
    };

    const searchBridgeBtn = document.createElement('button');
    searchBridgeBtn.textContent = "2: Search for a bridge";
    searchBridgeBtn.onclick = () => {
   
      logMessage("Player found a bridge.");
      handleBridge();
    };

    choicesEl.appendChild(onFootBtn);
    choicesEl.appendChild(searchBridgeBtn);
  }

  else if (path === 2) {
    
    logMessage("Player chooses the Middle path.");
    promptEl.textContent =
      "Solve the puzzle to escape the maze:\n" +
      "I am a three-digit number. My second digit is four times bigger than the third digit,\n" +
      "my first digit is three less than the second digit, and the sum of my digits is 15.";

    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';

    const ansInput = document.createElement('input');
    ansInput.type = 'number';
    ansInput.placeholder = "Enter your 3-digit answer";
    ansInput.id = 'mazeAnswer';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Submit Answer";
    submitBtn.onclick = () => {
      const ans = parseInt(ansInput.value, 10);

      if (ans !== 582) {
        logMessage("Foolish player, Game Over!");
        endGame();
      } else {
        logMessage("Player solved the puzzle.");
        gotoFinalRoom();
      }
    };

    inputRow.appendChild(ansInput);
    inputRow.appendChild(submitBtn);
    choicesEl.appendChild(inputRow);
  }

  else if (path === 3) {
 
    logMessage("Player chooses the Right path.");
    promptEl.textContent =
      "You face a locked vault. Solve the sequence to unlock it:\n" +
      "2, 6, 12, 20, __ ?";

    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';

    const ansInput = document.createElement('input');
    ansInput.type = 'number';
    ansInput.placeholder = "Enter the next number";
    ansInput.id = 'vaultAnswer';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Submit Answer";
    submitBtn.onclick = () => {
      const ans = parseInt(ansInput.value, 10);

      if (ans !== 30) {
        logMessage("Foolish player, Game Over!");
        endGame();
      } else {
        logMessage("Player solved the puzzle.");
        gotoFinalRoom();
      }
    };

    inputRow.appendChild(ansInput);
    inputRow.appendChild(submitBtn);
    choicesEl.appendChild(inputRow);
  }

  else {
   
    logMessage("The path you seek does not exist. The labyrinth rejects you.");
    endGame();
  }
}

function handleBridge() {
  clearChoices();
  promptEl.textContent = "You test the bridge. What fate awaits?";

  const sturdyBtn = document.createElement('button');
  sturdyBtn.textContent = "1: The bridge is sturdy";
  sturdyBtn.onclick = () => {
  
    logMessage("Player crosses the bridge safely.");
    gotoFinalRoom();
  };

  const collapseBtn = document.createElement('button');
  collapseBtn.textContent = "2: The bridge collapses";
  collapseBtn.onclick = () => {
 
    logMessage("Poor luck, Game Over!");
    endGame();
  };

  choicesEl.appendChild(sturdyBtn);
  choicesEl.appendChild(collapseBtn);
}

function handleChest(chest) {
  clearChoices();

  if (chest === 1) {
    logMessage("All that glitters is not gold, Game Over!");
  }
  else if (chest === 2) {
    logMessage("All your efforts were for nothing, Game Over!");
  }
  else if (chest === 3) {
    logMessage("Congratulations!! You won the treasure.");
  }

  endGame();
}

startGame();