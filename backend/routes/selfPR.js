require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();


const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// システムプロンプトを組み立てる
function buildPrompt(data) {
  return `
あなたは就職活動中の学生をサポートするAIアシスタントです。
以下の情報を元に、志望動機やエントリーシートで使えるような、自然で説得力のある「自己PR文」を日本語で作成してください。

【入力情報】
■ 強み（複数可）：${data.userStrengths}
■ 経験・エピソード：${data.experienceContext}
■ 頑張ったこと・工夫したこと：${data.effortDetails}
■ 希望業界・職種（あれば）：${data.desiredRole || "特になし"}

【出力形式】
- 200〜300文字程度の自然な日本語で
- 学生らしい言葉づかいでポジティブな印象を与える
- 決して誇張しすぎず、経験に即した内容で
- 希望業界・職種がある場合は、それに合ったトーンで（例：IT業界なら論理性や技術への関心を強調）

それでは、自己PR文をお願いします。
`;
}

router.post('/', async (req, res) => {
  const userInput = req.body; // フロントから送られてきたデータを取得
 

  const prompt = buildPrompt(userInput); // buildPrompt() を呼んで、プロンプト文を作る

  try {
    const response = await axios.post(GEMINI_URL, { //axios.post() を使って Gemini API に送る
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text; //返ってきた文章（おすすめ）を抽出して result に格納
    res.json({ generatedSelfPR: result });
  } catch (error) {
    console.error("❌ APIエラー:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API の呼び出しに失敗しました" });
  }
});
module.exports = router;