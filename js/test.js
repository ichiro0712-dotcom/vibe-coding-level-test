// Test State Management
let questionsData = null;
let currentPhase = 1;
let currentQuestionIndex = 0;
let currentRoute = null;
let answers = {
  phase1: [],
  phase2: []
};

// Answer options
const answerOptions = [
  { value: 3, label: "はい" },
  { value: 2, label: "ややはい" },
  { value: 1, label: "ややいいえ" },
  { value: 0, label: "いいえ" }
];

// Initialize the test
async function init() {
  try {
    // Check if there's custom data in localStorage
    const customData = localStorage.getItem('customQuestionsData');

    if (customData) {
      questionsData = JSON.parse(customData);
    } else {
      // Load default questions data
      const response = await fetch('data/questions.json');
      questionsData = await response.json();
    }

    // Initialize phase 1 answers array
    answers.phase1 = new Array(questionsData.phase1.questions.length).fill(null);

    renderQuestion();
    updateProgress();
  } catch (error) {
    console.error('Error loading questions:', error);
    alert('質問データの読み込みに失敗しました。ページをリロードしてください。');
  }
}

// Render current question
function renderQuestion() {
  const container = document.getElementById('questionContainer');
  container.innerHTML = '';

  let questions, question;

  if (currentPhase === 1) {
    questions = questionsData.phase1.questions;
    question = questions[currentQuestionIndex];
  } else {
    questions = questionsData.phase2[currentRoute].questions;
    question = questions[currentQuestionIndex];
  }

  // Question text
  const questionText = document.createElement('div');
  questionText.className = 'question-text';
  questionText.innerHTML = `<strong>Q${currentQuestionIndex + 1}:</strong> ${question.text}`;
  container.appendChild(questionText);

  // Answer options
  const answerOptionsDiv = document.createElement('div');
  answerOptionsDiv.className = 'answer-options';

  answerOptions.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'answer-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.id = `answer_${index}`;
    input.value = option.value;

    // Check if this answer was previously selected
    const currentAnswer = currentPhase === 1
      ? answers.phase1[currentQuestionIndex]
      : answers.phase2[currentQuestionIndex];

    if (currentAnswer === option.value) {
      input.checked = true;
    }

    input.addEventListener('change', () => {
      if (currentPhase === 1) {
        answers.phase1[currentQuestionIndex] = parseInt(input.value);
      } else {
        answers.phase2[currentQuestionIndex] = parseInt(input.value);
      }
      updateNextButton();
    });

    const label = document.createElement('label');
    label.htmlFor = `answer_${index}`;
    label.textContent = option.label;

    optionDiv.appendChild(input);
    optionDiv.appendChild(label);
    answerOptionsDiv.appendChild(optionDiv);
  });

  container.appendChild(answerOptionsDiv);

  // Add fade-in animation
  container.classList.remove('fade-in');
  void container.offsetWidth; // Trigger reflow
  container.classList.add('fade-in');

  updateNextButton();
  updateNavigationButtons();
}

// Update progress bar
function updateProgress() {
  const totalQuestions = 20;
  let completedQuestions = 0;

  if (currentPhase === 1) {
    completedQuestions = currentQuestionIndex;
  } else {
    completedQuestions = 5 + currentQuestionIndex;
  }

  const progress = (completedQuestions / totalQuestions) * 100;

  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${Math.round(progress)}%`;

  // Update question counter
  if (currentPhase === 1) {
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = questionsData.phase1.questions.length;
  } else {
    document.getElementById('currentQuestion').textContent = 5 + currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = 20;
  }
}

// Update next button state
function updateNextButton() {
  const nextBtn = document.getElementById('nextBtn');
  const currentAnswer = currentPhase === 1
    ? answers.phase1[currentQuestionIndex]
    : answers.phase2[currentQuestionIndex];

  if (currentAnswer !== null && currentAnswer !== undefined) {
    nextBtn.disabled = false;
    nextBtn.classList.remove('btn-disabled');
  } else {
    nextBtn.disabled = true;
    nextBtn.classList.add('btn-disabled');
  }
}

// Update navigation buttons visibility
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Show/hide previous button
  if (currentQuestionIndex > 0) {
    prevBtn.style.display = 'inline-block';
  } else {
    prevBtn.style.display = 'none';
  }

  // Update next button text
  let isLastQuestion = false;

  if (currentPhase === 1) {
    isLastQuestion = currentQuestionIndex === questionsData.phase1.questions.length - 1;
  } else {
    isLastQuestion = currentQuestionIndex === questionsData.phase2[currentRoute].questions.length - 1;
  }

  if (isLastQuestion) {
    nextBtn.textContent = currentPhase === 1 ? '第1フェーズ完了' : '結果を見る';
  } else {
    nextBtn.textContent = '次へ';
  }
}

// Go to next question
function nextQuestion() {
  let questions;

  if (currentPhase === 1) {
    questions = questionsData.phase1.questions;
  } else {
    questions = questionsData.phase2[currentRoute].questions;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
    updateProgress();
  } else {
    // Last question of current phase
    if (currentPhase === 1) {
      completePhase1();
    } else {
      completePhase2();
    }
  }
}

// Go to previous question
function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
    updateProgress();
  }
}

// Complete Phase 1
function completePhase1() {
  // Calculate phase 1 score
  const phase1Score = answers.phase1.reduce((sum, answer) => sum + answer, 0);

  // Determine route
  const scoring = questionsData.phase1.scoring;

  if (phase1Score >= scoring.beginner.min && phase1Score <= scoring.beginner.max) {
    currentRoute = 'beginner';
  } else if (phase1Score >= scoring.intermediate.min && phase1Score <= scoring.intermediate.max) {
    currentRoute = 'intermediate';
  } else if (phase1Score >= scoring.advanced.min && phase1Score <= scoring.advanced.max) {
    currentRoute = 'advanced';
  }

  // Initialize phase 2 answers array
  answers.phase2 = new Array(questionsData.phase2[currentRoute].questions.length).fill(null);

  // Show transition message
  showTransitionMessage();
}

// Show transition message
function showTransitionMessage() {
  document.getElementById('questionContainer').style.display = 'none';
  document.getElementById('prevBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('questionCounter').style.display = 'none';

  const routeNames = {
    beginner: '初級ルート（V0-V3）',
    intermediate: '中級ルート（V4-V6）',
    advanced: '上級ルート（V7-V9）'
  };

  document.getElementById('routeName').textContent = routeNames[currentRoute];
  document.getElementById('transitionMessage').style.display = 'block';
}

// Start Phase 2
function startPhase2() {
  currentPhase = 2;
  currentQuestionIndex = 0;

  // Update phase info
  document.getElementById('phaseTitle').textContent = '第2フェーズ: ' + questionsData.phase2[currentRoute].name;
  document.getElementById('phaseDescription').textContent = questionsData.phase2[currentRoute].description;

  // Hide transition message
  document.getElementById('transitionMessage').style.display = 'none';
  document.getElementById('questionContainer').style.display = 'block';
  document.getElementById('nextBtn').style.display = 'inline-block';
  document.getElementById('questionCounter').style.display = 'block';

  renderQuestion();
  updateProgress();
}

// Complete Phase 2 and calculate final result
function completePhase2() {
  // Calculate phase 2 score
  const phase2Questions = questionsData.phase2[currentRoute].questions;
  const phase2Score = answers.phase2.reduce((sum, answer, index) => {
    const weight = phase2Questions[index].weight || 1.0;
    return sum + (answer * weight);
  }, 0);

  // Determine final level
  const scoring = questionsData.phase2[currentRoute].scoring;
  let finalLevel = null;

  for (const [level, range] of Object.entries(scoring)) {
    if (phase2Score >= range.min && phase2Score <= range.max) {
      finalLevel = level;
      break;
    }
  }

  // Store results in sessionStorage
  const results = {
    phase1Score: answers.phase1.reduce((sum, answer) => sum + answer, 0),
    phase2Score: phase2Score,
    route: currentRoute,
    finalLevel: finalLevel,
    answers: answers
  };

  sessionStorage.setItem('testResults', JSON.stringify(results));

  // Redirect to results page
  window.location.href = 'result.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
