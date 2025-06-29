require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();


const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// プロンプトを組み立てる
function buildPrompt(data) {
  const goalText = Array.isArray(data.goal) ? data.goal.join('、') : data.goal;
  const interestText = Array.isArray(data.interest) ? data.interest.join('、') : data.interest;
  const learnText = Array.isArray(data.learn) ? data.learn.join('、') : data.learn;
  const workText = Array.isArray(data.work) ? data.work.join('、') : data.work;
  const weakText = Array.isArray(data.weak) ? data.weak.join('、') : data.weak;

  return `
あなたは新卒就活生向けのキャリアアドバイザーです。
以下の情報をもとに、就活生に向けて **おすすめの業界と業種をそれぞれ簡潔に3つ以内**で提案してください。

提案には、それぞれ「なぜその人に合っているのか」の理由を短く添えてください（1文で構いません）。

# 学生の情報
・将来の目標：${goalText}
・興味・関心：${interestText}
・学習内容：${learnText}
・希望する働き方：${workText}
・避けたいこと：${weakText}
・その他：${data.other}
・MBTI：${data.mbti}

# 出力フォーマット（この形を厳守してください）

＃おすすめの業界
- IT業界：分析力と創造性を活かせる環境が多いため
- 教育業界：人の成長を支える仕事に関心があるため

＃おすすめの業種
- データアナリスト：論理的思考力と数値分析への興味が活かせるため
- 企画職：アイデアを形にし、チームで成果を出すことに適しているため
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
    res.json({ suggestion: result });
  } catch (error) {
    console.error("❌ APIエラー:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API の呼び出しに失敗しました" });
  }
});
module.exports = router;