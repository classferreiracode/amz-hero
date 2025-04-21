<template>
    <div class="fixed top-20 left-4 z-[9999] space-y-2 w-72">
        <transition-group name="fade" tag="div">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="alert alert-info shadow-lg bg-base-200 text-left font-press animate-slide-in"
            >
                <div>
                  <span class="text-sm">
                    <strong class="block text-primary">{{ toast.title }}</strong>
                    <p class="mt-1 text-white">{{ toast.message }}</p>
                  </span>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const toasts = ref([])

function playSoundByType(type = 'info') {
    let soundMap = {
        conquista: '/assets/audio/fx/conquista.mp3',
        erro: '/assets/audio/fx/error.mp3',
        item: '/assets/audio/fx/item.mp3',
        info: '/assets/audio/fx/info.mp3',
        levelup: '/assets/audio/fx/level-up.mp3',
        gameover: '/assets/audio/fx/game-over.mp3'
    }

    const audio = new Audio(soundMap[type] || soundMap.info)
    audio.volume = 0.6
    audio.play().catch(() => {})
}

function showToast({ title, message, duration = 4000, type = 'info' }) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, title, message })

    playSoundByType(type)

    setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
}

onMounted(() => {
    window.addEventListener('show-toast', (event) => {
        showToast(event.detail)
    })
})
</script>
