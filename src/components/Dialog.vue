<template>
    <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full p-4 bg-base-100 border border-primary rounded-lg shadow-lg text-sm font-press space-y-2"
    >
        <p>
            <span class="text-primary">{{ currentDialog.speaker }}:</span>
            {{ currentDialog.text }}
        </p>
        <div class="text-right mt-5 flex justify-center">
            <button class="btn btn-sm btn-primary" @click="nextDialog">
                Continuar
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    dialogLines: Array,
    showDialog: Boolean,
    onDialogEnd: Function
})

const dialogIndex = ref(0)
const currentDialog = computed(() => props.dialogLines[dialogIndex.value])

function nextDialog() {
    if (dialogIndex.value < props.dialogLines.length - 1) {
        dialogIndex.value++
    } else {
        // Quando todos os diálogos acabarem
        props.onDialogEnd()
        dialogIndex.value = null
    }
}
</script>
