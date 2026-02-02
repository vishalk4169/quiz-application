const welcomeScreen = document.getElementById("welcomeScreen");
const quizScreen = document.getElementById("quizScreen");
const startBtn = document.getElementById("startBtn");
const timerEl = document.getElementById("timer");

let timeLeft = 10;
let timerInterval;

let quizData = [];

startBtn.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  quizScreen.style.display = "block";
  loadQuestion();
});


function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;
  timerEl.textContent = `Time Left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      autoNext();
    }
  }, 1000);
}


function autoNext() {
  feedbackEl.textContent = "Time's up!";
  nextBtn.style.display = "block";

  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);

  buttons[quizData[currentQuestion].answer]
    .classList.add("correct");
}




// Fetch 10 programming questions from Open Trivia DB
fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple')
  .then(response => response.json())
  .then(data => {
    // Map API data into our quiz format
    quizData = data.results.map(item => {
      const question = item.question;
      const correctAnswer = item.correct_answer;
      const options = [...item.incorrect_answers, item.correct_answer];
      shuffleArray(options); // Randomize options
      const answer = options.indexOf(correctAnswer); // Correct option index
      return { question, options, answer };
    });
    loadQuestion(); // Load the first question
  });

// Function to shuffle options randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let currentQuestion = 0; // Track current question index
let score = 0;           // Track user score

// Get DOM elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");

// Load a question onto the page
function loadQuestion() {
  feedbackEl.textContent = "";  // Clear feedback
  nextBtn.style.display = "none"; // Hide next button
  optionsEl.innerHTML = "";     // Clear previous options

  const current = quizData[currentQuestion];
  questionEl.textContent = current.question; // Show question

  // Create buttons for each option
  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(index, button);
    optionsEl.appendChild(button);
  });


  startTimer();


}

// Check if selected answer is correct
function checkAnswer(selectedIndex, button) {


    clearInterval(timerInterval);


  const correctIndex = quizData[currentQuestion].answer;
  const buttons = optionsEl.querySelectorAll("button");

  // Disable all buttons after selection
  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === correctIndex) {
    button.classList.add("correct");  // Highlight correct
    feedbackEl.textContent = "Correct Answer!";
    score++;                           // Increase score
  } else {
    button.classList.add("wrong");     // Highlight wrong
    buttons[correctIndex].classList.add("correct"); // Show correct
    feedbackEl.textContent = "Wrong Answer!";
  }

  nextBtn.style.display = "block"; // Show next button
}

// Go to next question or show result
nextBtn.addEventListener("click", () => {
    clearInterval(timerInterval);

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion(); // Load next question
  } else {
    showResult();   // Quiz completed
  }
});

// Display final score
function showResult() {
  questionEl.textContent = "Quiz Completed!";
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
}
