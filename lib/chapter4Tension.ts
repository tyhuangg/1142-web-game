let audio: HTMLAudioElement | null = null
let fadeTimer: ReturnType<typeof setInterval> | null = null
let fadeInDurationMs = 1800
let unlockBound = false
let pendingPlay = false
let shouldPlay = false
let endedBound = false

function getInstance(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!audio) {
    audio = new Audio('/audio/tensions.mp3')
    audio.loop = false
    audio.volume = 0
    audio.preload = 'auto'
    bindEndedHandler(audio)
  }
  return audio
}

function bindEndedHandler(a: HTMLAudioElement) {
  if (endedBound) return
  endedBound = true
  a.addEventListener('ended', () => {
    if (!shouldPlay) return
    a.currentTime = 0
    a.play().catch(() => {
      pendingPlay = true
      bindUnlockOnInteraction()
    })
  })
}

function clearFade() {
  if (fadeTimer) {
    clearInterval(fadeTimer)
    fadeTimer = null
  }
}

function runFadeIn() {
  const a = getInstance()
  if (!a) return
  clearFade()

  const steps = 30
  const interval = fadeInDurationMs / steps
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

function tryPlayTension() {
  const a = getInstance()
  if (!a || !shouldPlay) return
  a.play()
    .then(() => {
      pendingPlay = false
      if (a.volume <= 0) runFadeIn()
    })
    .catch(() => {
      pendingPlay = true
      bindUnlockOnInteraction()
    })
}

function bindUnlockOnInteraction() {
  if (unlockBound || typeof window === 'undefined') return
  unlockBound = true

  const resume = () => {
    if (!pendingPlay || !shouldPlay) return
    tryPlayTension()
  }

  window.addEventListener('pointerdown', resume, { once: true })
  window.addEventListener('keydown', resume, { once: true })
}

export function fadeInChapter4Tension(durationMs = 1800) {
  const a = getInstance()
  if (!a) return
  shouldPlay = true
  fadeInDurationMs = durationMs
  clearFade()
  a.volume = 0
  a.currentTime = 0
  tryPlayTension()
  runFadeIn()
}

export function fadeOutChapter4Tension(durationMs = 1000, onComplete?: () => void) {
  const a = getInstance()
  if (!a) {
    onComplete?.()
    return
  }
  shouldPlay = false
  pendingPlay = false
  clearFade()

  const steps = 30
  const interval = durationMs / steps
  const startVolume = a.volume
  if (startVolume <= 0) {
    a.pause()
    onComplete?.()
    return
  }
  const decrement = startVolume / steps

  fadeTimer = setInterval(() => {
    if (!a) {
      clearFade()
      onComplete?.()
      return
    }
    if (a.volume > decrement) {
      a.volume = Math.max(0, a.volume - decrement)
    } else {
      a.volume = 0
      a.pause()
      clearFade()
      onComplete?.()
    }
  }, interval)
}

export function stopChapter4Tension() {
  shouldPlay = false
  pendingPlay = false
  clearFade()
  const a = getInstance()
  if (!a) return
  a.pause()
  a.volume = 0
}
