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

        <div v-if="getGameState().game.fasesConcluidas[1] === 2" class="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 z-50">
            <button class="btn btn-accent text-white font-press" @click="irParaFase3">
                Ir para Fase 3
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
            {'speaker': 'Arquiteto da Criação', 'text':
                    'Você deve ser o novo herói criativo. Eu sou Júlio, COO da AMZ e sobrevivente de incontáveis brainstorms.'},
            {'speaker': `${player.name}`, 'text': 'COO significa o quê mesmo?'},
            {'speaker': `${player.name}`, 'text': 'Você parece bem calmo pra alguém rodeado de caos...'},
            {'speaker': `${player.name}`, 'text': 'Isso aqui é um templo ou um campo de batalha?'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Tudo isso. Aqui, a criatividade é caos e ordem ao mesmo tempo.'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'É onde ideias tomam forma... ou viram lixo antes do deadline.'},
            {'speaker': 'Júlio - Arquiteto da Criação', text: 'Criação, design, texto, atendimento, revisão... '},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Cada parte tem um papel vital na engrenagem da AMZ.'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Você precisa entender isso se quiser avançar.'},
            {'speaker': `${player.name}`, 'text': 'Dá pra pular essa parte?'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Não dá. Criatividade não se pula. Ela se vive. E agora... um desafio.'},
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
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Show! Você entendeu.'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Criação não é só estética ou técnica. '},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'É sobre entender o papel de cada um e saber colaborar'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Agora, vá até a Sala da DEVSquad.'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Lá você vai conhecer Marcos, nosso CTO.'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Ele vai testar algo mais... lógico.'}
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []

            updateGameState({
                "player": {
                    "orbes": gameState.player.orbes + 1
                },
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 2],
                    "missaoAtual": "Vá para a Sala da DEVSquad"
                }
            })

            addItemToInventory({
                id: 2,
                name: 'Orbe da Criação',
                description: 'Simboliza a criatividade e inovação, incentivando o pensamento fora da caixa para criações impactantes.',
                sprite: 'criacao.png'
            })
            addConquista('A Criação do Arquiteto')
            showToast('🧿 Orbe Adquirida! - ', 'A Criação do Arquiteto', 'conquista')
            window.dispatchEvent(new Event('update-missao'))
            addConquista('🌱 A Criação')
            showToast('🏆 Conquista!', '🌱 A Criação', 'conquista')
            dialogState.value.status = false
        }
    },
    dialog3: {
        lines: [
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Hm... não foi dessa vez. Mas errar também é parte do processo criativo.'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Volte aqui quando estiver pronto para tentar de novo.'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Por ora, vá até a Sala da DEVSquad.'},
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Você ainda tem o que aprender com Marcos.'},
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []
            updateGameState({
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 2],
                    "missaoAtual": "Vá para a Sala da DEVSquad"
                }
            })
            dialogState.value.status = false
        }
    },
    dialog4: {
        lines: [
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Não desista... Siga para a Sala da DEVSquad.'}
        ],
        onComplete: () => {
            window.dispatchEvent(new Event('update-missao'))
            dialogState.value.status = false
        }
    },
    dialog5: {
        lines: [
            {'speaker': 'Júlio - Arquiteto da Criação', 'text': 'Pense bem, tente novamente.'}
        ],
        onComplete: () => {
            let num = Math.floor(Math.random() * 4)
            switch (num) {
                case 0:
                    startQuiz('quiz2')
                    break;
                case 1:
                    startQuiz('quiz3')
                    break;
                case 2:
                    startQuiz('quiz4')
                    break;
                case 3:
                    startQuiz('quiz5')
                    break;
            }
        }
    },
}

const quizConfig = {
    quiz1: {
        questions: [
            {
                question: "Qual dessas áreas transforma um conceito em algo visual que comunica sem dizer uma palavra?",
                options: [
                    "A) Redação",
                    "B) Designer",
                    "C) Revisão",
                    "D) Atendimento"
                ],
                answer: 1
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
            startDialog('dialog5')
        }
    },
    quiz2: {
        questions: [
            {
                question: "Quem é o guardião da clareza, responsável por garantir que nada passe com erro?",
                options: [
                    "A) Designer",
                    "B) Revisão",
                    "C) Atendimento",
                    "D) Redação"
                ],
                answer: 1
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
            startDialog('dialog5')
        }
    },
    quiz3: {
        questions: [
            {
                question: "Qual setor traduz emoções em palavras, criando a alma da campanha?",
                options: [
                    "A) Designer",
                    "B) Criação",
                    "C) Redação",
                    "D) Atendimento"
                ],
                answer: 2
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
            startDialog('dialog5')
        }
    },
    quiz4: {
        questions: [
            {
                question: "Quem entende o cliente, traduz o briefing e acalma crises como um diplomata criativo?",
                options: [
                    "A) Revisão",
                    "B) Designer",
                    "C) Atendimento",
                    "D) Redação"
                ],
                answer: 2
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
            startDialog('dialog5')
        }
    },
    quiz5: {
        questions: [
            {
                question: "Qual função conecta todas as outras, costura ideias, organiza talentos e constrói impacto?",
                options: [
                    "A) Designer",
                    "B) Criação",
                    "C) COO",
                    "D) Redação"
                ],
                answer: 1
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
            startDialog('dialog5')
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
        dialogState.value.showQuiz = false
        startDialog('dialog5')

        if (novasVidas <= 0) {
            if (dialogState.value.index < quiz.questions.length - 1){
                dialogState.value.index++
            } else {
                startDialog('dialog3')
            }
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

julio.value.sprite.src = '/assets/sprites/npcs/julio/walk.png'

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

function irParaFase3() {
    router.push({ name: 'Preludio3' })
}

onMounted(() => {
    gameArea.value.focus()
    window.dispatchEvent(new Event('update-vidas'))

    if (getGameState().game.fasesConcluidas[1] === 2) {
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
