require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

function buildPrompt(data) {
    return `
以下の情報をもとに、履歴書を出力してください。

#入力情報
大学名(universityName):${data.universityName}
学部 (facultyName):${data.facultyName}
学科 (departmentName):${data.departmentName}
高校名(highSchoolName):${data.highSchoolName}
高校卒業年(highSchoolGraduationYear):${data.highSchoolGraduationYear}
高校卒業月(highSchoolGraduationMonth):${data.highSchoolGraduationMonth}
大学入学年(universityEntranceYear):${data.universityEntranceYear}
大学入学月(universityEntranceMonth):${data.universityEntranceMonth}
大学卒業予定年(universityGraduationYear):${data.universityGraduationYear}
大学卒業予定月(universityGraduationMonth):${data.universityGraduationMonth}


#出力フォーマット(この形を厳守してください。例文を書く必要はありません。)

氏名:
生年月日:
住所:
電話番号:
メールアドレス:

学歴
${data.highSchoolGraduationYear}年 ${data.highSchoolGraduationMonth}月 ${data.highSchoolName}卒業
${data.universityEntranceYear}年 ${data.universityEntranceMonth}月 ${data.universityName} ${data.facultyName} ${data.departmentName}入学
${data.universityGraduationYear}年 ${data.universityGraduationMonth}月 ${data.universityName} ${data.facultyName} ${data.departmentName}卒業見込み

職務経歴

資格・免許

自己PR

志望動機
`;
}

router.post('/', async (req, res) => {
    const userInput = req.body;
    const prompt = buildPrompt(userInput);

    try {
        const response = await axios.post(GEMINI_URL, {
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });

        const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        res.json({ generatedWorkHistory: result });
    } catch (error) {
        console.error("❌ APIエラー:", error.response?.data || error.message);
        res.status(500).json({ error: "Gemini API の呼び出しに失敗しました" });
    }
});
module.exports = router;