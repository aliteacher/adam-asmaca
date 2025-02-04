const wordsByCategory = {
    Movies: ["SCIENCEFICTION", "HORROR", "THRILLER", "ADVENTURE", "ACTION", "WESTERN", "ANIMATION", "CRIME", "CARTOON", "MUSICAL"],
    Adjectives: ["BORING", "BORED", "EXCITING", "EXCITED", "INTERESTING"],
};

let selectedWord, selectedCategory, guessedLetters, wrongGuesses;
let score = 0;
const maxWrongGuesses = 6;

const wordContainer = document.getElementById("word-container");
const restartBtn = document.getElementById("restart-btn");
const message = document.getElementById("message");
const wrongLetters = document.getElementById("wrong-letters");
const hangmanDraw = document.getElementById("hangman-draw");
const scoreDisplay = document.getElementById("score");
const categoryHint = document.getElementById("category-hint");

// 📌 Klavyeyi oluşturma fonksiyonu
function createKeyboard() {
    const keyboardContainer = document.getElementById("keyboard");
    keyboardContainer.innerHTML = ""; // Önceki klavyeyi temizle

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ- ".split(""); // Harfler + boşluk

    letters.forEach(letter => {
        const button = document.createElement("button");
        button.innerText = letter === " " ? "SPACE" : letter;
        button.classList.add("key-button");
        button.onclick = () => checkGuess(letter);
        keyboardContainer.appendChild(button);
    });
}

// 📌 Oyunu başlatma fonksiyonu
function startGame() {
    const categories = Object.keys(wordsByCategory);
    selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const wordList = wordsByCategory[selectedCategory];
    selectedWord = wordList[Math.floor(Math.random() * wordList.length)];

    guessedLetters = [];
    wrongGuesses = 0;
    wrongLetters.innerText = "";
    message.innerText = "";
    score = 0;  // Skoru sıfırla
    categoryHint.innerText = selectedCategory;

    displayWord();
    updateHangman();
    createKeyboard();
}

// 📌 Kelimeyi göster
function displayWord() {
    let display = selectedWord.split('').map(letter => 
        guessedLetters.includes(letter) ? letter : "_"
    ).join(" ");
    wordContainer.innerHTML = display;
}

// 📌 Adam Asmaca Çizimi
function updateHangman() {
    const hangmanStages = ["", "O", "O |", "O/|", "O/|\\", "O/|\\ /", "O/|\\ /\\"];
    hangmanDraw.innerHTML = `<pre>${hangmanStages[wrongGuesses]}</pre>`;
}

// 📌 Harf kontrolü ve tahmin
function checkGuess(guess) {
    if (guessedLetters.includes(guess)) return;

    guessedLetters.push(guess);
    if (selectedWord.includes(guess)) {
        message.innerText = "Doğru!";
        score += 10;
    } else {
        message.innerText = "Yanlış!";
        wrongGuesses++;
        wrongLetters.innerText += guess + " ";
        score -= 5;
    }

    displayWord();
    updateHangman();
    scoreDisplay.innerText = score;

    checkGameOver();
}

// 📌 Oyunun bitip bitmediğini kontrol et
function checkGameOver() {
    if (!wordContainer.innerText.includes("_")) {
        message.innerText = "Kazandın!";
        disableKeyboard();
    }

    if (wrongGuesses >= maxWrongGuesses) {
        message.innerText = `Kaybettin! Kelime: ${selectedWord}`;
        disableKeyboard();
    }
}

// 📌 Klavyeyi devre dışı bırak
function disableKeyboard() {
    document.querySelectorAll(".key-button").forEach(button => {
        button.disabled = true;
    });
}

// 📌 "Yeniden Başlat" butonu
restartBtn.addEventListener("click", startGame);

// 📌 Oyunu başlat
startGame();
