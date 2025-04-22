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

        <div v-if="getGameState().game.fasesConcluidas[3] === 4" class="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 z-50">
            <button class="btn btn-accent text-white font-press" @click="irParaFinal">
                Continuar
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getGameState, updateGameState, ganharXP, addConquista, } from '@/utils/gameState'

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
const finalState = ref(null)

const enableDialog = ref( dialogState.value.status)

const dialogConfig = {
    main: {
        lines: [
            {'speaker': 'A Guardiã das Pessoas', 'text': 'Uau... você tem as três orbs. Isso é incrível! Sabe o que isso significa, né?'},
            {'speaker': `${player.name}`, 'text': 'O que???'},
            {'speaker': 'Ana - Guardiã das Pessoas', text:
                    'Você foi o escolhido. Alguém que tem o equilíbrio entre conhecimento, criatividade e lógica. Bem-vindo ao time AMZ.'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'Essas orbs representam algo maior... '},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'São as virtudes que moldaram a AMZ nesses 17 anos'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'E agora, estão com você.'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'Hoje comemoramos 17 anos de história.'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'Mas o futuro... começa agora, com a sua chegada.'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'Temos um ultimo desafio.'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'Com isso vamos saber se vocé realmente conhece a AMZ.'},
        ],
        onComplete: () => {
            updateGameState({
                "player": { "vidas": 3 }
            })
            window.dispatchEvent(new Event('update-vidas'))
            startQuiz('quiz1')
        }
    },
    main2: {
        lines: [
            {'speaker': 'Ana - Guardiã das Pessoas', 'text':
                    'Você chegou longe. As orbs que carrega mostram que aprendeu — em parte — o que buscamos.'},
            {'speaker': 'Ana - Guardiã das Pessoas', text:
                    'Mas cada orb representa uma dimensão vital: criatividade, lógica e essência. Faltando uma, o equilíbrio se quebra.'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'Fique. Aprenda conosco. Você ainda tem o que descobrir.'}
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []

            updateGameState({
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 4],
                }
            })

            addConquista('🤔 Ainda falta alguma coisa...')
            showToast('🏆 Conquista!', '🤔 Ainda falta alguma coisa...', 'conquista')
            dialogState.value.status = false
        }
    },
    main3: {
        lines: [
            {'speaker': 'Ana - Guardiã das Pessoas', text: 'Hmm... Vejo que chegou até aqui, mas ainda sem carregar nenhuma das orbs.'},
            {'speaker': 'Ana - Guardiã das Pessoas', text:
                    'Você tem potencial — sem dúvida — mas sua jornada ainda não está completa'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'As orbs representam quem você precisa se tornar, não apenas onde você precisa chegar.'},
            {'speaker': 'Ana - Guardiã das Pessoas', 'text': 'Volte. Explore. Construa. A AMZ espera por quem caminha com propósito.'}
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []

            updateGameState({
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 4],
                }
            })

            addConquista('😕 O Fim???')
            showToast('🏆 Conquista!', '😕 O Fim???', 'conquista')
            dialogState.value.status = false

        }
    },
    dialog2: {
        lines: [
            {'speaker': 'Ana - Guardiã das Pessoas', 'text':
                    'Empatia, propósito e colaboração. Exatamente! É isso que move a AMZ. E é isso que vai nos levar ainda mais longe.'}
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []

            updateGameState({
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 4],
                }
            })

            addConquista('🎉 Desafio Final')
            showToast('🏆 Conquista!', '🎉 Desafio Final', 'conquista')
            dialogState.value.status = false
        }
    },
    dialog3: {
        lines: [
            {'speaker': 'Ana - Guardiã das Pessoas', 'text':
                    'Conhecimento técnico e habilidade. Importante, mas sem propósito... perde a direção.'}
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []

            updateGameState({
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 4],
                }
            })

            addConquista('🎉 Desafio Final')
            showToast('🏆 Conquista!', '🎉 Desafio Final', 'conquista')
            dialogState.value.status = false
        }
    },
    dialog4: {
        lines: [
            {'speaker': 'Ana - Guardiã das Pessoas', 'text':
                    'Criatividade e inovação constante. Essencial, mas se não for compartilhada, se perde.'},
        ],
        onComplete: () => {
            const gameState = getGameState()
            const fasesConcluidas = gameState.game.fasesConcluidas || []

            updateGameState({
                "game": {
                    "fasesConcluidas": [...fasesConcluidas, 4],
                }
            })

            addConquista('🎉 Desafio Final')
            showToast('🏆 Conquista!', '🎉 Desafio Final', 'conquista')
            dialogState.value.status = false
        }
    },
    dialog5: {
        lines: [
            {'speaker': 'Ana - Guardiã das Pessoas', 'text':
                    'Obrigada por trilhar essa jornada. Agora você é parte da nossa história. Seja bem-vindo à AMZ.'},
        ],
        onComplete: () => {
            dialogState.value.status = false
        }
    }
}

const quizConfig = {
    quiz1: {
        questions: [
            {
                question: "O que você acredita ser mais importante para transformar o mundo ao seu redor?",
                options: [
                    "A) Conhecimento técnico e habilidade.",
                    "B) Criatividade e inovação constante",
                    "C) Empatia, propósito e colaboração",
                ]
            }
        ]
    }
}

function showToast(title, message, type = 'info', duration = 15000) {
    window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { title, message, type, duration }
    }))
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

    switch (selectedIndex) {
        case 0:
            finalState.value = "mostrar-game-final2"
            startDialog('dialog3')
            break
        case 1:
            finalState.value = "mostrar-game-final2"
            startDialog('dialog4')
            break
        case 2:
            finalState.value = "mostrar-game-final1"
            startDialog('dialog2')
            break
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

julio.value.sprite.src = '/assets/sprites/npcs/ana/walk.png'

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
        if (dialogState.value.status === true || enableDialog === true){
            switch (player.orbes) {
                case 0:
                    startDialog('main3')
                    break
                case 1:
                    startDialog('main2')
                    break
                case 2:
                    startDialog('main2')
                    break
                case 3:
                    startDialog('main')
                    break
            }
        } else {
            startDialog('dialog5')
        }
    }
}

function irParaFinal() {
    if (finalState.value === "mostrar-game-final1") {
        window.dispatchEvent(new Event('mostrar-game-final1'))
        return
    }

    window.dispatchEvent(new Event('mostrar-game-final2'))
}

onMounted(() => {
    gameArea.value.focus()
    window.dispatchEvent(new Event('update-vidas'))

    if (getGameState().game.fasesConcluidas[3] === 4) {
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
