const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body);
    const { level, levelName, levelDescription, phase1Score, phase2Score, route, maxPhase2Score } = data;

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create prompt
    const prompt = `ユーザーはバイブコーディングレベル診断で「${level}: ${levelName}」と判定されました。

レベルの説明: ${levelDescription}

診断結果:
- 第1フェーズスコア: ${phase1Score}点 / 15点
- 第2フェーズスコア: ${Math.round(phase2Score)}点 / ${maxPhase2Score}点
- 振り分けルート: ${route}

このユーザーの現在地と強み・弱みを分析し、次のステップとして具体的に取り組むべきアクションを3つ、200-300字で提案してください。

出力形式:
- 親しみやすく、励ましのトーンで
- 具体的で実践可能なアドバイスを
- 改行を適切に使って読みやすく`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const advice = response.text();

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ advice })
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to generate AI advice',
        details: error.message
      })
    };
  }
};
