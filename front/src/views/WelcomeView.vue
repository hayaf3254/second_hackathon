<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})

function startJourney() {
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
  <div class="welcome-container">
    <!-- 背景装飾 -->
    <div class="bg-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>
    </div>

    <!-- メインコンテンツ -->
    <div class="main-content" :class="{ visible: isVisible }">
      <!-- ヘッダーセクション -->
      <div class="hero-section">
        <div class="logo-container">
          <div class="app-logo">🎯</div>
          <h1 class="app-title">CareerCompass</h1>
          <p class="app-subtitle">キャリアコンパス</p>
        </div>
        
        <div class="hero-text">
          <h2 class="hero-title">
            あなたの<span class="highlight">理想のキャリア</span>を<br>
            AIが一緒に見つけます
          </h2>
          <p class="hero-description">
            就活に迷っているあなたへ。<br>
            AIがあなたの強みや興味を分析し、最適な業界・職種を提案。<br>
            履歴書・自己PRの作成まで、就活のすべてをサポートします。
          </p>
        </div>
      </div>

      <!-- 機能紹介セクション -->
      <div class="features-section">
        <h3 class="features-title">3つのステップで理想のキャリアへ</h3>
        
        <div class="features-grid">
          <div class="feature-card" @click="startJourney">
            <div class="feature-icon">🧭</div>
            <h4 class="feature-title">STEP 1</h4>
            <h5 class="feature-name">キャリア診断</h5>
            <p class="feature-description">
              あなたの目標・興味・価値観を<br>
              詳しく分析してAIが最適な<br>
              業界・職種を提案します
            </p>
            <div class="feature-button">
              <span>診断を始める</span>
              <span class="arrow">→</span>
            </div>
          </div>

          <div class="feature-card" @click="goToResume">
            <div class="feature-icon">📄</div>
            <h4 class="feature-title">STEP 2</h4>
            <h5 class="feature-name">履歴書作成</h5>
            <p class="feature-description">
              学歴情報を入力するだけで<br>
              正確で見栄えの良い履歴書の<br>
              学歴・職歴欄を自動生成
            </p>
            <div class="feature-button">
              <span>履歴書を作成</span>
              <span class="arrow">→</span>
            </div>
          </div>

          <div class="feature-card" @click="goToSelfPR">
            <div class="feature-icon">✨</div>
            <h4 class="feature-title">STEP 3</h4>
            <h5 class="feature-name">自己PR作成</h5>
            <p class="feature-description">
              ステップ形式の質問に答えるだけで<br>
              魅力的で説得力のある<br>
              自己PR文を生成・編集
            </p>
            <div class="feature-button">
              <span>自己PRを作成</span>
              <span class="arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  position: relative;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
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

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 20%;
  animation-delay: 2s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  right: 10%;
  animation-delay: 3s;
}

.shape-5 {
  width: 140px;
  height: 140px;
  top: 50%;
  left: 5%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.main-content {
  max-width: 1200px;
  width: 100%;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-section {
  text-align: center;
  margin-bottom: 80px;
}

.logo-container {
  margin-bottom: 40px;
}

.app-logo {
  font-size: 4rem;
  margin-bottom: 16px;
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.app-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.app-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.1em;
}

.hero-text {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 24px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.hero-description {
  font-size: 1.2rem;
  color: #2d3748;
  line-height: 1.8;
  margin: 0;
  font-weight: 400;
}

.features-section {
  margin-bottom: 80px;
}

.features-title {
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin-bottom: 48px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 8px;
  letter-spacing: 0.1em;
}

.feature-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}

.feature-description {
  font-size: 1rem;
  color: #2d3748;
  line-height: 1.6;
  margin-bottom: 24px;
}

.feature-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.feature-button:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.arrow {
  transition: transform 0.3s ease;
}

.feature-card:hover .arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .welcome-container {
    padding: 16px;
  }
  
  .app-title {
    font-size: 2.5rem;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-text {
    padding: 32px 24px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .feature-card {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 2rem;
  }
  
  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .features-title {
    font-size: 1.6rem;
  }
}
</style> 