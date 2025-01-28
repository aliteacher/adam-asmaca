const wordsByCategory = {
    Movies: ["SCIENCEFICTION", "HORROR", "THRILLER", "ADVENTURE", "ACTION", 
             "COMEDY", "FANTASY", "ANIMATION", "ROMANTIC", "MUSICAL", 
             "WESTERN", "FAIRY TALE", "CARTOON", "DOCUMENTARY"],
    Adjectives: ["BORING", "BORED", "EXCITING", "EXCITED", "INTERESTING", 
                 "INTERESTED", "ENJOYABLE", "ENTERTAINING", "FUNNY", 
                 "ABSURD", "PLEASANT", "GREAT", "FRIENDLY", "FRIGHTENING", 
                 "TERRIBLE", "HONEST", "HELPFUL", "BEAUTIFUL", "UGLY", 
                 "STRONG", "BRAVE", "QUIET", "YOUNG", "GIANT", "HORRIBLE"],
    Animals: ["ELEPHANT", "TIGER", "LION", "KANGAROO", "DOLPHIN", 
              "PENGUIN", "CROCODILE", "FLAMINGO", "RHINOCEROS", "GIRAFFE"],
    Cities: ["ISTANBUL", "LONDON", "PARIS", "TOKYO", "BERLIN", 
             "ROME", "NEWYORK", "MOSCOW", "DUBAI", "BEIJING"]
};

let selectedWord, selectedCategory, guessedLetters, wrongGuesses;
let score = 0;
const maxWrongGuesses = 7;

const wordContainer = document.getElementById("word-container");
const letterInput = document.getElementById("letter-input");
const guessBtn = document.getElementById("guess-btn");
const restartBtn = document.getElementById("restart-btn");
const message = document.getElementById("message");
const wrongLetters = document.getElementById("wrong-letters");
const hangmanDraw = document.getElementById("hangman-draw");
const scoreDisplay = document.getElementById("score");
const categoryHint = document.getElementById("category-hint");

// Oyunu başlatma fonksiyonu
function startGame() {
    const categories = Object.keys(wordsByCategory); // Kategorileri al
    selectedCategory = categories[Math.floor(Math.random() * categories.length)]; // Rastgele kategori seç
    const wordList = wordsByCategory[selectedCategory]; // Seçilen kategorideki kelimeleri al
    selectedWord = wordList[Math.floor(Math.random() * wordList.length)]; // Rastgele kelime seç

    guessedLetters = [];
    wrongGuesses = 0;
    wrongLetters.innerText = "";
    message.innerText = "";
    letterInput.value = "";
    letterInput.focus();
    guessBtn.disabled = false;

    // Kategori ipucunu göster
    categoryHint.innerText = selectedCategory;

    displayWord(); // Kelimeyi göster
    updateHangman(); // Çizimi sıfırla
}

// Kelimeyi göster
function displayWord() {
    let display = selectedWord.split('').map(letter => 
        guessedLetters.includes(letter) ? letter : "_"
    ).join(" ");
    wordContainer.innerHTML = display;
}

function updateHangman() {
    const hangmanStages = [
        `
          +---+
              |
              |
              |
              |
              |
        =========
        `,
        `
          +---+
          |   |
              |
              |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
              |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
          |   |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|   |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
         /    |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
         / \\  |
              |
        =========
        `
    ];

    // Hangi aşamada olduğunu belirlemek için wrongGuesses kullanıyoruz.
    hangmanDraw.innerHTML = `<pre>${hangmanStages[wrongGuesses]}</pre>`;
}


// Harf kontrolü ve oyunun durumu
function checkGuess(guess) {
    if (guess.length !== 1 || guessedLetters.includes(guess)) {
        message.innerText = "Geçerli bir harf gir!";
        return;
    }

    guessedLetters.push(guess);

    if (selectedWord.includes(guess)) {
        message.innerText = `Doğru tahmin! (${selectedCategory} kategorisi)`;
        score += 10; // Doğru tahmin 10 puan
    } else {
        message.innerText = `Yanlış tahmin! (${selectedCategory} kategorisi)`;
        wrongGuesses++;
        wrongLetters.innerText += guess + " ";
        score -= 5; // Yanlış tahmin 5 puan kaybı
    }

    displayWord();
    updateHangman();
    scoreDisplay.innerText = score;

    checkGameOver();
}

// Oyunun bitip bitmediğini kontrol et
function checkGameOver() {
    if (!wordContainer.innerText.includes("_")) {
        message.innerText = "Tebrikler! Kazandın!";
        guessBtn.disabled = true;
    }

    if (wrongGuesses >= maxWrongGuesses) {
        message.innerText = `Kaybettin! Kelime: ${selectedWord}`;
        guessBtn.disabled = true;
    }
}

// Buton ve klavye olaylarını dinle
guessBtn.addEventListener("click", () => {
    let guess = letterInput.value.toUpperCase();
    letterInput.value = "";
    checkGuess(guess);
});

// Klavyeden harf girildiğinde otomatik kontrol
document.addEventListener("keydown", (e) => {
    if (e.key.match(/[a-zA-Z]/) && e.key.length === 1 && !guessBtn.disabled) {
        checkGuess(e.key.toUpperCase());
    }
});

// Yeniden başlatma butonu
restartBtn.addEventListener("click", startGame);

// Oyunu başlat
startGame();
