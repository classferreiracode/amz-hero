<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameArea = ref(null)

function startGame() {
    router.push('/fasefinal')
}
</script>


<template>
    <div
        ref="gameArea"
        tabindex="0"
        class="relative rounded-xl overflow-hidden w-full h-full bg-black/70 flex flex-col text-center gap-4 relative"
        style="background: url('/assets/images/bg4.png') center/cover"
    >
        <div class="w-full bg-base-100 py-3 space-y-2 mb-10">
            <p class="text-sm text-white">
                O Reconhecimento:
            </p>
            <h1 class="text-4xl font-bold leading-[1.2] text-accent">
                A Guardiã das Pessoas
            </h1>
        </div>
        <div class="flex flex-col items-center justify-center bg-black/80 py-4">
            <p class="text-md leading-7 text-white mb-4 px-10 text-justify">
                Ana lhe recebe com surpresa e alegria, revelando que há muito tempo esperavam alguém com essas qualidades.
            </p>
            <p class="text-md leading-7 text-white mb-4 px-10 text-justify">
                Ela fala com sabedoria sobre os 17 anos da AMZ, reforçando a importância da cultura, das pessoas e do propósito.
            </p>
            <div class="flex itens-center justify-center w-full gap-4 my-4 px-6">
                <button class="btn btn-error btn-wide pulse" @click="startGame()">Começar</button>
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