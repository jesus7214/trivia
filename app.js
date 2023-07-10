document.getElementById("parametersForm").addEventListener("submit", function(event) {
  event.preventDefault();
  startTrivia();
});


document.getElementById("crearTriviaButton").addEventListener("click", function() {
  startTrivia();
});






document.getElementById("nextButton").addEventListener("click", function() {
  nextQuestion();
});

document.getElementById("restartButton").addEventListener("click", function() {
  resetTrivia();
});

document.getElementById("submitAnswersButton").addEventListener("click", function() {
  showFinalScore();
});

var questions = [];
var currentQuestionIndex = 0;
var score = 0;

function startTrivia() {
  var difficulty = document.getElementById("difficulty").value;
  var type = document.getElementById("type").value;
  var category = document.getElementById("category").value;

  var apiUrl = "https://opentdb.com/api.php?amount=10&difficulty=" + difficulty + "&type=" + type + "&category=" + category;
  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      questions = data.results;
      currentQuestionIndex = 0; 
      score = 0; 
      showQuestion();
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });

  document.getElementById("parametersForm").style.display = "none";
  document.getElementById("quizContainer").style.display = "block";
}

function showQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  document.getElementById("question").innerHTML = currentQuestion.question;

  var answersList = document.getElementById("answers");
  answersList.innerHTML = "";

  var options = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);
  options = shuffleArray(options);

  options.forEach(function(option) {
    var listItem = document.createElement("li");
    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = option;
    listItem.appendChild(radio);
    listItem.appendChild(document.createTextNode(option));
    answersList.appendChild(listItem);
  });

  var currentQuestionNumber = currentQuestionIndex + 1;
  document.getElementById("currentQuestion").innerHTML = currentQuestionNumber;

  if (currentQuestionNumber === 10 && currentQuestion.type === "multiple") {
    document.getElementById("nextButton").style.display = "none";
    document.getElementById("submitAnswersButton").style.display = "block";
  } else {
    document.getElementById("nextButton").style.display = "block";
    document.getElementById("submitAnswersButton").style.display = "none";
  }
}

function nextQuestion() {
  var selectedAnswer = document.querySelector("input[name='answer']:checked");

  if (!selectedAnswer) {
    alert("Por favor, seleccione una respuesta.");
    return;
  }

  if (selectedAnswer.value === questions[currentQuestionIndex].correct_answer) {
    score += 100;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < 10) {
    showQuestion();
  } else {
    document.getElementById("nextButton").style.display = "none";
    document.getElementById("submitAnswersButton").style.display = "block";
  }
}

function showFinalScore() {
  document.getElementById("quizContainer").style.display = "none";
  document.getElementById("scoreContainer").style.display = "block";
  document.getElementById("score").innerHTML = score;
}

function resetTrivia() {
  document.getElementById("parametersForm").reset();
  document.getElementById("parametersForm").style.display = "block";
  document.getElementById("quizContainer").style.display = "none";
  document.getElementById("scoreContainer").style.display = "none";
}

function shuffleArray(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
