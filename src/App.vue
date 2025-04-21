<template>
    <div class="w-screen h-[100vh] bg-black/90 flex flex-col items-center justify-center gap-4 pb-12">
        <CommandBox v-if="isFase" />
        <div class="relative" style="width: 640px; height: 640px;">
            <GameOverOverlay />
            <GameFinal1 />
            <GameFinal2 />
            <div class="relative top-12 left-6 z-50 flex gap-1" v-if="isFase && vidas > 0">
                <span v-for="n in vidas" :key="n" class="text-xl">
                    <HeartIcon class="w-6 h-6 text-red-500" />
                </span>
            </div>
            <GameToaster />
            <router-view />
            <HeroLift />
            <PlayerController v-if="isFase" />
        </div>
        <div class="fixed bottom-4 w-1/2 text-xs text-white flex justify-between items-start">
            <p>GameDev: Wagner Ferreira</p>
            <p>Roteiro: Renan Ferreira</p>
        </div>
    </div>
</template>

<script setup>
import HeroLift from '@/components/HeroLift.vue'
import GameToaster from '@/components/GameToaster.vue'
import PlayerController from '@/components/PlayerController.vue'
import GameOverOverlay from '@/components/GameOverOverlay.vue'
import GameFinal1 from "@/components/GameFinal1.vue";
import GameFinal2 from "@/components/GameFinal2.vue";
import CommandBox from '@/components/CommandBox.vue'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { getGameState, resetGameState } from '@/utils/gameState'
import { HeartIcon} from '@heroicons/vue/24/solid'

const route = useRoute()
const isFase = computed(() => route.path.startsWith('/fase'))
const isPreludio = computed(() => route.path.startsWith('/preludio'))
const isHome = computed(() => route.path === '/')
const vidas = ref(getGameState().player.vidas)

watch([isFase, isPreludio, isHome], () => {
    if (isHome.value) {
        resetGameState()
    } else if (!isFase.value && !isPreludio.value) {
        resetGameState()
    }

    window.addEventListener('update-vidas', () => {
        vidas.value = getGameState().player.vidas
    })
})
</script>
  