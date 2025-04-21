<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameArea = ref(null)

function startGame() {
    router.push('/fase2')
}
</script>


<template>
    <div
        ref="gameArea"
        tabindex="0"
        class="relative rounded-xl overflow-hidden w-full h-full bg-black/70 flex flex-col text-center gap-4 relative"
        style="background: url('/assets/images/bg2.png') center/cover"
    >
        <div class="w-full bg-base-100 py-3 space-y-2 mb-10">
            <p class="text-sm text-white">
                Enigma da Inovação:
            </p>
            <h1 class="text-4xl font-bold leading-[1.2] text-primary">
                O Arquiteto da Criação
            </h1>
        </div>
        <div class="flex flex-col items-center justify-center bg-black/80 py-4">
            <p class="text-md leading-7 text-white mb-4 px-10 text-justify">
                Após o encontro com Bruno, o Herolift leva você até a Sala de Criação
            </p>
            <p class="text-md leading-7 text-white mb-4 px-10 text-justify">
                Um espaço vibrante, com mesas bagunçadas, telas cheias de layouts em construção, textos riscados e rascunhos de ideias espalhadas no chão.
                No centro da sala, um quadro branco luminoso em espiral revela a presença de Júlio.
            </p>
            <div class="flex itens-center justify-center w-full gap-4 my-4 px-6">
                <button class="btn btn-secondary btn-wide pulse" @click="startGame()">Começar</button>
            </div>

        </div>

    </div>
</template>

<style scoped>
.pulse {
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>