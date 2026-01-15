import { createInventoryItem, getItemDefinition } from '@/data/items'

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
    },
    "skills": {
        "pontos": 0,
        "progresso": {},
        "catalogo": {}
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
    updateGameState({ player: state })
    window.dispatchEvent(new Event('update-xp'))
}

export function addItemToInventory(item) {
    const state = getGameState()
    const itemDefinition = createInventoryItem(item.id || item.name)
    const mergedItem = { ...itemDefinition, ...item }

    state.player.inventario.push(mergedItem)
    updateGameState(state)
    aplicarRecompensasDeItem(mergedItem)
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

export function getSkillsState() {
    const state = getGameState()
    if (!state.skills) {
        state.skills = { ...defaultState.skills }
        updateGameState(state)
    }
    return state.skills
}

export function adicionarPontosDeSkill(skillId, quantidade, origem) {
    const skills = getSkillsState()
    skills.pontos = (skills.pontos || 0) + quantidade

    if (!skills.progresso[skillId]) {
        skills.progresso[skillId] = {
            pontos: 0,
            desbloqueado: false,
            cooldownAte: 0,
            ultimaOrigem: null
        }
    }

    skills.progresso[skillId].pontos += quantidade
    skills.progresso[skillId].ultimaOrigem = origem?.name || origem?.id || 'desconhecido'

    updateGameState({ skills })
    window.dispatchEvent(new CustomEvent('skills-updated', { detail: { skillId, quantidade } }))
}

export function desbloquearSkill(skillMeta) {
    const skills = getSkillsState()
    const existente = skills.catalogo[skillMeta.id]
    skills.catalogo[skillMeta.id] = { ...skillMeta }

    if (!skills.progresso[skillMeta.id]) {
        skills.progresso[skillMeta.id] = { pontos: 0, desbloqueado: true, cooldownAte: 0 }
    } else {
        skills.progresso[skillMeta.id].desbloqueado = true
    }

    updateGameState({ skills })

    if (!existente) {
        window.dispatchEvent(new CustomEvent('skill-unlocked', { detail: skillMeta }))
    }
}

export function usarSkill(skillId) {
    const skills = getSkillsState()
    const progress = skills.progresso[skillId]
    const meta = skills.catalogo[skillId]

    if (!progress || !meta || !progress.desbloqueado) {
        return { sucesso: false, motivo: 'locked' }
    }

    const agora = Date.now()
    if (progress.cooldownAte && progress.cooldownAte > agora) {
        const restante = Math.ceil((progress.cooldownAte - agora) / 1000)
        return { sucesso: false, motivo: 'cooldown', restante }
    }

    const cooldownMs = (meta.cooldownSeconds || 8) * 1000
    progress.cooldownAte = agora + cooldownMs
    updateGameState({ skills })
    window.dispatchEvent(new CustomEvent('skill-used', { detail: { skillId, cooldownMs } }))

    return { sucesso: true, cooldownMs }
}

export function acionarSkillPorAtalho(key) {
    const skills = getSkillsState()
    const skill = Object.values(skills.catalogo || {}).find(
        (habilidade) => habilidade.hotkey?.toLowerCase() === key.toLowerCase()
    )

    if (!skill) {
        return { sucesso: false }
    }

    const resultado = usarSkill(skill.id)

    if (resultado.sucesso) {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
                title: `⚡ ${skill.name}`,
                message: skill.effect,
                type: 'info'
            }
        }))
    } else if (resultado.motivo === 'cooldown') {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
                title: `⏳ ${skill.name} em recarga`,
                message: `Aguarde ${resultado.restante}s para usar novamente.`,
                type: 'info'
            }
        }))
    }

    return { ...resultado, habilidade: skill }
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

function aplicarRecompensasDeItem(item) {
    const definicao = getItemDefinition(item.id || item.name)
    if (!definicao || !definicao.skillUnlocked) {
        return
    }

    const state = getGameState()
    const nivelAtual = state.player.level || 1
    const skill = definicao.skillUnlocked

    adicionarPontosDeSkill(skill.id, definicao.skillPoints || 1, definicao)

    window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
            title: '✨ Pontos de Skill!',
            message: `+${definicao.skillPoints || 1} pontos com ${definicao.name}.`,
            type: 'info'
        }
    }))

    if (nivelAtual >= definicao.levelRequirement) {
        desbloquearSkill({ ...skill, rarity: definicao.rarity, levelRequirement: definicao.levelRequirement })
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
                title: '🆕 Habilidade desbloqueada!',
                message: `${skill.name} liberada (tecla ${skill.hotkey}).`,
                type: 'item'
            }
        }))
    }
}
