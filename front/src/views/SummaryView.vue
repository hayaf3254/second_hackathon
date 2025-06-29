<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '@/stores/document'

const router = useRouter()
const documentStore = useDocumentStore()

const resumeData = computed(() => documentStore.resumeData)
const selfPRData = computed(() => documentStore.selfPRData)
const hasCompleteData = computed(() => documentStore.hasCompleteData)

// 希望業界・職種の表示用
const displayedDesiredRole = computed(() => {
  if (!selfPRData.value.desiredRole) return '特になし'
  if (selfPRData.value.desiredRole === 'その他' && selfPRData.value.customDesiredRole) {
    return selfPRData.value.customDesiredRole
  }
  return selfPRData.value.desiredRole
})

onMounted(() => {
  // データが不完全な場合はホームに戻る
  if (!hasCompleteData.value) {
    alert('履歴書と自己PRの両方を作成してからアクセスしてください。')
    router.push('/home')
  }
})

function goToResume() {
  router.push({ name: 'resume' })
}

function goToSelfPR() {
  router.push({ name: 'selfpr' })
}

function backToHome() {
  router.push('/home')
}

function downloadSummary() {
  const content = `
就職活動書類

【履歴書】
${resumeData.value.generatedWorkHistory}

【自己PR】
${selfPRData.value.generatedSelfPR}

【基本情報】
大学名：${resumeData.value.universityName}
学部：${resumeData.value.facultyName}
学科：${resumeData.value.departmentName}
高校名：${resumeData.value.highSchoolName}

【強み】
${Array.isArray(selfPRData.value.userStrengths) ? selfPRData.value.userStrengths.join('、') : selfPRData.value.userStrengths}

【希望業界・職種】
${displayedDesiredRole.value}
  `.trim()

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = '就職活動書類.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
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
      <div class="header-icon">📋</div>
      <h1 class="header-title">就職活動書類まとめ</h1>
      <p class="header-subtitle">作成した履歴書と自己PRをまとめて確認できます</p>
    </div>

    <div v-if="hasCompleteData" class="content-container">
      <!-- 基本情報カード -->
      <div class="info-card">
        <div class="card-header">
          <div class="card-icon">👤</div>
          <h2 class="card-title">基本情報</h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">🏫 出身高校</div>
            <div class="info-value">{{ resumeData.highSchoolName }}高校</div>
          </div>
          <div class="info-item">
            <div class="info-label">🎓 大学名</div>
            <div class="info-value">{{ resumeData.universityName }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">📚 学部</div>
            <div class="info-value">{{ resumeData.facultyName }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">🔬 学科</div>
            <div class="info-value">{{ resumeData.departmentName }}</div>
          </div>
        </div>
      </div>

      <!-- 履歴書カード -->
      <div class="document-card">
        <div class="card-header">
          <div class="card-icon">📄</div>
          <h2 class="card-title">履歴書</h2>
          <button class="edit-button" @click="goToResume">
            <span class="edit-icon">✏️</span>
            <span>編集</span>
          </button>
        </div>
        <div class="document-content">
          <div class="content-box">
            <h3 class="content-title">学歴・職歴</h3>
            <div class="content-text">
              <pre>{{ resumeData.generatedWorkHistory }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 自己PRカード -->
      <div class="document-card">
        <div class="card-header">
          <div class="card-icon">✨</div>
          <h2 class="card-title">自己PR</h2>
          <button class="edit-button" @click="goToSelfPR">
            <span class="edit-icon">✏️</span>
            <span>編集</span>
          </button>
        </div>
        <div class="document-content">
          <!-- 強み -->
          <div class="strengths-section">
            <h3 class="content-title">💪 あなたの強み</h3>
            <div class="strengths-container">
              <div 
                v-for="strength in selfPRData.userStrengths" 
                :key="strength" 
                class="strength-badge"
              >
                {{ strength }}
              </div>
            </div>
          </div>
          
          <!-- 希望業界・職種 -->
          <div v-if="selfPRData.desiredRole" class="desired-section">
            <h3 class="content-title">🎯 希望業界・職種</h3>
            <div class="desired-value">{{ displayedDesiredRole }}</div>
          </div>
          
          <!-- 自己PR文 -->
          <div class="content-box">
            <h3 class="content-title">📝 自己PR文</h3>
            <div class="content-text">
              <p>{{ selfPRData.generatedSelfPR }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="action-container">
        <button class="action-button secondary" @click="backToHome">
          <span class="action-icon">🏠</span>
          <span>ホームに戻る</span>
        </button>
        <button class="action-button primary" @click="downloadSummary">
          <span class="action-icon">📥</span>
          <span>テキストでダウンロード</span>
        </button>
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
  max-width: 700px;
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

.content-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.info-card, .document-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideUp 0.6s ease-out;
}

.info-card:hover, .document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.card-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  flex: 1;
  letter-spacing: -0.01em;
}

.edit-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 25px;
  color: #667eea;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.edit-button:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.edit-icon {
  font-size: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.info-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.info-item:hover {
  background: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.info-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-value {
  font-size: 1.1rem;
  color: #1a202c;
  font-weight: 700;
  line-height: 1.4;
}

.document-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.strengths-section, .desired-section {
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.content-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.strengths-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.strength-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;
}

.strength-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.desired-value {
  font-size: 1.2rem;
  color: #1a202c;
  font-weight: 600;
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.content-box {
  background: #ffffff;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.content-text {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.content-text pre {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #1a202c;
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
  font-weight: 400;
}

.content-text p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #1a202c;
  margin: 0;
  font-weight: 400;
  white-space: pre-wrap;
}

.action-container {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 32px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 32px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-button:hover::before {
  left: 100%;
}

.action-button.secondary {
  background: #ffffff;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.action-button.secondary:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
}

.action-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.action-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
}

.action-icon {
  font-size: 1.3rem;
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
  
  .info-card, .document-card {
    padding: 24px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .strengths-container {
    gap: 8px;
  }
  
  .strength-badge {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
  
  .action-container {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
    padding: 16px 24px;
    font-size: 1rem;
  }
  
  .content-box {
    padding: 20px;
  }
  
  .content-text {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.8rem;
  }
  
  .card-icon {
    font-size: 1.5rem;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
  
  .content-title {
    font-size: 1.1rem;
  }
  
  .info-value {
    font-size: 1rem;
  }
  
  .content-text pre,
  .content-text p {
    font-size: 0.95rem;
  }
}
</style> 