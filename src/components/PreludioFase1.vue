<script setup>
import { ref} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameArea = ref(null)

function startGame() {
    router.push('/fase1')
}
</script>


<template>
    <div
        ref="gameArea"
        tabindex="0"
        class="relative rounded-xl overflow-hidden w-full h-full bg-black/70 flex flex-col text-center gap-4 relative"
        style="background: url('/assets/images/bg1.png') center/cover"
    >
        <div class="w-full bg-base-100 py-3 space-y-2 mb-10">
            <p class="text-sm text-white">
                Início da Jornada:
            </p>
            <h1 class="text-4xl font-bold leading-[1.2] text-secondary">
                 O Chamado do Fundador
            </h1>
        </div>
        <div class="flex flex-col items-center justify-center bg-black/50 py-4">
            <p class="text-md leading-7 text-white mb-4 px-10 text-justify">
                Você desperta dentro da agência AMZ após um blackout criativo global.
            </p>
            <p class="text-md leading-7 text-white mb-4 px-10 text-justify">
                O ambiente é um escritório moderno com áreas quebradas por overwork, frases motivacionais em neon piscando, e um leve aroma de café pairando no ar.
            </p>
            <div class="flex itens-center justify-center w-full gap-4 my-4 px-6">
                <button class="btn btn-success btn-wide pulse" @click="startGame()">Começar</button>
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