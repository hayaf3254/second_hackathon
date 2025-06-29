<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSuggestionStore } from '../stores/suggestion'

const router = useRouter()
const suggestionStore = useSuggestionStore()

const formData = ref({
  goal: [],
  interest: [],
  learn: [],
  work: [],
  weak: [],
  other: '',
  mbti: ''
})

const customInputs = ref({
  goal: '',
  interest: '',
  learn: '',
  work: '',
  weak: ''
})

const showCustomInput = ref({
  goal: false,
  interest: false,
  learn: false,
  work: false,
  weak: false
})

const options = {
  goal: [
    '社会貢献したい',
    '高収入を得たい',
    'ワークライフバランス重視',
    'スキルアップしたい',
    'リーダーシップを発揮したい',
    '安定した職業に就きたい'
  ],
  interest: [
    'テクノロジー・IT',
    'デザイン・クリエイティブ',
    'ビジネス・経営',
    '教育・人材育成',
    '医療・健康',
    'エンターテイメント'
  ],
  learn: [
    '経済学・経営学',
    '工学・理工学',
    '文学・人文学',
    '法学・政治学',
    '医学・薬学',
    '情報・コンピューター'
  ],
  work: [
    'リモートワーク可能',
    'フレックスタイム制',
    'チームワーク重視',
    '個人作業中心',
    '出張・転勤あり',
    '定時退社'
  ],
  weak: [
    '長時間労働',
    '営業・接客',
    '単純作業の繰り返し',
    '高いプレッシャー',
    '夜勤・シフト勤務',
    '転勤・出張'
  ]
}

function handleOptionToggle(category, option) {
  if (formData.value[category].includes(option)) {
    formData.value[category] = formData.value[category].filter(item => item !== option)
  } else {
    formData.value[category].push(option)
  }
}

function addCustomOption(category) {
  const customValue = customInputs.value[category].trim()
  if (customValue && !formData.value[category].includes(customValue)) {
    formData.value[category].push(customValue)
    customInputs.value[category] = ''
    showCustomInput.value[category] = false
  }
}

function removeCustomOption(category, option) {
  formData.value[category] = formData.value[category].filter(item => item !== option)
}

async function handleSubmit() {
  try {
    const response = await fetch('http://localhost:3000/suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    })

    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`)
    }

    const data = await response.json()
    // 取得した結果をストアに保存し、結果表示ページへ遷移
    suggestionStore.setSuggestion(data.suggestion)
    router.push({ name: 'result' })
  } catch (error) {
    console.error('送信に失敗しました:', error)
    alert('Gemini への送信に失敗しました。時間を置いて再度お試しください。')
  }
}
</script>

<template>
  <div class="container">
    <!-- 背景装飾 -->
    <div class="bg-decoration">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>

    <!-- ヘッダーカード -->
    <div class="header-card">
      <div class="header-icon">🎯</div>
      <h1 class="header-title">キャリア診断</h1>
      <p class="header-subtitle">
        あなたの理想のキャリアを見つけるための<br>
        いくつかの質問にお答えください
      </p>
    </div>

    <!-- 質問セクション -->
    <div class="questions-container">
      <!-- 将来の目標 -->
      <div class="question-card">
        <div class="question-header">
          <div class="question-icon">🚀</div>
          <div class="question-content">
            <h2 class="question-title">将来の目標</h2>
            <p class="question-description">あなたがキャリアで実現したいことは何ですか？</p>
          </div>
        </div>
        <div class="options-grid">
          <button
            v-for="option in options.goal"
            :key="option"
            class="option-button"
            :class="{ active: formData.goal.includes(option) }"
            @click="handleOptionToggle('goal', option)"
          >
            <span class="option-text">{{ option }}</span>
            <div class="option-check">✓</div>
          </button>
          <button
            class="option-button add-option"
            @click="showCustomInput.goal = !showCustomInput.goal"
          >
            <span class="option-text">その他</span>
            <div class="option-plus">+</div>
          </button>
        </div>
        <div v-if="showCustomInput.goal" class="custom-input-container">
          <div class="custom-input-wrapper">
            <input
              v-model="customInputs.goal"
              class="custom-input"
              type="text"
              placeholder="カスタム項目を入力..."
              @keypress.enter="addCustomOption('goal')"
            />
            <button class="add-button" @click="addCustomOption('goal')">追加</button>
          </div>
        </div>
        <div v-if="formData.goal.filter(item => !options.goal.includes(item)).length > 0" class="custom-tags">
          <div
            v-for="item in formData.goal.filter(item => !options.goal.includes(item))"
            :key="item"
            class="custom-tag"
          >
            <span>{{ item }}</span>
            <button class="remove-button" @click="removeCustomOption('goal', item)">×</button>
          </div>
        </div>
      </div>

      <!-- 興味・関心のあること -->
      <div class="question-card">
        <div class="question-header">
          <div class="question-icon">💡</div>
          <div class="question-content">
            <h2 class="question-title">興味・関心のあること</h2>
            <p class="question-description">どのような分野に興味をお持ちですか？</p>
          </div>
        </div>
        <div class="options-grid">
          <button
            v-for="option in options.interest"
            :key="option"
            class="option-button"
            :class="{ active: formData.interest.includes(option) }"
            @click="handleOptionToggle('interest', option)"
          >
            <span class="option-text">{{ option }}</span>
            <div class="option-check">✓</div>
          </button>
          <button
            class="option-button add-option"
            @click="showCustomInput.interest = !showCustomInput.interest"
          >
            <span class="option-text">その他</span>
            <div class="option-plus">+</div>
          </button>
        </div>
        <div v-if="showCustomInput.interest" class="custom-input-container">
          <div class="custom-input-wrapper">
            <input
              v-model="customInputs.interest"
              class="custom-input"
              type="text"
              placeholder="カスタム項目を入力..."
              @keypress.enter="addCustomOption('interest')"
            />
            <button class="add-button" @click="addCustomOption('interest')">追加</button>
          </div>
        </div>
        <div v-if="formData.interest.filter(item => !options.interest.includes(item)).length > 0" class="custom-tags">
          <div
            v-for="item in formData.interest.filter(item => !options.interest.includes(item))"
            :key="item"
            class="custom-tag"
          >
            <span>{{ item }}</span>
            <button class="remove-button" @click="removeCustomOption('interest', item)">×</button>
          </div>
        </div>
      </div>

      <!-- 学んできたこと -->
      <div class="question-card">
        <div class="question-header">
          <div class="question-icon">📚</div>
          <div class="question-content">
            <h2 class="question-title">学んできたこと</h2>
            <p class="question-description">専攻・ゼミ・資格など、これまで学習してきた分野を教えてください</p>
          </div>
        </div>
        <div class="options-grid">
          <button
            v-for="option in options.learn"
            :key="option"
            class="option-button"
            :class="{ active: formData.learn.includes(option) }"
            @click="handleOptionToggle('learn', option)"
          >
            <span class="option-text">{{ option }}</span>
            <div class="option-check">✓</div>
          </button>
          <button
            class="option-button add-option"
            @click="showCustomInput.learn = !showCustomInput.learn"
          >
            <span class="option-text">その他</span>
            <div class="option-plus">+</div>
          </button>
        </div>
        <div v-if="showCustomInput.learn" class="custom-input-container">
          <div class="custom-input-wrapper">
            <input
              v-model="customInputs.learn"
              class="custom-input"
              type="text"
              placeholder="カスタム項目を入力..."
              @keypress.enter="addCustomOption('learn')"
            />
            <button class="add-button" @click="addCustomOption('learn')">追加</button>
          </div>
        </div>
        <div v-if="formData.learn.filter(item => !options.learn.includes(item)).length > 0" class="custom-tags">
          <div
            v-for="item in formData.learn.filter(item => !options.learn.includes(item))"
            :key="item"
            class="custom-tag"
          >
            <span>{{ item }}</span>
            <button class="remove-button" @click="removeCustomOption('learn', item)">×</button>
          </div>
        </div>
      </div>

      <!-- 働き方の希望 -->
      <div class="question-card">
        <div class="question-header">
          <div class="question-icon">⚡</div>
          <div class="question-content">
            <h2 class="question-title">働き方の希望</h2>
            <p class="question-description">どのような働き方を希望しますか？</p>
          </div>
        </div>
        <div class="options-grid">
          <button
            v-for="option in options.work"
            :key="option"
            class="option-button"
            :class="{ active: formData.work.includes(option) }"
            @click="handleOptionToggle('work', option)"
          >
            <span class="option-text">{{ option }}</span>
            <div class="option-check">✓</div>
          </button>
          <button
            class="option-button add-option"
            @click="showCustomInput.work = !showCustomInput.work"
          >
            <span class="option-text">その他</span>
            <div class="option-plus">+</div>
          </button>
        </div>
        <div v-if="showCustomInput.work" class="custom-input-container">
          <div class="custom-input-wrapper">
            <input
              v-model="customInputs.work"
              class="custom-input"
              type="text"
              placeholder="カスタム項目を入力..."
              @keypress.enter="addCustomOption('work')"
            />
            <button class="add-button" @click="addCustomOption('work')">追加</button>
          </div>
        </div>
        <div v-if="formData.work.filter(item => !options.work.includes(item)).length > 0" class="custom-tags">
          <div
            v-for="item in formData.work.filter(item => !options.work.includes(item))"
            :key="item"
            class="custom-tag"
          >
            <span>{{ item }}</span>
            <button class="remove-button" @click="removeCustomOption('work', item)">×</button>
          </div>
        </div>
      </div>

      <!-- 苦手なこと・避けたい業種 -->
      <div class="question-card">
        <div class="question-header">
          <div class="question-icon">⚠️</div>
          <div class="question-content">
            <h2 class="question-title">苦手なこと・避けたい業種</h2>
            <p class="question-description">避けたい働き方や苦手な業務はありますか？</p>
          </div>
        </div>
        <div class="options-grid">
          <button
            v-for="option in options.weak"
            :key="option"
            class="option-button"
            :class="{ active: formData.weak.includes(option) }"
            @click="handleOptionToggle('weak', option)"
          >
            <span class="option-text">{{ option }}</span>
            <div class="option-check">✓</div>
          </button>
          <button
            class="option-button add-option"
            @click="showCustomInput.weak = !showCustomInput.weak"
          >
            <span class="option-text">その他</span>
            <div class="option-plus">+</div>
          </button>
        </div>
        <div v-if="showCustomInput.weak" class="custom-input-container">
          <div class="custom-input-wrapper">
            <input
              v-model="customInputs.weak"
              class="custom-input"
              type="text"
              placeholder="カスタム項目を入力..."
              @keypress.enter="addCustomOption('weak')"
            />
            <button class="add-button" @click="addCustomOption('weak')">追加</button>
          </div>
        </div>
        <div v-if="formData.weak.filter(item => !options.weak.includes(item)).length > 0" class="custom-tags">
          <div
            v-for="item in formData.weak.filter(item => !options.weak.includes(item))"
            :key="item"
            class="custom-tag"
          >
            <span>{{ item }}</span>
            <button class="remove-button" @click="removeCustomOption('weak', item)">×</button>
          </div>
        </div>
      </div>

      <!-- その他重視していること -->
      <div class="question-card">
        <div class="question-header">
          <div class="question-icon">💭</div>
          <div class="question-content">
            <h2 class="question-title">その他重視していること</h2>
            <p class="question-description">上記以外で重視している価値観や条件があれば教えてください</p>
          </div>
        </div>
        <div class="textarea-container">
          <textarea
            v-model="formData.other"
            class="textarea-input"
            rows="4"
            placeholder="例：企業の社会的責任、職場の多様性、成長性など..."
          ></textarea>
        </div>
      </div>

      <!-- MBTIの結果 -->
      <div class="question-card">
        <div class="question-header">
          <div class="question-icon">🧠</div>
          <div class="question-content">
            <h2 class="question-title">MBTIの結果</h2>
            <p class="question-description">MBTIテストの結果があれば入力してください（任意）</p>
          </div>
        </div>
        <div class="input-container">
          <input
            v-model="formData.mbti"
            class="text-input"
            type="text"
            maxlength="4"
            placeholder="例：ENFP、INTJ など4文字で入力"
          />
        </div>
      </div>
    </div>

    <!-- 送信ボタン -->
    <div class="submit-container">
      <button class="submit-button" @click="handleSubmit">
        <span class="submit-icon">🚀</span>
        <span class="submit-text">診断結果を見る</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  position: relative;
  padding: 40px 20px;
  overflow-x: hidden;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: -5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: -3%;
  animation-delay: 2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.1); }
}

.header-card {
  max-width: 600px;
  margin: 0 auto 60px auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.8s ease-out;
}

.header-icon {
  font-size: 3rem;
  margin-bottom: 24px;
  animation: bounce 2s ease-in-out infinite;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
  font-weight: 400;
}

.questions-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.question-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideUp 0.6s ease-out;
}

.question-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.question-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.question-icon {
  font-size: 2rem;
  flex-shrink: 0;
  margin-top: 4px;
}

.question-content {
  flex: 1;
}

.question-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.question-description {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.5;
  font-weight: 400;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.option-button {
  position: relative;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.option-button:hover {
  transform: translateY(-2px);
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.option-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.option-button.add-option {
  border-style: dashed;
  border-color: #cbd5e0;
  color: #718096;
  background: #f7fafc;
}

.option-button.add-option:hover {
  border-color: #667eea;
  color: #667eea;
  background: #ffffff;
}

.option-text {
  flex: 1;
  text-align: left;
}

.option-check {
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease;
  font-weight: 600;
}

.option-button.active .option-check {
  opacity: 1;
  transform: scale(1);
}

.option-plus {
  opacity: 0.6;
  font-size: 1.2rem;
  font-weight: 600;
}

.custom-input-container {
  margin-top: 16px;
}

.custom-input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.custom-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #ffffff;
  transition: border-color 0.2s ease;
}

.custom-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-button {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.add-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.custom-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.custom-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #edf2f7;
  color: #2d3748;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.remove-button {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0;
  font-size: 1.1rem;
  font-weight: 600;
  transition: color 0.2s ease;
}

.remove-button:hover {
  color: #e53e3e;
}

.textarea-container,
.input-container {
  margin-top: 8px;
}

.textarea-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  background: #ffffff;
  transition: border-color 0.2s ease;
}

.textarea-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.text-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #ffffff;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-container {
  max-width: 900px;
  margin: 60px auto 40px auto;
  text-align: center;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 20px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-button:hover::before {
  left: 100%;
}

.submit-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.5);
}

.submit-icon {
  font-size: 1.3rem;
}

.submit-text {
  font-weight: 700;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 768px) {
  .container {
    padding: 20px 16px;
  }
  
  .header-card {
    padding: 32px 24px;
    margin-bottom: 40px;
  }
  
  .header-title {
    font-size: 2rem;
  }
  
  .header-subtitle {
    font-size: 1rem;
  }
  
  .question-card {
    padding: 24px;
  }
  
  .question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .question-icon {
    font-size: 1.8rem;
  }
  
  .question-title {
    font-size: 1.3rem;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .option-button {
    padding: 14px 16px;
    font-size: 0.9rem;
  }
  
  .custom-input-wrapper {
    flex-direction: column;
    gap: 8px;
  }
  
  .add-button {
    width: 100%;
  }
  
  .submit-button {
    padding: 18px 32px;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.8rem;
  }
  
  .question-title {
    font-size: 1.2rem;
  }
  
  .question-description {
    font-size: 0.95rem;
  }
  
  .option-button {
    padding: 12px 14px;
    font-size: 0.85rem;
  }
}
</style>
