<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '@/stores/document'

const router = useRouter()
const documentStore = useDocumentStore()

const formData = ref({
  userStrengths: [],
  experienceContext: '',
  effortDetails: '',
  desiredRole: '',
  customDesiredRole: ''
})

const customStrength = ref('')
const showCustomInput = ref(false)
const generatedSelfPR = ref('')
const editableSelfPR = ref('')
const isLoading = ref(false)
const isEditing = ref(false)

const strengthOptions = [
  '粘り強さ',
  '協調性',
  '行動力',
  '分析力',
  'コミュニケーション力',
  '計画性',
  '課題解決力',
  'リーダーシップ'
]

const industryOptions = [
  'IT業界',
  'メーカー',
  '商社',
  'コンサルティング',
  '金融',
  '不動産',
  '教育',
  '医療・福祉',
  'サービス業',
  '特にない',
  'その他'
]

function handleStrengthToggle(strength) {
  if (formData.value.userStrengths.includes(strength)) {
    formData.value.userStrengths = formData.value.userStrengths.filter(item => item !== strength)
  } else {
    formData.value.userStrengths.push(strength)
  }
}

function addCustomStrength() {
  const customValue = customStrength.value.trim()
  if (customValue && !formData.value.userStrengths.includes(customValue)) {
    formData.value.userStrengths.push(customValue)
    customStrength.value = ''
    showCustomInput.value = false
  }
}

function removeStrength(strength) {
  formData.value.userStrengths = formData.value.userStrengths.filter(item => item !== strength)
}

async function handleSubmit() {
  if (formData.value.userStrengths.length === 0 || !formData.value.experienceContext || !formData.value.effortDetails) {
    alert('必須項目をすべて入力してください。')
    return
  }

  isLoading.value = true
  
  try {
    const response = await fetch('http://localhost:3000/selfPR', {
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
    generatedSelfPR.value = data.generatedSelfPR
    editableSelfPR.value = data.generatedSelfPR
    
    // ストアにデータを保存
    documentStore.setSelfPRData({
      ...formData.value,
      generatedSelfPR: data.generatedSelfPR
    })
  } catch (error) {
    console.error('送信に失敗しました:', error)
    alert('自己PR生成に失敗しました。時間を置いて再度お試しください。')
  } finally {
    isLoading.value = false
  }
}

function backToHome() {
  router.push('/home')
}

function goToSummary() {
  router.push({ name: 'summary' })
}

function startEditing() {
  isEditing.value = true
}

function saveEdit() {
  isEditing.value = false
  // 編集内容をストアに保存
  documentStore.setSelfPRData({
    ...documentStore.selfPRData,
    generatedSelfPR: editableSelfPR.value
  })
}

function cancelEdit() {
  editableSelfPR.value = generatedSelfPR.value
  isEditing.value = false
}

function resetToOriginal() {
  editableSelfPR.value = generatedSelfPR.value
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
      <div class="header-icon">✨</div>
      <h1 class="header-title">自己PR作成</h1>
      <p class="header-subtitle">ステップに従って情報を入力し、自己PR文を作成しましょう</p>
    </div>

    <!-- ステップセクション -->
    <div class="steps-container">
      <!-- Step 1: 強み選択 -->
      <div class="step-card">
        <div class="step-header">
          <div class="step-badge">
            <span class="step-number">1</span>
          </div>
          <div class="step-content">
            <h2 class="step-title">あなたの強みは何ですか？</h2>
            <p class="step-description">当てはまるものを選択してください（複数選択可）</p>
          </div>
        </div>
        
        <div class="options-grid">
          <button
            v-for="strength in strengthOptions"
            :key="strength"
            class="option-button"
            :class="{ active: formData.userStrengths.includes(strength) }"
            @click="handleStrengthToggle(strength)"
          >
            <span class="option-text">{{ strength }}</span>
            <div class="option-check">✓</div>
          </button>
          <button
            class="option-button add-option"
            @click="showCustomInput = !showCustomInput"
          >
            <span class="option-text">その他</span>
            <div class="option-plus">+</div>
          </button>
        </div>

        <div v-if="showCustomInput" class="custom-input-container">
          <div class="custom-input-wrapper">
            <input
              v-model="customStrength"
              class="custom-input"
              type="text"
              placeholder="カスタム強みを入力..."
              @keypress.enter="addCustomStrength"
            />
            <button class="add-button" @click="addCustomStrength">追加</button>
          </div>
        </div>

        <div v-if="formData.userStrengths.filter(item => !strengthOptions.includes(item)).length > 0" class="custom-tags">
          <div
            v-for="item in formData.userStrengths.filter(item => !strengthOptions.includes(item))"
            :key="item"
            class="custom-tag"
          >
            <span>{{ item }}</span>
            <button class="remove-button" @click="removeStrength(item)">×</button>
          </div>
        </div>
      </div>

      <!-- Step 2: 経験 -->
      <div class="step-card">
        <div class="step-header">
          <div class="step-badge">
            <span class="step-number">2</span>
          </div>
          <div class="step-content">
            <h2 class="step-title">どんな活動・経験からその強みが身につきましたか？</h2>
            <p class="step-description">具体的な経験やエピソードを教えてください</p>
          </div>
        </div>
        
        <div class="textarea-container">
          <textarea
            v-model="formData.experienceContext"
            class="textarea-input"
            rows="4"
            placeholder="例：大学のゼミでリーダーを経験し、チーム全員が納得する方向性を話し合いながらまとめた。"
          ></textarea>
        </div>
      </div>

      <!-- Step 3: 努力・工夫 -->
      <div class="step-card">
        <div class="step-header">
          <div class="step-badge">
            <span class="step-number">3</span>
          </div>
          <div class="step-content">
            <h2 class="step-title">その経験の中で、特に頑張ったこと・工夫したことは？</h2>
            <p class="step-description">あなたの取り組みや工夫を具体的に教えてください</p>
          </div>
        </div>
        
        <div class="textarea-container">
          <textarea
            v-model="formData.effortDetails"
            class="textarea-input"
            rows="4"
            placeholder="例：進捗が遅れていたメンバーを責めず、週1回の進捗確認MTGを導入した。"
          ></textarea>
        </div>
      </div>

      <!-- Step 4: 希望業界（任意） -->
      <div class="step-card">
        <div class="step-header">
          <div class="step-badge optional">
            <span class="step-number">4</span>
          </div>
          <div class="step-content">
            <h2 class="step-title">目指す業界・職種はありますか？</h2>
            <p class="step-description">任意項目：PR文のトーン調整に使用します</p>
          </div>
        </div>
        
        <div class="select-container">
          <select v-model="formData.desiredRole" class="select-input">
            <option value="">選択してください</option>
            <option v-for="industry in industryOptions" :key="industry" :value="industry">
              {{ industry }}
            </option>
          </select>

          <div v-if="formData.desiredRole === 'その他'" class="custom-role-container">
            <input
              v-model="formData.customDesiredRole"
              class="custom-role-input"
              type="text"
              placeholder="希望する業界・職種を具体的に入力してください"
            />
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
        <span class="submit-icon">{{ isLoading ? '⏳' : '✨' }}</span>
        <span class="submit-text">{{ isLoading ? '生成中...' : '自己PRを生成' }}</span>
      </button>
    </div>

    <!-- 結果表示 -->
    <div v-if="generatedSelfPR" class="result-container">
      <div class="result-card">
        <div class="result-header">
          <div class="result-icon">🎉</div>
          <h2 class="result-title">生成された自己PR</h2>
        </div>
        
        <!-- 編集モード -->
        <div v-if="isEditing" class="edit-mode">
          <div class="edit-header">
            <div class="edit-icon">✏️</div>
            <div class="edit-content">
              <h3 class="edit-title">自己PRを編集</h3>
              <p class="edit-description">内容を自由に編集してください</p>
            </div>
          </div>
          
          <div class="edit-box">
            <textarea
              v-model="editableSelfPR"
              class="edit-textarea"
              rows="8"
              placeholder="自己PR文を編集してください..."
            ></textarea>
            <div class="char-count">
              {{ editableSelfPR.length }} 文字
            </div>
          </div>
          
          <div class="edit-actions">
            <button class="edit-btn cancel" @click="cancelEdit">
              <span class="btn-icon">❌</span>
              <span>キャンセル</span>
            </button>
            <button class="edit-btn reset" @click="resetToOriginal">
              <span class="btn-icon">🔄</span>
              <span>元に戻す</span>
            </button>
            <button class="edit-btn save" @click="saveEdit">
              <span class="btn-icon">💾</span>
              <span>保存</span>
            </button>
          </div>
        </div>
        
        <!-- 表示モード -->
        <div v-else class="display-mode">
          <div class="result-content">
            <p class="result-text">{{ editableSelfPR }}</p>
          </div>
          
          <div class="result-actions">
            <button class="edit-trigger-btn" @click="startEditing">
              <span class="edit-trigger-icon">✏️</span>
              <span>編集する</span>
            </button>
          </div>
        </div>
        
        <div class="navigation-buttons">
          <button class="nav-button secondary" @click="backToHome">
            <span class="nav-icon">🏠</span>
            <span>ホームに戻る</span>
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

.steps-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.step-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideUp 0.6s ease-out;
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.step-badge {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.step-badge.optional {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.step-number {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.step-description {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.5;
  font-weight: 400;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
.select-container {
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

.select-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #ffffff;
  transition: border-color 0.2s ease;
  cursor: pointer;
}

.select-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.custom-role-container {
  margin-top: 16px;
}

.custom-role-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #ffffff;
  transition: border-color 0.2s ease;
}

.custom-role-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-container {
  max-width: 900px;
  margin: 60px auto;
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

.edit-mode {
  margin-bottom: 32px;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  justify-content: center;
}

.edit-icon {
  font-size: 1.8rem;
}

.edit-content {
  text-align: center;
}

.edit-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
}

.edit-description {
  font-size: 1rem;
  color: #4a5568;
  margin: 0;
}

.edit-box {
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  position: relative;
}

.edit-textarea {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #1a202c;
  resize: vertical;
  font-family: inherit;
  outline: none;
  min-height: 150px;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.9rem;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 8px;
}

.edit-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
}

.edit-btn.cancel {
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.edit-btn.cancel:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.edit-btn.reset {
  background: #fef3c7;
  color: #d97706;
  border: 2px solid #fbbf24;
}

.edit-btn.reset:hover {
  background: #fde68a;
  transform: translateY(-1px);
}

.edit-btn.save {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.edit-btn.save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-icon {
  font-size: 1rem;
}

.display-mode {
  margin-bottom: 32px;
}

.result-content {
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.result-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #1a202c;
  margin: 0;
  white-space: pre-wrap;
}

.result-actions {
  text-align: center;
  margin-bottom: 32px;
}

.edit-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.edit-trigger-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.edit-trigger-icon {
  font-size: 1.1rem;
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
  
  .step-card, .result-card {
    padding: 24px;
  }
  
  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .step-badge {
    width: 40px;
    height: 40px;
  }
  
  .step-number {
    font-size: 1rem;
  }
  
  .step-title {
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
  
  .edit-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .edit-btn {
    width: 100%;
    justify-content: center;
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
  
  .char-count {
    position: static;
    text-align: right;
    margin-top: 8px;
    background: transparent;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.8rem;
  }
  
  .step-title {
    font-size: 1.2rem;
  }
  
  .step-description {
    font-size: 0.95rem;
  }
  
  .option-button {
    padding: 12px 14px;
    font-size: 0.85rem;
  }
  
  .textarea-input, .select-input, .custom-role-input {
    padding: 14px;
    font-size: 0.9rem;
  }
}
</style> 