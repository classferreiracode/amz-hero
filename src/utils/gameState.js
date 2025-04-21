const GAME_STATE_KEY = 'gameState'

// Estado inicial padrão
const defaultState = {
    "player": {
        "name": null,
        "classe": null,
        "vidas": 0,
        "hasHeroLift": false,
        "xp": 0,
        "level": 0,
        "orbes": 0,
        "inventario": [],
        "vitorias": 0,
        "derrotas": 0
    },
    "game": {
        "fasesConcluidas": [],
        "fasesDisponiveis": [],
        "missaoAtual": "",
        "conquistas": [],
        "tempoJogado": 0
    },
    "heroLift": {
        "habilidadesDesbloqueadas": [],
        "missoesAtivas": [],
    },
    "audio": {
        "isPlaying": false,
        "volume": 0.6,
        "isMuted": false
    }
}


export function ganharXP(quantidade) {
    const state = getGameState().player
    state.xp = (state.xp || 0) + quantidade

    // Verifica se sobe de nível
    let proximoNivel = state.level || 1
    let xpNecessario = xpParaNivel(proximoNivel)

    while (state.xp >= xpNecessario) {
        state.xp -= xpNecessario
        proximoNivel++
        xpNecessario = xpParaNivel(proximoNivel)

        // Toast de level up
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
                title: `🎉 Level Up!`,
                message: `🆙 Você alcançou o nível ${proximoNivel}!`,
                type: 'levelup'
            }
        }))
    }

    state.level = proximoNivel
    updateGameState(state)
    window.dispatchEvent(new Event('update-xp'))
}

export function addItemToInventory(item) {
    const state = getGameState()
    state.player.inventario.push(item)
    updateGameState(state)
    window.dispatchEvent(new Event('update-inventario'))
}

export function removeItemFromInventory(item) {
    const state = getGameState()
    state.player.inventario = state.player.inventario.filter(i => i !== item)
    updateGameState(state)
}

export function addConquista(conquista) {
    const state = getGameState()
    state.game.conquistas.push(conquista)
    updateGameState(state)
}

function xpParaNivel(nivel) {
    return Math.floor(100 * Math.pow(1.5, nivel - 1))
}

function deepMerge(target, source) {
    for (const key in source) {
        if (
            typeof source[key] === 'object' &&
            source[key] !== null &&
            !Array.isArray(source[key])
        ) {
            target[key] = deepMerge(target[key] || {}, source[key])
        } else {
            target[key] = source[key]
        }
    }
    return target
}

// Recupera o estado atual do jogo
export function getGameState() {
    const raw = localStorage.getItem(GAME_STATE_KEY)
    return raw ? JSON.parse(raw) : { ...defaultState }
}

// Atualiza o estado com novas informações
export function updateGameState(updates) {
    const current = getGameState()
    const updated = deepMerge(current, updates)
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(updated))
    return updated
}

// Reset total do progresso (se necessário)
export function resetGameState() {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(defaultState))
}
