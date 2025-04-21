<template>
    <div
        ref="gameArea"
        tabindex="0"
        class="relative w-full h-full"
        style="background: url('/assets/maps/bg.png') center/cover"
    >

        <!-- Canvas para renderizar NPC -->
        <canvas ref="julioCanvas" class="absolute z-40" width="128" height="128" :style="{ left: julio.x + 'px', top: julio.y + 'px',
        position: 'absolute' }"></canvas>

        <!-- Diálogo -->
        <div
            v-if="dialogState.showDialog"
            class="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full p-4 bg-base-100 border border-primary rounded-lg shadow-lg text-sm space-y-2"
        >
            <p>
                <span :class="player.name == dialogConfig[dialogState.current].lines[dialogState.index].speaker ? 'text-primary' :
                'text-warning'" >
                    {{ dialogConfig[dialogState.current].lines[dialogState.index].speaker }}:
                </span>
                {{ dialogConfig[dialogState.current].lines[dialogState.index].text }}
            </p>
            <div class="text-right mt-5 flex justify-center">
                <button class="btn btn-sm btn-primary" @click="nextDialog">Continuar</button>
            </div>
        </div>

        <!-- Quiz -->
        <div
            v-if="dialogState.showQuiz"
            class="absolute bottom-4 w-full p-4 bg-base-100 border border-primary rounded-lg shadow-lg text-sm font-sans text-left z-50"
        >
            <p class="mb-4 font-bold flex items-center">
                {{ currentQuestion.question }}
            </p>
            <div class="grid gap-2">
                <button
                    v-for="(opt, index) in currentQuestion.options"
                    :key="index"
                    class="btn btn-sm btn-outline hover:btn-warning"
                    @click="handleQuizAnswer(index)"
                >
                    {{ opt }}
                </button>
            </div>
        </div>

        <div v-if="getGameState().game.fasesConcluidas[2] === 3" class="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 z-50">
            <button class="btn btn-accent text-white font-press" @click="irParaFase4">
                Ir para Fase 4
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getGameState, updateGameState, ganharXP, addConquista, addItemToInventory } from '@/utils/gameState'
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/solid/index.js";

const router = useRouter()
const gameArea = ref(null)
const julioCanvas = ref(null)
const player = getGameState().player
const dialogState = ref({
    current: 'main', // 'main', 'quiz1', 'quiz2', etc
    index: 0,
    showDialog: false,
    showQuiz: false,
    questionsAwnsered: 0,
    status: true
})

const enableDialog = ref( dialogState.value.status)

const dialogConfig = {
    main: {
        lines: [
            {'speaker': 'Guardião da Lógica', 'text':
                    'Você chegou até aqui... isso já diz muito. Eu sou Marcos, CTO da AMZ e líder da DEVSquad.'},
            {'speaker': `${player.name}`, 'text': 'CTO... então você é o cara do código?'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Sou o cara das ideias que viram código. Mas aqui ninguém faz nada sozinho.'},
            {'speaker': `${player.name}`, 'text': 'Essa sala parece uma nave espacial.'},
            {'speaker': 'Marcos - Guardião da Lógica', text: 'Às vezes parece mesmo. Só que nossa missão é entregar resultado, não explorar galáxias. Ainda.'},
            {'speaker': `${player.name}`, 'text': 'O que é essa DEVSquad aí?'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'É o coração digital da AMZ. Front, back, devops, gestão... tudo pulsando junto.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Aqui, a gente constrói as ideias. Literalmente.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Transformamos criatividade em produto, dados em decisão, e bugs... em aprendizado.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Mas isso exige algo além de técnica...'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Exige raciocínio'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Capacidade de ver o invisível.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Vamos testar isso em você com um enigma.'},
        ],
        onComplete: () => {
            updateGameState({
                "player": { "vidas": 3 }
            })
            window.dispatchEvent(new Event('update-vidas'))
            startQuiz('quiz1')
        }
    },
    dialog2: {
        lines: [
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Boa! Você entendeu a lógica por trás da lógica. Isso vai te levar longe'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Tome — a última Orb é sua'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Atualizei o seu HeroLift. Use a tecla "E" para ver.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Agora, vá até a Sala do RH, a próxima fase começa là.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Tem algumas coisas para aprender la.'}
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []

            updateGameState({
                "player": {
                    "orbes": gameState.player.orbes + 1
                },
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 3],
                    "missaoAtual": "Vá para a Sala do RH"
                }
            })

            addItemToInventory('Orbe da Sinergia')
            addConquista('⚡ Sinergia é a essência do trabalho em equipe')
            showToast('🧿 Orbe Adquirida! - ', 'A sinergia da DEVSquad', 'conquista')
            window.dispatchEvent(new Event('update-missao'))
            addConquista('⚡ Sinergia')
            showToast('🏆 Conquista!', '‍🚀 Sinergia: Foguete não da ré', 'conquista')
            dialogState.value.status = false
        }
    },
    dialog3: {
        lines: [
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Hm... não foi dessa vez. Mas errar também é parte do processo criativo.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Volte aqui quando estiver pronto para tentar de novo.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Por ora, vá até a Sala do RH.'},
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Você ainda tem o que aprender com Marcos.'},
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []
            updateGameState({
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 3],
                    "missaoAtual": "Vá para a Sala do RH"
                }
            })
        }
    },
    dialog4: {
        lines: [
            {'speaker': 'Marcos - Guardião da Lógica', 'text': 'Sua jornada continua... Siga para a Sala do RH.'}
        ],
        onComplete: () => {
            window.dispatchEvent(new Event('update-missao'))
            dialogState.value.status = false
        }
    },
}

const quizConfig = {
    quiz1: {
        questions: [
            {
                question: "Três desenvolvedores precisam trabalhar juntos num projeto. Um sempre diz a verdade, um sempre mente, e um responde aleatoriamente.\n" +
                    "Você faz a seguinte pergunta para os três: ‘Se eu perguntasse se você é o mentiroso, o que você responderia?\n",
                options: [
                    "A) O que disser SIM está dizendo a verdade.",
                    "B) O que disser NÃO é o mentiroso",
                    "C) Todos dirão o mesmo, então não dá pra saber.",
                    "D) O que disser o oposto da pergunta está dizendo a verdade."
                ],
                answer: 0
            }
        ],
        onSuccess: () => {
            if (dialogState.value.questionsAwnsered == 0) {
                this.onFailure()
            } else {
                startDialog('dialog2')
            }
        },
        onFailure: () => {
            startDialog('dialog3')
        }
    },
}

function showToast(title, message, type = 'info', duration = 15000) {
    window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { title, message, type, duration }
    }))
}

function updateGameStateAndShowToast({ state, toast }) {
    updateGameState(state)
    showToast(toast.title, toast.message, toast.type)
}

function startDialog(dialogKey) {
    dialogState.value = {
        current: dialogKey,
        index: 0,
        showDialog: true,
        showQuiz: false
    }
    julio.value.idle = true
}

function nextDialog() {
    const currentDialog = dialogConfig[dialogState.value.current]

    if (dialogState.value.index < currentDialog.lines.length - 1) {
        dialogState.value.index++
    } else {
        dialogState.value.showDialog = false
        julio.value.idle = false
        currentDialog.onComplete?.()
    }
}

function startQuiz(quizKey) {
    dialogState.value = {
        current: quizKey,
        index: 0,
        showDialog: false,
        showQuiz: true,
        questionsAwnsered: 0
    }
}

const currentQuestion = computed(() => {
    const quiz = quizConfig[dialogState.value.current]
    return quiz?.questions[dialogState.value.index]
})

function handleQuizAnswer(selectedIndex) {
    const quiz = quizConfig[dialogState.value.current]
    const isCorrect = selectedIndex === currentQuestion.value.answer

    if (isCorrect) {
        if (dialogState.value.index < quiz.questions.length - 1) {
            dialogState.value.index++
            dialogState.value.questionsAwnsered++
        } else {
            dialogState.value.showQuiz = false
            dialogState.value.questionsAwnsered++
            quiz.onSuccess()
        }
    } else {
        const state = getGameState().player
        const novasVidas = (state.vidas || 3) - 1
        updateGameState({
            player: { vidas: novasVidas },
        })
        window.dispatchEvent(new Event('update-vidas'))

        if (novasVidas <= 0) {
            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { title: "☠️ Fim das tentativas!", message: "Você ficou sem corações.", type: 'gameover' }
            }))
            window.dispatchEvent(new Event('mostrar-game-over'))
            return
        }

        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { title: "❌", message: "Você perdeu 1 ❤️.", type: 'erro' }
        }))

        if (dialogState.value.index < quiz.questions.length - 1){
            dialogState.value.index++
        } else {
            startDialog('dialog3')
        }
    }
}

// Configuração do Bruno
const julio = ref({
    x: 400,
    y: 300,
    frame: 0,
    row: 3,
    direction: 1,
    idle: false,
    sprite: new Image(),
    loop: null
})

julio.value.sprite.src = '/assets/sprites/npcs/marcos/walk.png'

function drawJulio() {
    const ctx = julioCanvas.value?.getContext('2d')
    if (!ctx || !julio.value.sprite.complete) return
    ctx.clearRect(0, 0, 128, 128)

    const frameWidth = 64
    const frameHeight = 64
    const scale = 2
    const row = julio.value.row || 3

    ctx.save()
    ctx.scale(julio.value.direction, 1)
    const offsetX = julio.value.direction === -1 ? -frameWidth * scale : 0

    ctx.drawImage(
        julio.value.sprite,
        julio.value.frame * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        offsetX,
        0,
        frameWidth * scale,
        frameHeight * scale
    )

    ctx.restore()
}

function moveJulio() {
    if (julio.value.idle) return
    julio.value.x += julio.value.direction * 10
    if (julio.value.x > 400 || julio.value.x < 100) {
        julio.value.direction *= -1
        julio.value.row = julio.value.direction === 3 ? 1 : 3
    }
    julio.value.frame = (julio.value.frame + 1) % 4
    drawJulio()
}

function handlePlayerInteract(event) {
    const { x, y } = event.detail
    const distancia = Math.hypot(x - julio.value.x, y - julio.value.y)
    if (distancia < 100) {
        //startDialog('main')
        dialogState.value.status === true || enableDialog === true ? startDialog('main') : startDialog('dialog4')
    }
}

function irParaFase4() {
    router.push({ name: 'Preludio4' })
}

onMounted(() => {
    gameArea.value.focus()
    window.dispatchEvent(new Event('update-vidas'))

    if (getGameState().game.fasesConcluidas[2] === 3) {
        dialogState.value.status = false
    }

    julio.value.sprite.onload = () => {
        drawJulio()
        julio.value.loop = setInterval(moveJulio, 200)
    }
    window.addEventListener('player-interact', handlePlayerInteract)
})

onUnmounted(() => {
    clearInterval(julio.value.loop)
    dialogState.value.status = true
    enableDialog.value = true
    window.removeEventListener('player-interact', handlePlayerInteract)
})
</script>

<style scoped>
.font-press {
    font-family: 'Press Start 2P', monospace;
}
.font-sans {
    font-family: sans-serif;
}
[tabindex='0'] {
    outline: none;
}
</style>
