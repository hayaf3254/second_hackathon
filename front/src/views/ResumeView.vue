<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '@/stores/document'

const router = useRouter()
const documentStore = useDocumentStore()

const formData = ref({
  highSchoolName: '',
  universityName: '',
  facultyName: '',
  departmentName: '',
  highSchoolGraduationYear: '',
  highSchoolGraduationMonth: '',
  universityEntranceYear: '',
  universityEntranceMonth: '',
  universityGraduationYear: '',
  universityGraduationMonth: ''
})

const generatedWorkHistory = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  if (!formData.value.highSchoolName || !formData.value.universityName || 
      !formData.value.facultyName || !formData.value.departmentName ||
      !formData.value.highSchoolGraduationYear || !formData.value.highSchoolGraduationMonth ||
      !formData.value.universityEntranceYear || !formData.value.universityEntranceMonth ||
      !formData.value.universityGraduationYear || !formData.value.universityGraduationMonth) {
    alert('すべての項目を入力してください。')
    return
  }

  isLoading.value = true
  
  try {
    const response = await fetch('http://localhost:3000/resume', {
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
    generatedWorkHistory.value = data.generatedWorkHistory
    
    // ストアにデータを保存
    documentStore.setResumeData({
      ...formData.value,
      generatedWorkHistory: data.generatedWorkHistory
    })
  } catch (error) {
    console.error('送信に失敗しました:', error)
    alert('履歴書生成に失敗しました。時間を置いて再度お試しください。')
  } finally {
    isLoading.value = false
  }
}

function goToSelfPR() {
  router.push({ name: 'selfpr' })
}

function backToHome() {
  router.push('/home')
}

function goToSummary() {
  router.push({ name: 'summary' })
}

// 年の選択肢を生成（過去10年〜未来5年）
function getYearOptions() {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear - 10; year <= currentYear + 5; year++) {
    years.push(year)
  }
  return years
}

// 月の選択肢を生成
function getMonthOptions() {
  return Array.from({ length: 12 }, (_, i) => i + 1)
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
      <div class="header-icon">📄</div>
      <h1 class="header-title">履歴書作成</h1>
      <p class="header-subtitle">
        学歴情報を入力して、履歴書の学歴・職歴欄を自動生成します
      </p>
    </div>

    <!-- フォームセクション -->
    <div class="form-container">
      <div class="form-card">
        <!-- 学校情報セクション -->
        <div class="section-header">
          <div class="section-icon">🏫</div>
          <div class="section-content">
            <h2 class="section-title">学校情報</h2>
            <p class="section-description">出身高校と大学の情報を入力してください</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">出身高校名</label>
            <div class="input-wrapper">
              <input
                v-model="formData.highSchoolName"
                class="form-input"
                type="text"
                placeholder="例：○○県立○○高等学校"
              />
            </div>
          </div>

          <div class="university-row">
            <div class="form-group">
              <label class="form-label">大学名</label>
              <div class="input-wrapper">
                <input
                  v-model="formData.universityName"
                  class="form-input"
                  type="text"
                  placeholder="例：○○大学"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">学部</label>
              <div class="input-wrapper">
                <input
                  v-model="formData.facultyName"
                  class="form-input"
                  type="text"
                  placeholder="例：経済学部"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">学科</label>
              <div class="input-wrapper">
                <input
                  v-model="formData.departmentName"
                  class="form-input"
                  type="text"
                  placeholder="例：経済学科"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 日程情報セクション -->
        <div class="section-header">
          <div class="section-icon">📅</div>
          <div class="section-content">
            <h2 class="section-title">学歴の年月</h2>
            <p class="section-description">各段階の年月を選択してください</p>
          </div>
        </div>

        <div class="date-grid">
          <div class="date-group">
            <label class="form-label">高校卒業年月</label>
            <div class="date-input-wrapper">
              <select v-model="formData.highSchoolGraduationYear" class="date-select">
                <option value="">年を選択</option>
                <option v-for="year in getYearOptions()" :key="year" :value="year">{{ year }}年</option>
              </select>
              <select v-model="formData.highSchoolGraduationMonth" class="date-select">
                <option value="">月を選択</option>
                <option v-for="month in getMonthOptions()" :key="month" :value="month">{{ month }}月</option>
              </select>
            </div>
          </div>

          <div class="date-group">
            <label class="form-label">大学入学年月</label>
            <div class="date-input-wrapper">
              <select v-model="formData.universityEntranceYear" class="date-select">
                <option value="">年を選択</option>
                <option v-for="year in getYearOptions()" :key="year" :value="year">{{ year }}年</option>
              </select>
              <select v-model="formData.universityEntranceMonth" class="date-select">
                <option value="">月を選択</option>
                <option v-for="month in getMonthOptions()" :key="month" :value="month">{{ month }}月</option>
              </select>
            </div>
          </div>

          <div class="date-group">
            <label class="form-label">大学卒業予定年月</label>
            <div class="date-input-wrapper">
              <select v-model="formData.universityGraduationYear" class="date-select">
                <option value="">年を選択</option>
                <option v-for="year in getYearOptions()" :key="year" :value="year">{{ year }}年</option>
              </select>
              <select v-model="formData.universityGraduationMonth" class="date-select">
                <option value="">月を選択</option>
                <option v-for="month in getMonthOptions()" :key="month" :value="month">{{ month }}月</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 送信ボタン -->
    <div class="submit-container">
      <button 
        class="submit-button" 
        @click="handleSubmit"
        :disabled="isLoading"
      >
        <span class="submit-icon">{{ isLoading ? '⏳' : '📝' }}</span>
        <span class="submit-text">{{ isLoading ? '生成中...' : '履歴書を生成' }}</span>
      </button>
    </div>

    <!-- 結果表示 -->
    <div v-if="generatedWorkHistory" class="result-container">
      <div class="result-card">
        <div class="result-header">
          <div class="result-icon">✨</div>
          <h2 class="result-title">生成された履歴書</h2>
        </div>
        <div class="result-content">
          <pre class="result-text">{{ generatedWorkHistory }}</pre>
        </div>
        
        <div class="navigation-buttons">
          <button class="nav-button secondary" @click="backToHome">
            <span class="nav-icon">🏠</span>
            <span>ホームに戻る</span>
          </button>
          <button class="nav-button primary" @click="goToSelfPR">
            <span class="nav-icon">✨</span>
            <span>自己PR作成へ</span>
          </button>
          <button class="nav-button primary" @click="goToSummary">
            <span class="nav-icon">📋</span>
            <span>まとめページへ</span>
          </button>
        </div>
      </div>
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

.form-container {
  max-width: 900px;
  margin: 0 auto 60px auto;
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.6s ease-out;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
}

.section-icon {
  font-size: 2rem;
  flex-shrink: 0;
  margin-top: 4px;
}

.section-content {
  flex: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.section-description {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.5;
  font-weight: 400;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  width: 100%;
}

.university-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.date-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.date-group {
  display: flex;
  flex-direction: column;
}

.date-input-wrapper {
  display: flex;
  gap: 12px;
}

.date-select {
  flex: 1;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #ffffff;
  transition: all 0.2s ease;
  cursor: pointer;
}

.date-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.submit-container {
  max-width: 900px;
  margin: 0 auto 60px auto;
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

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
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

.submit-button:hover:not(:disabled)::before {
  left: 100%;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.5);
}

.submit-icon {
  font-size: 1.3rem;
}

.submit-text {
  font-weight: 700;
}

.result-container {
  max-width: 900px;
  margin: 0 auto;
}

.result-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.6s ease-out;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: center;
}

.result-icon {
  font-size: 2rem;
}

.result-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c;
  letter-spacing: -0.01em;
}

.result-content {
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
}

.result-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #1a202c;
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
}

.navigation-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
}

.nav-button.secondary {
  background: #ffffff;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.nav-button.secondary:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.nav-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.nav-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.nav-icon {
  font-size: 1.1rem;
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
  
  .form-card, .result-card {
    padding: 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .section-icon {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .university-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .date-input-wrapper {
    flex-direction: column;
    gap: 8px;
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .nav-button {
    width: 100%;
    justify-content: center;
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
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .section-description {
    font-size: 0.95rem;
  }
  
  .form-input, .date-select {
    padding: 14px;
    font-size: 0.9rem;
  }
}
</style> 