<template>
    <div
        ref="gameArea"
        tabindex="0"
        class="relative w-full h-full"
        style="background: url('/assets/maps/bg.png') center/cover"
    >

        <!-- Canvas para renderizar NPC -->
        <canvas ref="brunoCanvas" class="absolute z-40" width="128" height="128" :style="{ left: bruno.x + 'px', top: bruno.y + 'px',
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
            class="absolute bottom-4 w-full p-4 bg-base-100 border border-primary rounded-lg shadow-lg text-sm font-sans text-left "
        >
            <p class="mb-4 font-bold flex items-center">
                <QuestionMarkCircleIcon class="w-12 h-12 inline mr-2 text-red-500" />
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

        <div v-if="getGameState().game.fasesConcluidas[0] === 1" class="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 z-50">
            <button class="btn btn-accent text-white font-press" @click="irParaFase2">
                Ir para Fase 2
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
const brunoCanvas = ref(null)
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
            {'speaker': 'O Fundador', 'text': 'Ah... Então você finalmente chegou. Estava te esperando.'},
            {'speaker': `${player.name}`, 'text': 'Quem é você? Onde estou?'},
            {'speaker': `${player.name}`, 'text': 'Isso aqui é uma entrevista?'},
            {'speaker': `${player.name}`, 'text': 'E esse cheiro de Café queimado?'},
            {'speaker': 'O Fundador', 'text': 'Sou Bruno. Fundador da AMZ.'},
            {'speaker': 'Bruno - O Fundador', 'text':
                    'Antes de tudo isso, ajudei a criar magia na Disney e contei histórias em outra agência de comunicação.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Mas nada se compara ao que estamos construindo aqui.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'E isso? Não é uma entrevista — é o início de algo muito maior.'},
            {'speaker': `${player.name}`, 'text': 'Maior tipo... uma promoção?'},
            {'speaker': `${player.name}`, 'text': 'Tipo startup que vira unicórnio?'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Maior tipo... Heróis. Missões. Propósito. Propaganda com alma. Algo que nem todo briefing entende.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Afinal ser ruim é fácil, difícil é ser bom!'},
            {'speaker': 'Bruno - O Fundador', 'text': 'A AMZ nasceu no caos, sim — mas também de um ato de coragem.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'No dia do meu aniversário, pedi demissão da agência onde trabalhava.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Senti, no fundo, que podia fazer diferente. Melhor!'},
            {'speaker': 'Bruno - O Fundador', 'text': 'E assim, a AMZ nasceu.'},
            {'speaker': 'Bruno - O Fundador', 'text':
                    'Criada por idealistas que acreditavam que criatividade era mais do que apenas entregar um job aprovado.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Era sobre fazer sentido. E fazer história.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Nós enfrentamos o algoritmo. Desafiamos o orçamento.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Transformamos brainstorms em batalhas, deadlines em lendas.'},
            {'speaker': `${player.name}`, 'text': 'E o que isso tem a ver comigo?'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Tudo...'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Porque agora, a agência precisa de um novo tipo de criativo. Um herói. E pra isso... você vai precisar disso aqui.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Esse é o HeroLift'},
            {'speaker': `${player.name}`, 'text': 'HeroLift???'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Um sistema sagrado que conecta você a tudo que a AMZ representa: ideias, missões, música e propósito'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Use com sabedoria. Ou com coragem. Ou com café.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Mas antes...'},
            {'speaker': `${player.name}`, 'text': 'O que???'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Preciso saber se você é digno.'},
            {'speaker': `${player.name}`, 'text': 'Como assim???'},
            {'speaker': 'Bruno - O Fundador', 'text': 'É só um... pequeno quiz.'},
        ],
        onComplete: () => {
            updateGameState({
                "player": { "vidas": 3 }
            })
            addConquista('❤️ Agora sim dá pra apanhar com estilo: Ganhou 3 Corações!')
            window.dispatchEvent(new Event('update-vidas'))
            showToast('🏆 Conquista!', '❤️ Agora sim dá pra apanhar com estilo: Ganhou 3 Corações!', 'conquista')
            startQuiz('quiz1')
        }
    },
    dialog2: {
        lines: [
            {'speaker': 'Bruno - O Fundador', 'text': 'Você tem o espírito. Não perfeito. Mas é assim que começamos todos.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'O HeroLift agora é seu. Use a tecla E para abri-lo.'},
            {'speaker': `${player.name}`, 'text': 'Incrível!'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Vou adicionar sua primeira tarefa. Use a tecla "E" para ver.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Agora, vá até a Sala de Criação, a próxima fase começa lá!'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Boa sorte!'}
        ],
        onComplete: () => {
            updateGameState({
                "player": {
                    "hasHeroLift": true,
                },
                "game": {
                    "fasesConcluidas": [1],
                    "hasHeroLift": true,
                    "missaoAtual": "Vá para a Sala de Criação",
                }
            })
            window.dispatchEvent(new Event('has-hero-lift'))
            window.dispatchEvent(new Event('update-missao'))
            addConquista('📲 Sistema Liberado!')
            showToast('🏆 Conquista!', '📲 Sistema Liberado! ...So não deixa a TI saber!', 'conquista')
            dialogState.value.status = false
        }
    },
    dialog3: {
        lines: [
            {'speaker': 'Bruno - O Fundador', 'text': 'Uau... Você acertou todas.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Isso não é comum. Normalmente o pessoal trava na do brainstorm.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Antes de te entregar isso... preciso saber se você está realmente pronto'},
            {'speaker': `${player.name}`, 'text': 'Pronto?! para o que?'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Essa pergunta não é sobre marketing'},
            {'speaker': 'Bruno - O Fundador', 'text': 'É sobre você...'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Sobre todos nós.'}
        ],
        onComplete: () => {
            addConquista('🔭 Foco e Afinco')
            showToast('🏆 Conquista!', '🔭 Foco e Afinco', 'conquista')
            startQuiz('quiz2')
        }
    },
    dialog4: {
        lines: [
            {'speaker': 'Bruno - O Fundador', 'text': 'Correto. A criatividade nasce do caos, da tentativa e do erro. E da vontade de continuar mesmo quando ninguém entende sua ideia.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Você merece isso..'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Siga para a Sala de Criação. Sua jornada continua...'}
        ],
        onComplete: () => {
            updateGameState({
                "player": {
                    "hasHeroLift": true,
                    "orbes": 1
                },
                "game": {
                    "fasesConcluidas": [1],
                    "missaoAtual": "Vá para a Sala de Criação",
                }
            })
            window.dispatchEvent(new Event('update-missao'))
            window.dispatchEvent(new Event('has-hero-lift'))
            addItemToInventory({
                id: '1',
                name: 'Orbe da Eloquência',
                description: 'Representa a comunicação eficaz, a clareza na transmissão de ideias e a capacidade de envolver tanto clientes quanto a equipe.',
                sprite: 'eloquencia.png'
            })
            addConquista('🧿 Orbe Adquirida! - A Eloquência do Fundador')
            showToast('🏆 Conquista!', '🧿 Orbe Adquirida! - A Eloquência do Fundador', 'conquista')
            dialogState.value.status = false
        }
    },
    dialog5: {
        lines: [
            {'speaker': 'Bruno - O Fundador', 'text': 'Interessante escolha... mas talvez ainda falte algo. Você está no caminho certo.'},
            {'speaker': 'Bruno - O Fundador', 'text': 'Siga para a Sala de Criação. Talvez lá encontre o que falta.'}
        ],
        onComplete: () => {
            updateGameState({
                "game": {
                    "fasesConcluidas": [1],
                    "missaoAtual": "Vá para a Sala de Criação"
                }
            })
            window.dispatchEvent(new Event('update-missao'))
            addConquista('🧩 Quase tudo certo')
            showToast('🏆 Conquista!', '🧩 Quase tudo certo', 'conquista')
            dialogState.value.status = false
        }
    },
    dialog6: {
        lines: [
            {'speaker': 'Bruno - O Fundador', 'text': 'Sua jornada continua... Siga para a Sala de Criação.'}
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
                question: "Se o prazo é amanhã e o job ainda não está aprovado, você...",
                options: ["A) Pede mais prazo", "B) Muda tudo de novo", "C) Entra no modo guerra e resolve"],
                answer: 2
            },
            {
                question: "O que é mais importante?",
                options: ["A) Engajamento", "B) Propósito", "C) Um bom Café"],
                answer: 1
            },
            {
                question: "Qual o verdadeiro significado de um brainstorm?",
                options: ["A) Uma tempestade de ideias com café no meio", "B) Um momento onde todo mundo fala ao mesmo tempo",
                    "C) Quando a criatividade se junta com o caos e vira mágica"],
                answer: 2
            }
        ],
        onSuccess: () => {
            if (dialogState.value.questionsAwnsered == 0) {
                this.onFailure()
            }else if (dialogState.value.questionsAwnsered > 0 && dialogState.value.questionsAwnsered < 3) {
                startDialog('dialog2')
            }else {
                ganharXP(150)
                updateGameStateAndShowToast({
                    state: {"player": {"hasHeroLift": true}},
                    toast: {
                        title: "😍 Amazing!",
                        message: "+150 XP",
                        type: 'info'
                    }
                })
                startDialog('dialog3')
            }
        },
        onFailure: () => {
            alert('falhou')
        }
    },
    quiz2: {
        questions: [
            {
                question: "O que torna alguém verdadeiramente criativo?",
                options: ["A)A capacidade de copiar com estilo", "B)A coragem de errar e tentar de novo", "C)A busca incessante pela aprovação alheia"],
                answer: 1
            }
        ],
        onSuccess: () => {
            ganharXP(200)
            updateGameStateAndShowToast({
                state: {
                    "player": { "hasHeroLift": true },
                },
                toast: {
                    title: "😍 Amazing!",
                    message: "+200 XP"
                }
            })
            startDialog('dialog4')
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
    bruno.value.idle = true
}

function nextDialog() {
    const currentDialog = dialogConfig[dialogState.value.current]

    if (dialogState.value.index < currentDialog.lines.length - 1) {
        dialogState.value.index++
    } else {
        dialogState.value.showDialog = false
        bruno.value.idle = false
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
            startDialog('dialog2')
        }
    }
}

// Configuração do Bruno
const bruno = ref({
    x: 400,
    y: 300,
    frame: 0,
    row: 11,
    direction: 1,
    idle: false,
    sprite: new Image(),
    loop: null
})

bruno.value.sprite.src = '/assets/sprites/npcs/bruno/NPC_Bruno.png'

// Funções de renderização do Bruno
function drawBruno() {
    const ctx = brunoCanvas.value?.getContext('2d')
    if (!ctx || !bruno.value.sprite.complete) return

    const frameWidth = 64
    const frameHeight = 65
    const scale = 2

    ctx.clearRect(0, 0, 128, 128)
    ctx.save()
    ctx.scale(bruno.value.direction, 1)

    const offsetX = bruno.value.direction === -1 ? -frameWidth * scale : 0

    ctx.drawImage(
        bruno.value.sprite,
        bruno.value.frame * frameWidth,
        bruno.value.row * frameHeight,
        frameWidth,
        frameHeight,
        offsetX,
        0,
        frameWidth * scale,
        frameHeight * scale
    )

    ctx.restore()
}

function moveBruno() {
    if (bruno.value.idle) return

    bruno.value.x += bruno.value.direction * 10
    if (bruno.value.x > 400 || bruno.value.x < 100) {
        bruno.value.direction *= -1
        bruno.value.row = bruno.value.direction === 11 ? 9 : 11
    }
    bruno.value.frame = (bruno.value.frame + 1) % 4
    drawBruno()
}

function handlePlayerInteract(event) {
    const { x, y } = event.detail
    const distancia = Math.hypot(x - bruno.value.x, y - bruno.value.y)
    if (distancia < 100) {
        dialogState.value.status === true || enableDialog === true ? startDialog('main') : startDialog('dialog6')
    }
}

function irParaFase2() {
    router.push({ name: 'Preludio2' })
}

onMounted(() => {
    gameArea.value.focus()
    window.dispatchEvent(new Event('update-vidas'))

    if (getGameState().game.fasesConcluidas[0] === 1) {
        dialogState.value.status = false
    }

    bruno.value.sprite.onload = () => {
        drawBruno()
        bruno.value.loop = setInterval(moveBruno, 200)
    }
    window.addEventListener('player-interact', handlePlayerInteract)
})

onUnmounted(() => {
    clearInterval(bruno.value.loop)
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
