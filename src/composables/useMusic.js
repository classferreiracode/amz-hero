import { ref } from 'vue'
import playlistFile from '@/assets/playlist.json'
import { updateGameState, getGameState } from '@/utils/gameState'

const playlist = playlistFile.tracks
const audio = new Audio()
const currentIndex = ref(0)
const isPlaying = ref(false)
const volume = ref(0.5)
audio.volume = volume.value

audio.addEventListener('ended', () => {
  nextTrack()
})

function play() {
  audio.src = `/assets/audio/${playlist[currentIndex.value].file}`
  audio.play()
  updateGameState({
    "audio": {
      "isPlaying": true,
      "volume": volume.value
    }
  })
}

function pause() {
  audio.pause()
    updateGameState({
      "audio": {
        "isPlaying": false,
        "volume": volume.value
      }
    })
}

function togglePlay() {
  if (getGameState().audio.isPlaying) {
    pause()
  } else {
    play()
  }
}

function nextTrack() {
  currentIndex.value = (currentIndex.value + 1) % playlist.length
  play()
}

function setVolume(val) {
  volume.value = val
  audio.volume = val
}



export function useMusic() {
  return {
    playlist,
    currentIndex,
    isPlaying,
    volume,
    play,
    pause,
    togglePlay,
    nextTrack,
    setVolume
  }
}
