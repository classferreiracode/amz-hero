<template>
    <div v-if="visible" class="fixed inset-0 bg-neutral/70 z-50 flex items-center justify-center">
        <div class="shadow bg-primary p-6 rounded-lg shadow-xl w-1/2 text-center">
            <img src="/assets/images/logo-herolift.png" alt="Logo HeroLift" class="mx-auto mb-4 w-92">
<!--            <h2 class="text-xl font-bold mb-8 flex items-center justify-center gap-2">-->
<!--                <PlayCircleIcon class="w-8 h-8 inline-block" /> HeroLift-->
<!--            </h2>-->

            <p class="text-sm mb-4"><RocketLaunchIcon class="w-4 h-4 inline-block" /> Missões Ativas:</p>
            <ul class="menu bg-base-200 hover:bg-base-300 w-full rounded-box mb-12 flex flex-col">
                <li>
                   <span class="flex gap-2 items-center justify-center">
                    <MapPinIcon class="w-8 h-8 inline-block text-warning" /> {{ jobs }}
                   </span>
                </li>
            </ul>

            <p class="text-sm mb-4"><BriefcaseIcon class="w-4 h-4 inline-block" /> Inventário:</p>
            <ul class="menu bg-base-200 hover:bg-base-300 w-full rounded-box mb-12 flex flex-col">

                    <li>
                       <span v-for="item in inventario" class="flex gap-2 items-center justify-center">
                           <div class="tooltip flex gap-2 items-center justify-center" :data-tip="item.description" >
                                <img :src="'/assets/objects/orbes/' + item.sprite" class="w-8 h-8 inline-block">
                                {{ item.name }}
                            </div>
                       </span>
                    </li>

            </ul>

            <!-- 🎵 CONTROLES DE MÚSICA -->
            <p class="text-sm mb-4"><MusicalNoteIcon class="w-4 h-4 inline-block" /> Playlist:</p>
            <div class="text-left text-sm bg-base-300 rounded-md p-3 mb-4">
                <div>
                    <p class="font-bold text-secondary text-xs mb-1">Música Atual:</p>
                    <p class="text-xs">{{ playlist[currentIndex].title }}</p>
                </div>

                <div class="flex items-center mt-2 gap-5">
                    <button class="btn btn-primary btn-circle btn-sm" @click="togglePlay">
                        <template v-if="playing">
                            <PauseIcon class="w-4 h-4 inline-block" />
                        </template>
                        <template v-else>
                            <PlayIcon class="w-4 h-4 inline-block" />
                        </template>
                    </button>
                    <button class="btn btn-circle btn-sm btn-secondary " @click="nextTrack">
                        <ForwardIcon class="w-4 h-4 inline-block" />
                    </button>
                </div>

<!--                <div class="flex items-center mt-2 gap-5">-->
<!--                    <label class="label mt-3 ">-->
<!--                      <span class="label-text flex items-center">-->
<!--                        Volume:-->
<!--                      </span>-->
<!--                    </label>-->
<!--                    <input-->
<!--                        type="range"-->
<!--                        min="0"-->
<!--                        max="1"-->
<!--                        step="0.01"-->
<!--                        :value="volume"-->
<!--                        @input="e => setVolume(parseFloat(e.target.value))"-->
<!--                        class="range range-accent"-->
<!--                    />-->
<!--                </div>-->
            </div>

         <button class="btn btn-error mt-2" @click="fechar">Fechar (ESC)</button>
        </div>
    </div>
</template>


<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useMusic } from '@/composables/useMusic'
import { getGameState } from '@/utils/gameState'
import { MusicalNoteIcon, PlayIcon, PauseIcon, ForwardIcon, MapPinIcon, RocketLaunchIcon, BriefcaseIcon } from '@heroicons/vue/24/solid'

const {
    playlist,
    currentIndex,
    isPlaying,
    volume,
    togglePlay,
    nextTrack,
    setVolume
} = useMusic()

window.addEventListener('play', abrir)
const jobs = ref(getGameState().game.missaoAtual)
const inventario = ref(getGameState().player.inventario)
const playing = ref(getGameState().audio.isPlaying)

window.addEventListener('update-missao', updateMissao)
function updateMissao() {
    jobs.value = getGameState().game.missaoAtual
}

window.addEventListener('update-inventario', updateInventario)
function updateInventario() {
    inventario.value = getGameState().player.inventario
}


const visible = ref(false)

function abrir() {
    visible.value = true
    new Audio('/assets/audio/fx/open-herolift.mp3').play().catch(() => {})
}

function fechar() {
    visible.value = false
    new Audio('/assets/audio/fx/close-herolift.mp3').play().catch(() => {})
}

window.addEventListener('open-hero-lift', abrir)

function toggleHeroLift(e) {
    if (!getGameState().player.hasHeroLift)
        return

    if (e.key === 'e' || e.key === 'E') {
        if (visible.value) {
            fechar()
        } else {
            abrir()
        }
    }
    if (e.key === 'Escape') {
        fechar()
    }
}

onMounted(() => {
    window.addEventListener('keydown', toggleHeroLift)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', toggleHeroLift)
})
</script>

