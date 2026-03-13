<script setup lang="ts">
defineEmits<{
  (e: 'prev'): void
  (e: 'summary'): void
}>()
</script>

<template>
  <div class="epilogue">

    <!-- Subtle background shimmer -->
    <div class="bg-shimmer" aria-hidden="true"></div>
    <div class="bg-shimmer shimmer-2" aria-hidden="true"></div>

    <!-- Map button -->
    <button class="map-btn" @click="$emit('summary')" aria-label="Ver todos os anos">
      <span class="map-icon">⊞</span>
    </button>

    <div class="content">

      <!-- Year header -->
      <div class="year-block">
        <div class="year-ornament">✦ ♡ ✦</div>
        <div class="year-text">2026 — ?</div>
        <div class="year-subtitle">Presente e futuro</div>
        <div class="year-rule"></div>
      </div>

      <!-- Body text -->
      <div class="body-text">
        <p>
          Dezessete anos de história juntos — e cada página desse álbum é a prova de quanto
          já vivemos, crescemos e nos amamos.
        </p>
        <p>
          Mas essa história está longe de acabar. Ainda temos tantos capítulos pela frente:
          novas aventuras, novos lugares, e a família que estamos construindo juntos —
          com os nossos filhos ao lado.
        </p>
        <p>
          O melhor ainda está por vir. ♡
        </p>
      </div>

      <!-- Divider -->
      <div class="divider">
        <span class="divider-ornament">✦</span>
      </div>

      <!-- Trip announcement -->
      <div class="trip-block">
        <div class="trip-label">Um presente especial</div>
        <div class="trip-title">Uma surpresa te espera</div>
        <div class="trip-text">
          Prepare a mala — você tem uma viagem surpresa na sexta-feira. ✈
        </div>
        <div class="trip-glow" aria-hidden="true"></div>
      </div>

    </div>

    <!-- Footer nav (back only — this is the last page) -->
    <footer class="page-footer">
      <button class="nav-btn" @click="$emit('prev')" aria-label="Página anterior">‹</button>
      <div class="footer-ornament">✦ ♡ ✦</div>
      <div class="nav-placeholder"></div>
    </footer>

  </div>
</template>

<style scoped>
.epilogue {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(170deg, #0e0618 0%, #1a0a24 45%, #0e0618 100%);
  padding: 0 24px;
}

/* Background shimmer blobs */
.bg-shimmer {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(196, 151, 59, 0.07) 0%, transparent 70%);
  top: -60px;
  left: -80px;
  pointer-events: none;
  animation: shimmer-drift 9s ease-in-out infinite alternate;
}
.shimmer-2 {
  width: 260px;
  height: 260px;
  top: auto;
  bottom: -40px;
  right: -60px;
  left: auto;
  animation-delay: -4s;
  animation-duration: 11s;
}
@keyframes shimmer-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(20px, 15px) scale(1.1); }
}

/* Map button */
.map-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  background: rgba(196, 151, 59, 0.08);
  border: 1px solid rgba(196, 151, 59, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.map-btn:active { background: rgba(196, 151, 59, 0.16); }
.map-icon {
  font-size: 15px;
  color: rgba(196, 151, 59, 0.7);
  line-height: 1;
}

/* Main content */
.content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding-top: 20px;
  position: relative;
  z-index: 1;
}

/* Year block */
.year-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  animation: fade-up 0.9s ease both;
}

.year-ornament {
  font-family: 'Dancing Script', cursive;
  font-size: 13px;
  color: rgba(196, 151, 59, 0.5);
  letter-spacing: 5px;
  margin-bottom: 4px;
}

.year-text {
  font-family: 'Playfair Display', serif;
  font-size: 40px;
  font-weight: 700;
  color: #e8c87a;
  line-height: 1;
  letter-spacing: -1px;
  text-shadow: 0 0 40px rgba(232, 200, 122, 0.3);
}

.year-subtitle {
  font-family: 'Dancing Script', cursive;
  font-size: 20px;
  color: rgba(245, 230, 200, 0.75);
  letter-spacing: 0.3px;
  margin-top: 2px;
}

.year-rule {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196, 151, 59, 0.5), transparent);
  margin-top: 10px;
}

/* Body text */
.body-text {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: center;
  animation: fade-up 0.9s 0.15s ease both;
}

.body-text p {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(245, 230, 200, 0.72);
  letter-spacing: 0.2px;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  animation: fade-up 0.9s 0.3s ease both;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196, 151, 59, 0.25));
}
.divider::after {
  background: linear-gradient(90deg, rgba(196, 151, 59, 0.25), transparent);
}
.divider-ornament {
  font-size: 10px;
  color: rgba(196, 151, 59, 0.5);
}

/* Trip announcement */
.trip-block {
  width: 100%;
  background: linear-gradient(135deg, rgba(92, 26, 42, 0.35), rgba(61, 15, 28, 0.35));
  border: 1.5px solid rgba(196, 151, 59, 0.35);
  border-radius: 16px;
  padding: 20px 20px 22px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
  animation: fade-up 0.9s 0.45s ease both;
}

.trip-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 100%, rgba(196, 151, 59, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.trip-label {
  font-family: 'Lato', sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(196, 151, 59, 0.6);
}

.trip-title {
  font-family: 'Dancing Script', cursive;
  font-size: 26px;
  font-weight: 600;
  color: #e8c87a;
  line-height: 1.2;
  text-shadow: 0 0 20px rgba(232, 200, 122, 0.25);
}

.trip-text {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(245, 230, 200, 0.82);
  letter-spacing: 0.2px;
  margin-top: 2px;
}

/* Footer */
.page-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0 10px;
  position: relative;
  z-index: 1;
}

.nav-btn {
  width: 36px;
  height: 36px;
  background: none;
  border: 1.5px solid rgba(196, 151, 59, 0.25);
  border-radius: 50%;
  font-size: 22px;
  color: rgba(196, 151, 59, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.nav-btn:active { background: rgba(196, 151, 59, 0.1); }

.footer-ornament {
  font-family: 'Dancing Script', cursive;
  font-size: 12px;
  color: rgba(196, 151, 59, 0.35);
  letter-spacing: 4px;
}

.nav-placeholder { width: 36px; }

/* Entrance animations */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
