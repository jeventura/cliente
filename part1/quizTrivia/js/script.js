// Selecting all required elements
const startBtn = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const exitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");
const optionList = document.querySelector(".option_list");
const timeLine = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

let timeValue = 15;
let queCount = 0;
let queNumb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restartQuizBtn = resultBox.querySelector(".buttons .restart");
const quitQuizBtn = resultBox.querySelector(".buttons .quit");
const nextBtn = document.querySelector("footer .next_btn");
const bottomQuesCounter = document.querySelector("footer .total_que");

// Mostrar info box al presionar Start
startBtn.onclick = () => {
  document.querySelector(".start_btn").style.display = "none";
  infoBox.classList.add("activeInfo");
};

// Exit en info box: cierra y vuelve a mostrar Start
exitBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
  document.querySelector(".start_btn").style.display = "block";
};

// Continuar: iniciar quiz
continueBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.add("activeQuiz");
  initializeQuiz();
};

// Restart quiz desde la pantalla de resultados
restartQuizBtn.onclick = () => {
  resultBox.classList.remove("activeResult");
  quizBox.classList.add("activeQuiz");
  resetQuiz();
  initializeQuiz();
};

// Quit quiz: recarga la página (vuelve al botón Start)
quitQuizBtn.onclick = () => {
  window.location.reload();
};

// Botón Next (en este caso con una sola pregunta prácticamente solo termina)
nextBtn.onclick = () => {
  if (queCount < questions.length - 1) {
    queCount++;
    queNumb++;
    updateQuiz();
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    showResult();
  }
};

// Inicializar quiz
function initializeQuiz() {
  showQuestions(queCount);
  queCounter(queNumb);
  startTimer(timeValue);
  startTimerLine(widthValue);
}

// Reset de variables
function resetQuiz() {
  timeValue = 15;
  queCount = 0;
  queNumb = 1;
  userScore = 0;
  widthValue = 0;
}

// Actualizar para siguiente pregunta
function updateQuiz() {
  showQuestions(queCount);
  queCounter(queNumb);
  clearInterval(counter);
  clearInterval(counterLine);
  startTimer(timeValue);
  startTimerLine(widthValue);
  timeText.textContent = "Time Left";
  nextBtn.classList.remove("show");
}

// Mostrar pregunta y opciones
function showQuestions(index) {
  const queText = document.querySelector(".que_text");
  let queTag = `<span>${questions[index].numb}. ${questions[index].question}</span>`;
  let optionTag = questions[index].options
    .map(option => `<div class="option"><span>${option}</span></div>`)
    .join("");
  queText.innerHTML = queTag;
  optionList.innerHTML = optionTag;

  optionList.querySelectorAll(".option").forEach(option => {
    option.onclick = () => optionSelected(option);
  });
}

// Selección de opción
function optionSelected(answer) {
  clearInterval(counter);
  clearInterval(counterLine);
  let userAns = answer.textContent;
  let correctAns = questions[queCount].answer;

  if (userAns === correctAns) {
    userScore++;
    answer.classList.add("correct");
    answer.insertAdjacentHTML("beforeend", tickIconTag);
  } else {
    answer.classList.add("incorrect");
    answer.insertAdjacentHTML("beforeend", crossIconTag);
    highlightCorrectAnswer(correctAns);
  }

  disableOptions();
  nextBtn.classList.add("show");
}

// Resaltar la respuesta correcta
function highlightCorrectAnswer(correctAns) {
  for (let i = 0; i < optionList.children.length; i++) {
    if (optionList.children[i].textContent === correctAns) {
      optionList.children[i].classList.add("correct");
      optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag);
    }
  }
}

// Deshabilitar opciones
function disableOptions() {
  for (let i = 0; i < optionList.children.length; i++) {
    optionList.children[i].classList.add("disabled");
  }
}

// Mostrar resultados
function showResult() {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.remove("activeQuiz");
  resultBox.classList.add("activeResult");
  const scoreText = resultBox.querySelector(".score_text");
  let scoreTag = "";

  if (userScore === questions.length) {
    scoreTag = `<span>Shantay, you stay! ✨ You got <p>${userScore}</p> out of <p>${questions.length}</p>.</span>`;
  } else if (userScore > 0) {
    scoreTag = `<span>Not bad, queen 👑 You got <p>${userScore}</p> out of <p>${questions.length}</p>.</span>`;
  } else {
    scoreTag = `<span>Sashay away 😅 You got <p>${userScore}</p> out of <p>${questions.length}</p>.</span>`;
  }

  scoreText.innerHTML = scoreTag;
}

// Timer de 15 segundos
function startTimer(time) {
  counter = setInterval(() => {
    timeCount.textContent = time > 9 ? time : `0${time}`;
    time--;
    if (time < 0) {
      clearInterval(counter);
      timeText.textContent = "Time Off";
      highlightCorrectAnswer(questions[queCount].answer);
      disableOptions();
      nextBtn.classList.add("show");
    }
  }, 1000);
}

// Línea de tiempo
function startTimerLine(time) {
  const totalTime = 550;
  counterLine = setInterval(() => {
    time += 1;
    let progressPercentage = (time / totalTime) * 100;
    timeLine.style.width = `${progressPercentage}%`;
    if (time >= totalTime) {
      clearInterval(counterLine);
    }
  }, 29);
}

// Contador "1 of 1 Questions"
function queCounter(index) {
  let totalQueCounTag = `<span><p>${index}</p> of <p>${questions.length}</p> Questions</span>`;
  bottomQuesCounter.innerHTML = totalQueCounTag;
}

// Iconos check / cross
const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
