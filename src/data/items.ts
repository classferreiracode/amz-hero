export type SkillUnlock = {
  id: string
  name: string
  description: string
  hotkey: string
  cooldownSeconds: number
  effect: string
}

export type ItemDefinition = {
  id: string
  name: string
  description: string
  sprite: string
  rarity: 'comum' | 'incomum' | 'raro' | 'épico' | 'lendário'
  levelRequirement: number
  effect: string
  skillPoints: number
  skillUnlocked?: SkillUnlock
}

export const itemDefinitions: ItemDefinition[] = [
  {
    id: 'orbe-eloquencia',
    name: 'Orbe da Eloquência',
    description:
      'Representa a comunicação eficaz, a clareza na transmissão de ideias e a capacidade de envolver tanto clientes quanto a equipe.',
    sprite: 'eloquencia.png',
    rarity: 'raro',
    levelRequirement: 1,
    effect: 'Aumenta a afinidade com NPCs e melhora as respostas durante diálogos.',
    skillPoints: 10,
    skillUnlocked: {
      id: 'fala-inspiradora',
      name: 'Fala Inspiradora',
      description: 'Discurso curto que motiva a equipe e rende uma explosão de XP.',
      hotkey: '1',
      cooldownSeconds: 12,
      effect: '+15 XP bônus para o próximo acerto em quiz.'
    }
  },
  {
    id: 'orbe-criacao',
    name: 'Orbe da Criação',
    description: 'Simboliza a criatividade e inovação, incentivando o pensamento fora da caixa para criações impactantes.',
    sprite: 'criacao.png',
    rarity: 'épico',
    levelRequirement: 2,
    effect: 'Diminui o tempo de espera entre interações e revela pistas sutis no mapa.',
    skillPoints: 14,
    skillUnlocked: {
      id: 'faixa-criativa',
      name: 'Faísca Criativa',
      description: 'Uma ideia relâmpago que acelera tarefas do herói.',
      hotkey: '2',
      cooldownSeconds: 16,
      effect: 'Garante +20 XP na próxima coleta de item raro.'
    }
  },
  {
    id: 'orbe-sinergia',
    name: 'Orbe da Sinergia',
    description: 'Reflete a adaptabilidade, a colaboração e o trabalho em equipe, essenciais para enfrentar desafios dinâmicos.',
    sprite: 'sinergia.png',
    rarity: 'lendário',
    levelRequirement: 3,
    effect: 'Concede bônus temporário de velocidade ao caminhar próximo de aliados.',
    skillPoints: 18,
    skillUnlocked: {
      id: 'pulso-de-time',
      name: 'Pulso de Time',
      description: 'Envia um pulso de energia que sincroniza o grupo.',
      hotkey: '3',
      cooldownSeconds: 20,
      effect: 'Reduz o próximo cooldown de habilidade em 40%.'
    }
  }
]

export function getItemDefinition(idOrName: string): ItemDefinition | undefined {
  return itemDefinitions.find(
    (item) => item.id === idOrName || item.name.toLowerCase() === idOrName.toLowerCase()
  )
}

export function createInventoryItem(idOrName: string): ItemDefinition {
  const definition = getItemDefinition(idOrName)
  if (!definition) {
    return {
      id: idOrName,
      name: idOrName,
      description: 'Item misterioso sem efeitos identificados.',
      sprite: 'placeholder.png',
      rarity: 'comum',
      levelRequirement: 1,
      effect: 'Nenhum efeito conhecido.',
      skillPoints: 1
    }
  }

  return { ...definition }
}
