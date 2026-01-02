<template>
    <div class="fixed top-24 right-4 z-[9998] w-64 space-y-3">
        <div class="flex items-center justify-between text-xs text-white">
            <span class="font-bold text-primary">Habilidades</span>
            <span class="badge badge-sm badge-outline">{{ totalPontos }} pts</span>
        </div>
        <div class="space-y-2">
            <div
                v-for="skill in skills"
                :key="skill.id"
                class="bg-base-200 bg-opacity-60 border border-base-300 p-3 rounded-lg shadow flex items-center gap-3"
            >
                <div class="relative">
                    <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {{ skill.hotkey?.toUpperCase() }}
                    </div>
                    <div v-if="skill.onCooldown" class="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-[10px] text-white">
                        {{ skill.tempoRestante }}s
                    </div>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between text-sm">
                        <p class="font-semibold text-white">{{ skill.name }}</p>
                        <span class="badge badge-xs" :class="raridadeClass(skill.rarity)">{{ skill.rarity }}</span>
                    </div>
                    <p class="text-[11px] text-gray-200 truncate" :title="skill.effect">{{ skill.effect }}</p>
                    <p class="text-[10px] text-gray-300">Pontos: {{ skill.points }}</p>
                </div>
            </div>
            <p v-if="skills.length === 0" class="text-[11px] text-gray-300 text-center">Colete itens para desbloquear habilidades.</p>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getSkillsState } from '@/utils/gameState'

const skills = ref([])
const totalPontos = computed(() => getSkillsState().pontos || 0)
let intervalId

function raridadeClass(rarity) {
    switch (rarity) {
    case 'épico':
        return 'badge-secondary'
    case 'raro':
        return 'badge-accent'
    case 'lendário':
        return 'badge-warning'
    default:
        return 'badge-ghost'
    }
}

function calcularSkills() {
    const state = getSkillsState()
    const progresso = state.progresso || {}
    const agora = Date.now()
    const formatted = Object.values(state.catalogo || {}).map((skill) => {
        const track = progresso[skill.id] || {}
        const tempoRestante = track.cooldownAte ? Math.max(0, Math.ceil((track.cooldownAte - agora) / 1000)) : 0
        return {
            ...skill,
            points: track.pontos || 0,
            onCooldown: tempoRestante > 0,
            tempoRestante,
            rarity: skill.rarity || 'comum'
        }
    })
    skills.value = formatted.sort((a, b) => (a.hotkey || '').localeCompare(b.hotkey || ''))
}

onMounted(() => {
    calcularSkills()
    intervalId = setInterval(calcularSkills, 1000)
    window.addEventListener('skills-updated', calcularSkills)
    window.addEventListener('skill-used', calcularSkills)
    window.addEventListener('skill-unlocked', calcularSkills)
})

onBeforeUnmount(() => {
    clearInterval(intervalId)
    window.removeEventListener('skills-updated', calcularSkills)
    window.removeEventListener('skill-used', calcularSkills)
    window.removeEventListener('skill-unlocked', calcularSkills)
})
</script>
