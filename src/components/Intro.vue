<template>
    <div class="w-full bg-[#002D47] rounded-xl shadow shadow-primary flex flex-col items-center justify-center gap-4 relative py-8">

        <img src="/assets/images/logo-amz-hero3.png" alt="Logo HeroLift" class="mx-auto mb-4 w-92">
        <p class="text-md font-press text-white mb-4">Escolha seu Personagem</p>


        <!-- Personagem animado usando sprite sheet + canvas -->
        <canvas v-if="personagem" id="spriteCanvas" width="128" height="128" class="flex items-center justify-center bg-base-100 rounded-full"
                :style="{ left: personagemX + 'px', top: '300px' }"></canvas>

        <!-- Opções de escolha -->
        <div class="flex gap-4 mt-4">
            <button class="btn btn-warning btn-outline" @click="selecionarPersonagem('Herói')">Herói</button>
            <button class="btn btn-secondary btn-outline" @click="selecionarPersonagem('Heroína')">Heroína</button>
        </div>

        <!-- Nome do player -->
        <input v-model="nome" placeholder="Digite seu nome" class="input input-bordered mt-4 w-98 text-center" />

        <!-- Botão iniciar -->
        <button class="btn btn-wide btn-success mt-4" :disabled="!nome || !personagem" @click="iniciar">
            Iniciar Jornada
        </button>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {resetGameState, updateGameState} from '@/utils/gameState'

const router = useRouter()
const nome = ref('')
const personagem = ref(null)
const personagemX = ref(100)
let direcao = 1

const SPRITE_WIDTH = 64
const SPRITE_HEIGHT = 64
const FRAME_COUNT = 9
const ANIMATION_ROW = 2
let currentFrame = 0
let sprite = new Image()

function selecionarPersonagem(tipo) {
    personagem.value = tipo
    if (tipo === 'Heroína') {
        sprite.src = '/assets/sprites/players/female/walk.png'
    } else {
        sprite.src = '/assets/sprites/players/male/walk.png'
    }
}

function iniciar() {
    updateGameState({
        "player": {
            "name": nome.value,
            "classe": personagem.value,
            "vidas": 0,
            "hasHeroLift": false,
            "xp": 0,
            "level": 0,
            "orbes": 0,
            "inventario": [],
            "score": 0,
            "vitorias": 0,
            "derrotas": 0
        },
        "game": {
            "fasesConcluidas": [],
            "fasesDisponiveis": [],
            "missaoAtual": "",
            "conquistas": [],
            "tempoJogado": 0
        },
        "heroLift": {
            "habilidadesDesbloqueadas": [],
            "missoesAtivas": [],
        },
        "audio": {
            "isPlaying": false,
            "volume": 0.6,
            "isMuted": false
        }
    })
    router.push({ name: 'Preludio' })
}

function drawFrame(ctx) {
    ctx.clearRect(0, 0, 128, 128)

    ctx.drawImage(
        sprite,
        currentFrame * SPRITE_WIDTH,
        ANIMATION_ROW * SPRITE_HEIGHT,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        0,
        0,
        SPRITE_WIDTH * 2,
        SPRITE_HEIGHT * 2
    )

    currentFrame = (currentFrame + 1) % FRAME_COUNT
}

function animarPersonagem() {
    const canvas = document.getElementById('spriteCanvas')
    const ctx = canvas.getContext('2d')

    setInterval(() => {
        drawFrame(ctx)
    }, 200)
}

onMounted(() => {
    resetGameState()
    window.dispatchEvent(new Event('update-vidas'))

    const saved = localStorage.getItem('gameState')
    if (saved) {
        const savedState = JSON.parse(saved)
        const tipo = savedState?.player?.personagem
        if (tipo) selecionarPersonagem(tipo)
    }

    sprite.onload = animarPersonagem
})
</script>

<style scoped>
.font-press {
    font-family: 'Press Start 2P', monospace;
}
[tabindex='0'] {
    outline: none;
}
</style>