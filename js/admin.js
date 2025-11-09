// Admin State
let questionsData = null;
let originalData = null;

// Initialize admin page
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

    // Store original data for reset
    originalData = JSON.parse(JSON.stringify(questionsData));

    // Render questions
    renderPhase1Questions();
    renderPhase2Questions('beginner', 'phase2BeginnerQuestions');
    renderPhase2Questions('intermediate', 'phase2IntermediateQuestions');
    renderPhase2Questions('advanced', 'phase2AdvancedQuestions');

    // Load scoring ranges
    loadScoringRanges();
  } catch (error) {
    console.error('Error loading questions:', error);
    alert('質問データの読み込みに失敗しました。');
  }
}

// Render Phase 1 questions
function renderPhase1Questions() {
  const container = document.getElementById('phase1Questions');
  container.innerHTML = '';

  questionsData.phase1.questions.forEach((question, index) => {
    const questionDiv = createQuestionElement(question, index, 'phase1');
    container.appendChild(questionDiv);
  });
}

// Render Phase 2 questions
function renderPhase2Questions(route, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  questionsData.phase2[route].questions.forEach((question, index) => {
    const questionDiv = createQuestionElement(question, index, 'phase2', route);
    container.appendChild(questionDiv);
  });
}

// Create question element
function createQuestionElement(question, index, phase, route = null) {
  const div = document.createElement('div');
  div.style.cssText = 'background: var(--black); padding: 1.5rem; border-radius: 6px; margin-bottom: 1.5rem; border: 1px solid var(--gray-dark);';

  const questionNumber = document.createElement('div');
  questionNumber.style.cssText = 'color: var(--yellow-primary); font-weight: 700; margin-bottom: 0.5rem;';
  questionNumber.textContent = `質問 ${index + 1}`;

  const textLabel = document.createElement('label');
  textLabel.style.cssText = 'display: block; color: var(--gray-light); margin-bottom: 0.5rem; font-size: 0.9rem;';
  textLabel.textContent = '質問文';

  const textInput = document.createElement('textarea');
  textInput.value = question.text;
  textInput.rows = 3;
  textInput.style.marginBottom = '1rem';
  textInput.addEventListener('input', (e) => {
    if (phase === 'phase1') {
      questionsData.phase1.questions[index].text = e.target.value;
    } else {
      questionsData.phase2[route].questions[index].text = e.target.value;
    }
  });

  const weightLabel = document.createElement('label');
  weightLabel.style.cssText = 'display: block; color: var(--gray-light); margin-bottom: 0.5rem; font-size: 0.9rem;';
  weightLabel.textContent = '重み付け（0.1〜3.0）';

  const weightInput = document.createElement('input');
  weightInput.type = 'number';
  weightInput.value = question.weight;
  weightInput.min = '0.1';
  weightInput.max = '3.0';
  weightInput.step = '0.1';
  weightInput.style.width = '150px';
  weightInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    if (phase === 'phase1') {
      questionsData.phase1.questions[index].weight = value;
    } else {
      questionsData.phase2[route].questions[index].weight = value;
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-secondary';
  deleteBtn.textContent = '削除';
  deleteBtn.style.cssText = 'margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.9rem;';
  deleteBtn.addEventListener('click', () => {
    if (confirm('この質問を削除しますか？')) {
      if (phase === 'phase1') {
        questionsData.phase1.questions.splice(index, 1);
        renderPhase1Questions();
      } else {
        questionsData.phase2[route].questions.splice(index, 1);
        const containerMap = {
          beginner: 'phase2BeginnerQuestions',
          intermediate: 'phase2IntermediateQuestions',
          advanced: 'phase2AdvancedQuestions'
        };
        renderPhase2Questions(route, containerMap[route]);
      }
    }
  });

  div.appendChild(questionNumber);
  div.appendChild(textLabel);
  div.appendChild(textInput);
  div.appendChild(weightLabel);
  div.appendChild(weightInput);
  div.appendChild(deleteBtn);

  return div;
}

// Add Phase 1 question
function addPhase1Question() {
  const newQuestion = {
    id: `p1_q${questionsData.phase1.questions.length + 1}`,
    text: '新しい質問をここに入力してください',
    weight: 1.0
  };

  questionsData.phase1.questions.push(newQuestion);
  renderPhase1Questions();
}

// Add Phase 2 question
function addPhase2Question(route) {
  const prefix = route.substring(0, 1);
  const newQuestion = {
    id: `p2_${prefix}_q${questionsData.phase2[route].questions.length + 1}`,
    text: '新しい質問をここに入力してください',
    weight: 1.0
  };

  questionsData.phase2[route].questions.push(newQuestion);

  const containerMap = {
    beginner: 'phase2BeginnerQuestions',
    intermediate: 'phase2IntermediateQuestions',
    advanced: 'phase2AdvancedQuestions'
  };

  renderPhase2Questions(route, containerMap[route]);
}

// Load scoring ranges
function loadScoringRanges() {
  // Phase 1
  document.getElementById('phase1_beginner_min').value = questionsData.phase1.scoring.beginner.min;
  document.getElementById('phase1_beginner_max').value = questionsData.phase1.scoring.beginner.max;
  document.getElementById('phase1_intermediate_min').value = questionsData.phase1.scoring.intermediate.min;
  document.getElementById('phase1_intermediate_max').value = questionsData.phase1.scoring.intermediate.max;
  document.getElementById('phase1_advanced_min').value = questionsData.phase1.scoring.advanced.min;
  document.getElementById('phase1_advanced_max').value = questionsData.phase1.scoring.advanced.max;

  // Phase 2 - Beginner
  document.getElementById('beginner_V0_min').value = questionsData.phase2.beginner.scoring.V0.min;
  document.getElementById('beginner_V0_max').value = questionsData.phase2.beginner.scoring.V0.max;
  document.getElementById('beginner_V1_min').value = questionsData.phase2.beginner.scoring.V1.min;
  document.getElementById('beginner_V1_max').value = questionsData.phase2.beginner.scoring.V1.max;
  document.getElementById('beginner_V2_min').value = questionsData.phase2.beginner.scoring.V2.min;
  document.getElementById('beginner_V2_max').value = questionsData.phase2.beginner.scoring.V2.max;
  document.getElementById('beginner_V3_min').value = questionsData.phase2.beginner.scoring.V3.min;
  document.getElementById('beginner_V3_max').value = questionsData.phase2.beginner.scoring.V3.max;

  // Phase 2 - Intermediate
  document.getElementById('intermediate_V4_min').value = questionsData.phase2.intermediate.scoring.V4.min;
  document.getElementById('intermediate_V4_max').value = questionsData.phase2.intermediate.scoring.V4.max;
  document.getElementById('intermediate_V5_min').value = questionsData.phase2.intermediate.scoring.V5.min;
  document.getElementById('intermediate_V5_max').value = questionsData.phase2.intermediate.scoring.V5.max;
  document.getElementById('intermediate_V6_min').value = questionsData.phase2.intermediate.scoring.V6.min;
  document.getElementById('intermediate_V6_max').value = questionsData.phase2.intermediate.scoring.V6.max;

  // Phase 2 - Advanced
  document.getElementById('advanced_V7_min').value = questionsData.phase2.advanced.scoring.V7.min;
  document.getElementById('advanced_V7_max').value = questionsData.phase2.advanced.scoring.V7.max;
  document.getElementById('advanced_V8_min').value = questionsData.phase2.advanced.scoring.V8.min;
  document.getElementById('advanced_V8_max').value = questionsData.phase2.advanced.scoring.V8.max;
  document.getElementById('advanced_V9_min').value = questionsData.phase2.advanced.scoring.V9.min;
  document.getElementById('advanced_V9_max').value = questionsData.phase2.advanced.scoring.V9.max;
}

// Save questions
function saveQuestions() {
  // Update scoring ranges from inputs
  // Phase 1
  questionsData.phase1.scoring.beginner.min = parseInt(document.getElementById('phase1_beginner_min').value);
  questionsData.phase1.scoring.beginner.max = parseInt(document.getElementById('phase1_beginner_max').value);
  questionsData.phase1.scoring.intermediate.min = parseInt(document.getElementById('phase1_intermediate_min').value);
  questionsData.phase1.scoring.intermediate.max = parseInt(document.getElementById('phase1_intermediate_max').value);
  questionsData.phase1.scoring.advanced.min = parseInt(document.getElementById('phase1_advanced_min').value);
  questionsData.phase1.scoring.advanced.max = parseInt(document.getElementById('phase1_advanced_max').value);

  // Phase 2 - Beginner
  questionsData.phase2.beginner.scoring.V0.min = parseInt(document.getElementById('beginner_V0_min').value);
  questionsData.phase2.beginner.scoring.V0.max = parseInt(document.getElementById('beginner_V0_max').value);
  questionsData.phase2.beginner.scoring.V1.min = parseInt(document.getElementById('beginner_V1_min').value);
  questionsData.phase2.beginner.scoring.V1.max = parseInt(document.getElementById('beginner_V1_max').value);
  questionsData.phase2.beginner.scoring.V2.min = parseInt(document.getElementById('beginner_V2_min').value);
  questionsData.phase2.beginner.scoring.V2.max = parseInt(document.getElementById('beginner_V2_max').value);
  questionsData.phase2.beginner.scoring.V3.min = parseInt(document.getElementById('beginner_V3_min').value);
  questionsData.phase2.beginner.scoring.V3.max = parseInt(document.getElementById('beginner_V3_max').value);

  // Phase 2 - Intermediate
  questionsData.phase2.intermediate.scoring.V4.min = parseInt(document.getElementById('intermediate_V4_min').value);
  questionsData.phase2.intermediate.scoring.V4.max = parseInt(document.getElementById('intermediate_V4_max').value);
  questionsData.phase2.intermediate.scoring.V5.min = parseInt(document.getElementById('intermediate_V5_min').value);
  questionsData.phase2.intermediate.scoring.V5.max = parseInt(document.getElementById('intermediate_V5_max').value);
  questionsData.phase2.intermediate.scoring.V6.min = parseInt(document.getElementById('intermediate_V6_min').value);
  questionsData.phase2.intermediate.scoring.V6.max = parseInt(document.getElementById('intermediate_V6_max').value);

  // Phase 2 - Advanced
  questionsData.phase2.advanced.scoring.V7.min = parseInt(document.getElementById('advanced_V7_min').value);
  questionsData.phase2.advanced.scoring.V7.max = parseInt(document.getElementById('advanced_V7_max').value);
  questionsData.phase2.advanced.scoring.V8.min = parseInt(document.getElementById('advanced_V8_min').value);
  questionsData.phase2.advanced.scoring.V8.max = parseInt(document.getElementById('advanced_V8_max').value);
  questionsData.phase2.advanced.scoring.V9.min = parseInt(document.getElementById('advanced_V9_min').value);
  questionsData.phase2.advanced.scoring.V9.max = parseInt(document.getElementById('advanced_V9_max').value);

  // Save to localStorage
  localStorage.setItem('customQuestionsData', JSON.stringify(questionsData));

  alert('変更を保存しました！');
}

// Reset questions to default
function resetQuestions() {
  if (confirm('デフォルトの質問データに戻します。この操作は取り消せません。よろしいですか？')) {
    localStorage.removeItem('customQuestionsData');
    location.reload();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
