<template>
  <canvas ref="canvasRef" class="matrix-rain" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画布大小
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Matrix 字符集
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`'
  const charArray = chars.split('')

  const fontSize = 14
  const columns = canvas.width / fontSize

  // 每列的 Y 位置
  const drops: number[] = []
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100
  }

  function draw() {
    if (!ctx || !canvas) return

    // 半透明黑色背景（制造拖尾效果）
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 设置文字样式
    ctx.fillStyle = '#00ff00'
    ctx.font = `${fontSize}px "Courier New"`

    // 绘制字符
    for (let i = 0; i < drops.length; i++) {
      const char = charArray[Math.floor(Math.random() * charArray.length)];
      if (!char) continue;

      const x = i * fontSize;
      const y = (drops[i] as number) * fontSize;

      ctx.fillText(char, x, y);

      // 随机重置位置
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      (drops[i] as number)++;
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()

  // 窗口大小改变时重新设置
  const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
.matrix-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.15;
  pointer-events: none;
}
</style>
