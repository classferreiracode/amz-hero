<template>
    <div
        class="fixed top-4 right-4 bg-base-200 bg-opacity-50 text-xs p-3 rounded-md shadow-md border border-base-300 w-60 font-press z-40 flex flex-col items-center justify-center gap-4">
        <h3 class="font-bold mb-2 text-primary">🕹 Comandos</h3>
        <ul class="space-y-4">
            <li><b>W, A, S, D</b> ou <b>Setas</b>: mover</li>
            <li><b>Espaço</b> ou <b>Enter</b>: interagir</li>
            <li v-if="heroLift"><b>E</b>: abrir HeroLift</li>
            <li v-if="heroLift"><b>Esc</b>: sair</li>
        </ul>
    </div>
</template>

<script setup>
    import { getGameState } from "@/utils/gameState.js";
    import { ref } from "vue";

    const heroLift = ref(getGameState().player.hasHeroLift)

    window.addEventListener('has-hero-lift', () => {
        heroLift.value = true
    })

</script>
