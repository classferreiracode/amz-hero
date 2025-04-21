<template>
    <div v-if="mostrar"
         class="fixed inset-0 bg-[#001E32] bg-opacity-80 z-[9999] flex flex-col items-center justify-center text-center text-white font-press gap-4">
        <img src="/assets/images/fim-orbes.png" alt="Logo HeroLift" class="mx-auto mb-4 w-92">
        <img src="/assets/images/fim.png" alt="Logo HeroLift" class="mx-auto mb-4 w-92">

        <div class="flex gap-4">
            <button class="btn btn-outline" @click="voltarInicio">Voltar ao Início</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { resetGameState, updateGameState} from '@/utils/gameState'
import { useRouter } from 'vue-router'

const mostrar = ref(false)
const router = useRouter()
const bgAudio = new Audio('/assets/audio/final1.mp3')

// Escuta evento global
window.addEventListener('mostrar-game-final1', () => {
    mostrar.value = true
    updateGameState({
        audio: {
            isPlaying: false,
        }
    })
    bgAudio.volume = 0.6
    bgAudio.play().catch(() => {})
})

//ao montar o componente, toca a musica
onMounted(() => {
    const audio = new Audio('/assets/audio/fx/game-start.mp3')
    audio.volume = 0.6
    audio.play().catch(() => {})
})

onUnmounted(() => {
    bgAudio.pause()
})

function voltarInicio() {
    updateGameState({ vidas: 0 })
    resetGameState()
    mostrar.value = false
    bgAudio.pause()
    router.push('/')
}
</script>
