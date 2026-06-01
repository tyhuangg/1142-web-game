let audio: HTMLAudioElement | null = null
let fadeTimer: ReturnType<typeof setInterval> | null = null

function getInstance(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!audio) {
    audio = new Audio('/audio/ch4_footsteps.mp3')
    audio.loop = true
    audio.volume = 0
  }
  return audio
}

function clearFade() {
  if (fadeTimer) {
    clearInterval(fadeTimer)
    fadeTimer = null
  }
}

export function fadeInChapter4Footsteps(durationMs = 1800) {
  const a = getInstance()
  if (!a) return
  clearFade()
  a.volume = 0
  a.currentTime = 0
  a.play().catch(() => {})

  const steps = 30
  const interval = durationMs / steps
  const increment = 1 / steps
  fadeTimer = setInterval(() => {
    if (!a) {
      clearFade()
      return
    }
    if (a.volume < 1 - increment) {
      a.volume = Math.min(1, a.volume + increment)
    } else {
      a.volume = 1
      clearFade()
    }
  }, interval)
}

export function fadeOutChapter4Footsteps(durationMs = 1000) {
  const a = getInstance()
  if (!a) return
  clearFade()

  const steps = 30
  const interval = durationMs / steps
  const startVolume = a.volume
  if (startVolume <= 0) {
    a.pause()
    return
  }
  const decrement = startVolume / steps

  fadeTimer = setInterval(() => {
    if (!a) {
      clearFade()
      return
    }
    if (a.volume > decrement) {
      a.volume = Math.max(0, a.volume - decrement)
    } else {
      a.volume = 0
      a.pause()
      clearFade()
    }
  }, interval)
}

export function stopChapter4Footsteps() {
  clearFade()
  const a = getInstance()
  if (!a) return
  a.pause()
  a.volume = 0
}
