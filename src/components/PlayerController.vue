<template>
        
    <canvas id="playerCanvas" width="128" height="128" class="absolute z-40"
                :style="{ left: player.x + 'px', top: player.y + 'px' }"></canvas>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getGameState } from '@/utils/gameState'

const state = getGameState()

const player = ref({
    x: 100,
    y: 100,
})

const SPRITE_WIDTH = 64
const SPRITE_HEIGHT = 64
const SPRITE_ROWS = {
    down: 2,
    left: 1,
    right: 3,
    up: 0
}
let direction = 'down'
let frame = 0
let canvas, ctx
let keys = {}
const speed = 2

let lastFrameTime = 0
const frameInterval = 120 // milissegundos entre quadros
const sprite = new Image()

sprite.src = state.player.classe === 'Heroína'
    ? '/assets/sprites/players/female/walk.png'
    : '/assets/sprites/players/male/walk.png'

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
        sprite,
        frame * SPRITE_WIDTH,
        SPRITE_ROWS[direction] * SPRITE_HEIGHT,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        0,
        0,
        SPRITE_WIDTH * 2,
        SPRITE_HEIGHT * 2
    )
}

function updatePosition(timestamp) {
    let moved = false
    if (keys['w'] || keys['ArrowUp']) {
        player.value.y -= speed
        direction = 'up'
        moved = true
    }
    if (keys['s'] || keys['ArrowDown']) {
        player.value.y += speed
        direction = 'down'
        moved = true
    }
    if (keys['a'] || keys['ArrowLeft']) {
        player.value.x -= speed
        direction = 'left'
        moved = true
    }
    if (keys['d'] || keys['ArrowRight']) {
        player.value.x += speed
        direction = 'right'
        moved = true
    }

    // Limitar dentro do mapa (exemplo 640x640)
    const MAP_WIDTH = 640
    const MAP_HEIGHT = 640
    const PLAYER_WIDTH = SPRITE_WIDTH * 2
    const PLAYER_HEIGHT = SPRITE_HEIGHT * 2

    player.value.x = Math.max(0, Math.min(player.value.x, MAP_WIDTH - PLAYER_WIDTH))
    player.value.y = Math.max(0, Math.min(player.value.y, MAP_HEIGHT - PLAYER_HEIGHT))

    if (moved) {
        if (timestamp - lastFrameTime > frameInterval) {
            frame = (frame + 1) % 4
            lastFrameTime = timestamp
        }
        draw()
        window.dispatchEvent(new CustomEvent('update-player-position', {
            detail: { x: player.value.x, y: player.value.y }
        }))
    } else {
        frame = 0 // Reseta a animação se parado
        draw()
    }

    requestAnimationFrame(updatePosition)
}


function handleKeyDown(e) {
    keys[e.key] = true

    if ([' ', 'Enter'].includes(e.key)) {
        window.dispatchEvent(new CustomEvent('player-interact', {
            detail: {
                x: player.value.x,
                y: player.value.y
            }
        }))
    }

    if (e.key === 'e' && state.hasHeroLift) {
        window.dispatchEvent(new CustomEvent('open-hero-lift'))
    }
}

function handleKeyUp(e) {
    keys[e.key] = false
}

onMounted(() => {
    canvas = document.getElementById('playerCanvas')
    ctx = canvas.getContext('2d')
    sprite.onload = () => {
        draw()
        requestAnimationFrame(updatePosition)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
})
</script>
