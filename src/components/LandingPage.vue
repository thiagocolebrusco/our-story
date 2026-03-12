<script setup lang="ts">
defineEmits<{ (e: 'enter'): void }>()

// ── Customize the landing text here ──────────────────────────────────────────
const text = {
  to:       'Para Mayara',
  title:    '17 anos de amor',
  subtitle: 'Um presente que você vai desvendando aos poucos ♡',
  body: [
    'Espalhei 17 pacotes pelo nosso dia. Cada QR code que você encontrar vai abrir memórias escondidas — fotos do nosso tempo juntos, de 2009 até hoje.',
    'Encontre os pacotes, escaneie os códigos e veja nossa história se revelar.',
  ],
  hint:   'Dica: procure pelos envelopes que escondi pra você 🔍',
  button: 'Abrir o álbum',
}
// ─────────────────────────────────────────────────────────────────────────────
</script>

<template>
  <div class="landing">

    <!-- Background shimmer -->
    <div class="bg-shimmer" aria-hidden="true"></div>

    <!-- Content -->
    <div class="content">

      <div class="top-ornament">✦ ♡ ✦</div>

      <div class="to-label">{{ text.to }}</div>

      <h1 class="title">{{ text.title }}</h1>

      <div class="rule">
        <span class="rule-line"></span>
        <span class="rule-heart">♡</span>
        <span class="rule-line"></span>
      </div>

      <p class="subtitle">{{ text.subtitle }}</p>

      <div class="body-text">
        <p v-for="(para, i) in text.body" :key="i">{{ para }}</p>
      </div>

      <div class="hint-box">
        <span class="hint-text">{{ text.hint }}</span>
      </div>

      <button class="enter-btn" @click="$emit('enter')">
        {{ text.button }} ✦
      </button>

      <div class="bottom-ornament">✦ ♡ ✦</div>

    </div>
  </div>
</template>

<style scoped>
.landing {
  position: absolute;
  inset: 0;
  z-index: 600;
  background: linear-gradient(170deg, #0f0510 0%, #1e0a18 45%, #120618 75%, #0a0310 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Subtle radial shimmer in background */
.bg-shimmer {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 40% at 50% 20%, rgba(196, 151, 59, 0.07) 0%, transparent 70%),
    radial-gradient(ellipse 50% 30% at 50% 85%, rgba(140, 30, 60, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Main content ── */
.content {
  width: 100%;
  max-width: 360px;
  padding: 40px 28px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  text-align: center;
  position: relative;
}

.top-ornament,
.bottom-ornament {
  font-family: 'Dancing Script', cursive;
  font-size: 13px;
  color: rgba(196, 151, 59, 0.5);
  letter-spacing: 6px;
}
.top-ornament { margin-bottom: 16px; }
.bottom-ornament { margin-top: 20px; }

.to-label {
  font-family: 'Lato', sans-serif;
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(196, 151, 59, 0.6);
  margin-bottom: 10px;
}

.title {
  font-family: 'Dancing Script', cursive;
  font-size: 40px;
  font-weight: 700;
  color: #e8c87a;
  line-height: 1.1;
  text-shadow: 0 0 40px rgba(232, 200, 122, 0.3);
  margin: 0 0 18px;
}

/* Rule divider */
.rule {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 18px;
}

.rule-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196, 151, 59, 0.35), transparent);
}

.rule-heart {
  font-size: 11px;
  color: rgba(196, 151, 59, 0.6);
}

.subtitle {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-style: italic;
  color: rgba(245, 230, 200, 0.75);
  line-height: 1.5;
  margin-bottom: 20px;
}

/* Body paragraphs */
.body-text {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 22px;
}

.body-text p {
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(245, 230, 200, 0.6);
  line-height: 1.65;
  letter-spacing: 0.2px;
}

/* Hint box */
.hint-box {
  width: 100%;
  background: rgba(196, 151, 59, 0.07);
  border: 1px solid rgba(196, 151, 59, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 28px;
}

.hint-text {
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  font-weight: 300;
  font-style: italic;
  color: rgba(196, 151, 59, 0.8);
  line-height: 1.5;
}

/* CTA button */
.enter-btn {
  padding: 15px 44px;
  background: linear-gradient(135deg, #5c2235, #7a2d3d);
  border: 1.5px solid #c4973b;
  border-radius: 30px;
  font-family: 'Dancing Script', cursive;
  font-size: 22px;
  font-weight: 600;
  color: #f5e6c8;
  cursor: pointer;
  letter-spacing: 0.5px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.45),
    0 0 24px rgba(196, 151, 59, 0.12);
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}

.enter-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}
</style>
