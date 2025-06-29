<script setup>
import { useSuggestionStore } from '../stores/suggestion'
import { useRouter } from 'vue-router'

const suggestionStore = useSuggestionStore()
const router = useRouter()

function backToHome() {
  suggestionStore.setSuggestion('')
  router.push('/home')
}

function goToResume() {
  router.push({ name: 'resume' })
}

function goToSelfPR() {
  router.push({ name: 'selfpr' })
}
</script>

<template>
  <div class="result-container">
    <h1 class="title">おすすめ結果</h1>

    <div v-if="suggestionStore.text" class="result-box">
      <pre class="suggestion-text">{{ suggestionStore.text }}</pre>
    </div>

    <div v-else class="result-empty">
      <p>結果がありません。ホーム画面から入力を行ってください。</p>
    </div>

          <div class="navigation-buttons">
        <button class="nav-btn secondary" @click="backToHome">ホームに戻る</button>
        <button class="nav-btn primary" @click="goToResume">履歴書作成</button>
        <button class="nav-btn primary" @click="goToSelfPR">自己PR作成</button>
      </div>
  </div>
</template>

<style scoped>
.result-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  animation: fadeIn 0.6s ease;
  position: relative;
  overflow-x: hidden;
}
.result-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="0.5" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
  z-index: 0;
}
.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: #ffffff;
  text-shadow: 0 4px 15px rgba(0,0,0,0.5);
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;
}
.result-box {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.08);
  max-width: 800px;
  width: 100%;
  overflow-x: auto;
  white-space: pre-wrap;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255,255,255,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.result-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 70px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.08);
}
.suggestion-text {
  font-size: 1.2rem;
  line-height: 1.9;
  color: #1a202c;
  word-break: break-word;
  font-weight: 400;
}
.result-empty {
  color: rgba(255,255,255,0.8);
  margin-bottom: 40px;
  font-size: 1.1rem;
  text-align: center;
  position: relative;
  z-index: 1;
}
.navigation-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 32px;
}

.nav-btn {
  padding: 14px 28px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
}

.nav-btn.secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.nav-btn.secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.nav-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(102,126,234,0.3);
}

.nav-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102,126,234,0.4);
}

@media (max-width: 600px) {
  .result-card {
    padding: 24px 16px;
    max-width: 95vw;
  }
  
  .result-title {
    font-size: 1.6rem;
  }
  
  .result-text {
    font-size: 1rem;
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .nav-btn {
    width: 100%;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 