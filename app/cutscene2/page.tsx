'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

type Beat = {
  speaker: string | null
  lines: string[]
}

const BEATS: Beat[] = [
  {
    speaker: null,
    lines: ['1968年11月2日　深夜', '五月花歌廳的燈光一盞一盞熄去，', '只剩舞台上的聚光燈還亮著。'],
  },
  {
    speaker: null,
    lines: ['她從幕後走出來，', '沒有人為她鼓掌——', '或許每個人都在等待那個瞬間。'],
  },
  {
    speaker: '娟娟',
    lines: ['〈孤戀花〉', '風微微　風微微　孤單悶悶在池邊……'],
  },
  {
    speaker: '娟娟',
    lines: ['孤單阮薄命花　親像瓊花無一暝……'],
  },
  {
    speaker: null,
    lines: ['台下的柯老雄，', '眼神一直沒有離開她。'],
  },
]

const LOCK_BEAT = 2
const LOCK_SECONDS = 60

export default function Cutscene1() {
  const router = useRouter()
  const [beat, setBeat] = useState(0)
  const [visible, setVisible] = useState(true)
  const [locked, setLocked] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Lock interaction for 60s when the singing beat appears
  useEffect(() => {
    if (beat !== LOCK_BEAT) return
    setLocked(true)
    setCountdown(LOCK_SECONDS)
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval)
          setLocked(false)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [beat])

  // Start music on first interaction (browser autoplay policy)
  function startMusic() {
    const audio = audioRef.current
    if (!audio || !audio.paused) return
    audio.play().catch(() => {})
  }

  function advance() {
    if (locked) return
    startMusic()
    if (beat < BEATS.length - 1) {
      setVisible(false)
      setTimeout(() => {
        setBeat(b => b + 1)
        setVisible(true)
      }, 300)
    } else {
      navigateOut('/chapter2')
    }
  }

  // Fade out music before leaving
  function navigateOut(path: string) {
    const audio = audioRef.current
    if (!audio) { router.push(path); return }
    const step = () => {
      if (audio.volume > 0.05) {
        audio.volume = Math.max(0, audio.volume - 0.05)
        setTimeout(step, 60)
      } else {
        audio.pause()
        router.push(path)
      }
    }
    step()
  }

  // keyboard shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const current = BEATS[beat]
  const isLast = beat === BEATS.length - 1

  return (
    <div
      className={`relative h-full w-full overflow-hidden select-none ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={advance}
    >
      <audio ref={audioRef} src="/audio/ch1_gulianhua.mp3" loop />
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/ch1_cutscene.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      />

      {/* Cinematic overlay — top bar */}
      <div className="absolute top-0 left-0 right-0" style={{ height: '10%', background: '#000' }} />
      {/* Cinematic overlay — bottom bar */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '10%', background: '#000' }} />

      {/* Gradient for text area */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '10%',
          height: '35%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dialogue text */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: 'calc(10% + 28px)', padding: '0 10%' }}
      >
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={beat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-2 w-full"
            >
              {/* Speaker label */}
              {current.speaker && (
                <p style={{
                  color: '#e8c870',
                  fontSize: '0.7rem',
                  letterSpacing: '0.3em',
                  fontFamily: 'serif',
                  marginBottom: 4,
                }}>
                  ── {current.speaker} ──
                </p>
              )}

              {/* Lines */}
              {current.lines.map((line, i) => (
                <p
                  key={i}
                  style={{
                    color: i === 0 && current.speaker ? '#f0e0b0' : '#d8cca8',
                    fontSize: i === 0 && current.speaker ? '1.05rem' : '0.9rem',
                    letterSpacing: '0.18em',
                    fontFamily: 'serif',
                    lineHeight: 1.9,
                    textAlign: 'center',
                    textShadow: '0 2px 12px rgba(0,0,0,0.95)',
                  }}
                >
                  {line}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Beat dots */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex gap-1.5"
        style={{ bottom: 'calc(10% + 6px)' }}
      >
        {BEATS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === beat ? 18 : 5,
              height: 5,
              borderRadius: 3,
              background: i === beat ? '#c8a040' : 'rgba(200,160,64,0.28)',
              transition: 'all 0.35s',
            }}
          />
        ))}
      </div>

      {/* Continue hint (bottom bar) */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-end"
        style={{ height: '10%', padding: '0 32px' }}
      >
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            color: '#807050',
            fontSize: '0.58rem',
            letterSpacing: '0.28em',
            fontFamily: 'sans-serif',
          }}
        >
          {locked ? `請聆聽歌曲（${countdown}）` : isLast ? '點擊進入下一關' : '點擊繼續'}
        </motion.p>
      </div>

      {/* Top bar: chapter label */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center"
        style={{ height: '10%', padding: '0 28px' }}
      >
        <p style={{
          color: '#5a4020',
          fontSize: '0.55rem',
          letterSpacing: '0.35em',
          fontFamily: 'sans-serif',
        }}>
          CHAPTER  I　　五月花歌廳
        </p>
      </div>
    </div>
  )
}
