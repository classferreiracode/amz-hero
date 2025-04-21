<template>
    <div v-if="mostrar" class="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex flex-col items-center justify-center text-center text-white font-press gap-4">
        <img src="/assets/images/fim-orbes.png" alt="Logo HeroLift" class="mx-auto mb-4 w-92">

        <div class="flex gap-4">
            <button class="btn btn-outline" @click="voltarInicio">Voltar ao Início</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import {resetGameState} from '@/utils/gameState'
import { useRouter } from 'vue-router'

const mostrar = ref(false)
const router = useRouter()

// Escuta evento global
window.addEventListener('mostrar-game-final2', () => {
    mostrar.value = true
})

//ao montar o componente, toca a musica
onMounted(() => {
    const audio = new Audio('/assets/audio/fx/game-start.mp3')
    audio.volume = 0.6
    audio.play().catch(() => {})
})

function voltarInicio() {
    resetGameState()
    mostrar.value = false
    router.push('/')
}
</script>
