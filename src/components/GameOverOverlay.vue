<template>
    <div v-if="mostrar" class="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex flex-col items-center justify-center text-center text-white font-press gap-4">
        <h2 class="text-2xl">😵 Game Over</h2>
        <p class="text-sm">Você perdeu todas as suas vidas!</p>
        <div class="flex gap-4">
            <button class="btn btn-error" @click="reiniciar">Reiniciar Fase</button>
            <button class="btn btn-outline" @click="voltarInicio">Voltar ao Início</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getGameState, updateGameState } from '@/utils/gameState'
import { useRouter } from 'vue-router'

const mostrar = ref(false)
const router = useRouter()

// Escuta evento global
window.addEventListener('mostrar-game-over', () => {
    mostrar.value = true
})

//ao montar o componente, toca a musica
onMounted(() => {
    const audio = new Audio('/assets/audio/fx/game-start.mp3')
    audio.volume = 0.6
    audio.play().catch(() => {})
})

function reiniciar() {
    updateGameState({ vidas: 3 }) // reinicia com 3 vidas
    mostrar.value = false
    router.go(0) // recarrega rota atual
}

function voltarInicio() {
    updateGameState({ vidas: 3 })
    mostrar.value = false
    router.push('/')
}
</script>
