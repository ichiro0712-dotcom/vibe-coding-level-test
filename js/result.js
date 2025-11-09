// Result State
let questionsData = null;
let results = null;

// Initialize result page
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

    // Get results from sessionStorage
    const resultsJson = sessionStorage.getItem('testResults');

    if (!resultsJson) {
      alert('診断結果が見つかりません。診断を最初からやり直してください。');
      window.location.href = 'test.html';
      return;
    }

    results = JSON.parse(resultsJson);

    // Display results
    displayResults();

    // Get AI advice
    getAIAdvice();
  } catch (error) {
    console.error('Error initializing results:', error);
    alert('結果の読み込みに失敗しました。');
  }
}

// Display results
function displayResults() {
  // Hide loading, show content
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('resultContent').style.display = 'block';

  // Get level data
  const levelData = questionsData.levels.find(l => l.id === results.finalLevel);

  if (!levelData) {
    alert('レベルデータが見つかりません。');
    return;
  }

  // Display level badge and name
  document.getElementById('levelBadge').textContent = levelData.id;
  document.getElementById('levelName').textContent = `${levelData.name} (${levelData.nameEn})`;
  document.getElementById('levelDescription').textContent = levelData.description;
  document.getElementById('shareLevel').textContent = `${levelData.id}: ${levelData.name}`;

  // Display scores
  document.getElementById('phase1Score').textContent = Math.round(results.phase1Score);
  document.getElementById('phase2Score').textContent = Math.round(results.phase2Score);

  // Display route
  const routeNames = {
    beginner: '初級ルート',
    intermediate: '中級ルート',
    advanced: '上級ルート'
  };
  document.getElementById('routeName').textContent = routeNames[results.route];

  // Display next steps based on level
  displayNextSteps(levelData.id);
}

// Display next steps
function displayNextSteps(levelId) {
  const nextStepsContainer = document.getElementById('nextSteps');

  const nextStepsMap = {
    V0: [
      'ChatGPTやClaude、Geminiなどのツールに実際に触れてみましょう',
      '簡単な質問から始めて、AIとの対話に慣れましょう',
      '他の人がAIをどう使っているか、事例を調べてみましょう'
    ],
    V1: [
      'プロンプトの書き方を工夫して、同じ質問でも結果が変わることを実験してみましょう',
      '「具体的に」「箇条書きで」など、出力形式を指定してみましょう',
      'AIに役割を与える（「あなたは〜の専門家です」）指示を試してみましょう'
    ],
    V2: [
      'トーンや文体を指定して、AIの出力をコントロールする練習をしましょう',
      '段階的に質問を深掘りしていく「対話形式」を意識しましょう',
      '他の人のプロンプト例を参考に、効果的なパターンを学びましょう'
    ],
    V3: [
      'AIにコード（HTML、CSS、Pythonなど）を書かせてみましょう',
      'JSONやYAML形式のデータを生成させて、実際に使ってみましょう',
      'プロンプトをテンプレート化して、再利用できるようにしましょう'
    ],
    V4: [
      '複数のAIツールを使い分けて、それぞれの強みを活かしましょう',
      'AIの出力を別のツールに渡す「ワークフロー」を設計してみましょう',
      'APIの基本概念を学び、AI連携の可能性を広げましょう'
    ],
    V5: [
      'RAG（検索拡張生成）の概念を学び、大量データとAIを組み合わせましょう',
      'Zapier、Make、n8nなどのノーコードツールでAI自動化を試しましょう',
      'プロンプトチェーン（複数のプロンプトを順次実行）を設計しましょう'
    ],
    V6: [
      '複数のAIに異なる役割を与えて、協調動作させてみましょう',
      'Node.jsやPythonを使って、AIを含むシステムを実装しましょう',
      'AIの「記憶」や「文脈の持ち方」を意識したシステム設計をしましょう'
    ],
    V7: [
      'データベース（Supabase、Firebaseなど）とAIを統合しましょう',
      'Figma、Notion、Slackなど複数サービスをAIでつなぐ設計をしましょう',
      'AI同士の対話や、自己フィードバックループを設計しましょう'
    ],
    V8: [
      'ベクトルデータベースやエンベッディングを活用した高度なRAGを実装しましょう',
      'AIの「トーン」「雰囲気」「世界観」を意図的にデザインしましょう',
      'AIと人間の境界を溶かし、シームレスな統合を目指しましょう'
    ],
    V9: [
      'あなたの知識と経験を、コミュニティにシェアしましょう',
      '新しいAIツールや技術を積極的に試し、限界に挑戦しましょう',
      '感覚的なアイデアを構造化されたシステムに変換する技術をさらに磨きましょう'
    ]
  };

  const steps = nextStepsMap[levelId] || ['次のレベルを目指して、学習を続けましょう！'];

  const ul = document.createElement('ul');
  ul.style.paddingLeft = '1.5rem';

  steps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    li.style.marginBottom = '0.75rem';
    ul.appendChild(li);
  });

  nextStepsContainer.appendChild(ul);
}

// Get AI advice from Gemini
async function getAIAdvice() {
  const aiAdviceContent = document.getElementById('aiAdviceContent');

  try {
    // Get level data
    const levelData = questionsData.levels.find(l => l.id === results.finalLevel);

    // Prepare summary of answers
    const routeNames = {
      beginner: '初級ルート（V0-V3）',
      intermediate: '中級ルート（V4-V6）',
      advanced: '上級ルート（V7-V9）'
    };

    const requestData = {
      level: results.finalLevel,
      levelName: levelData.name,
      levelDescription: levelData.description,
      phase1Score: results.phase1Score,
      phase2Score: results.phase2Score,
      route: routeNames[results.route],
      maxPhase2Score: 45
    };

    // Call Netlify Function
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('AI advice request failed');
    }

    const data = await response.json();

    // Display AI advice
    aiAdviceContent.innerHTML = `<p>${data.advice}</p>`;
  } catch (error) {
    console.error('Error getting AI advice:', error);
    aiAdviceContent.innerHTML = `
      <p style="color: var(--gray-dark);">
        AIアドバイスの取得に失敗しました。<br>
        ネットワーク接続を確認するか、後ほど再度お試しください。
      </p>
    `;
  }
}

// Copy result to clipboard
function copyResultToClipboard() {
  const levelData = questionsData.levels.find(l => l.id === results.finalLevel);

  const text = `バイブコーディング レベル診断結果

レベル: ${levelData.id} - ${levelData.name}
${levelData.description}

第1フェーズスコア: ${results.phase1Score}/15
第2フェーズスコア: ${Math.round(results.phase2Score)}/45

診断URL: ${window.location.origin}`;

  navigator.clipboard.writeText(text).then(() => {
    alert('結果をクリップボードにコピーしました！');
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('コピーに失敗しました。');
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
