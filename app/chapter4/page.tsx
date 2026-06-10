'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  fadeInChapter4Footsteps,
  fadeOutChapter4Footsteps,
  stopChapter4Footsteps,
} from '@/lib/chapter4Footsteps'
import {
  fadeInChapter4Tension,
  fadeOutChapter4Tension,
  stopChapter4Tension,
} from '@/lib/chapter4Tension'

const TEXT_STYLE = {
  fontSize: 24,
  color: '#FFD54F',
  letterSpacing: '0.14em',
} as const
const INTRO_TITLE_HOLD_MS = 3000
const INTRO_TITLE_FADE_S = 1.4
const LINE_FADE_S = 0.4
const INVESTIGATE_AFTER_LINE2_EXIT_MS = Math.ceil(LINE_FADE_S * 1000) + 80
const TENSION_FADE_IN_MS = 1000
const TENSION_FADE_OUT_MS = 1400
const REVELATION_SUBTITLE_FADE_S = 0.85
const REVELATION_LINE1_HOLD_MS = 1800
const REVELATION_LINE2_HOLD_MS = 2200

type RevealBeat = 'line1' | 'line2' | 'done'

/** 三項關鍵線索（推理板觸發條件：帳冊、針筒、藥粉） */
const KEY_CLUE_IDS = [3, 4, 5] as const
const REVELATION_LINE1 = '柯老雄利用瑪啡徹底控制了娟娟'
const REVELATION_LINE2A = '這時的娟娟已不再是完整的「人」，'
const REVELATION_LINE2B = '她變成了被藥物與恐懼操縱的木偶。'
const REVELATION_SUBTITLE_STYLE = {
  color: '#e8c870',
  fontSize: '1.2rem',
  letterSpacing: '0.28em',
  lineHeight: 1.9,
  textShadow: '0 0 40px rgba(232,200,112,0.22)',
} as const
const PUZZLE_QUESTION = '柯老雄房間藏著什麼秘密？'
const BRIEFCASE_CAPACITY = 3
const SCENE_HEIGHT = '70%'
const BOARD_HEIGHT = '30%'

/** 百分比定位（光點中心）；對應圖片請放 public/images/chapter4/ */
const LIGHT_HOTSPOTS = [
  {
    id: 1,
    label: '左上櫥櫃上',
    left: '16%',
    top: '18%',
    clueSrc: '/images/chapter4/kouhong.png',
    clueTitle: '口紅',
    clueHint: '鮮紅的口紅，不像是房間主人慣用的物品……',
  },
  {
    id: 2,
    label: '右方床上衣物堆疊處',
    left: '72%',
    top: '56%',
    offsetXPx: 120,
    clueSrc: '/images/chapter4/chenshan.png',
    clueTitle: '襯衫',
    clueHint: '皺巴巴的男用襯衫，床邊隨意堆著。',
  },
  {
    id: 3,
    label: '櫥櫃門上',
    left: '14%',
    top: '44%',
    clueSrc: '/images/chapter4/zhangce.png',
    clueTitle: '帳冊',
    clueHint: '帳冊上寫滿了來歷不明的進帳紀錄。',
  },
  {
    id: 4,
    label: '左手邊地上的陰暗處',
    left: '10%',
    bottom: '14%',
    clueSrc: '/images/chapter4/zhentong.png',
    clueTitle: '針筒',
    clueHint: '老舊的針筒，針尖仍殘留污漬。',
  },
  {
    id: 5,
    label: '右上床邊地板',
    left: '78%',
    top: '52%',
    offsetXPx: -200,
    offsetYPx: -220,
    clueSrc: '/images/chapter4/yaofen.png',
    clueTitle: '藥粉',
    clueHint: '可疑的白色粉末，旁邊還有刮刀痕跡。',
  },
  {
    id: 6,
    label: '右上床上',
    left: '76%',
    top: '34%',
    offsetXPx: 150,
    offsetYPx: -150,
    clueSrc: '/images/chapter4/zhaopian.png',
    clueTitle: '照片',
    clueHint: '不同女子的舊照片，散放在床鋪上。',
  },
] as const

type ClueId = (typeof LIGHT_HOTSPOTS)[number]['id']

function getClue(id: ClueId) {
  return LIGHT_HOTSPOTS.find((s) => s.id === id)!
}

export default function Chapter4Page() {
  const router = useRouter()
  const [introVisible, setIntroVisible] = useState(true)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)
  const [screen, setScreen] = useState<'intro' | 'investigate'>('intro')
  const [briefcaseClues, setBriefcaseClues] = useState<Set<ClueId>>(new Set())
  const [activeClueId, setActiveClueId] = useState<ClueId | null>(null)
  const [showReveal, setShowReveal] = useState(false)
  const [revealBeat, setRevealBeat] = useState<RevealBeat | null>(null)
  const [showEvidence, setShowEvidence] = useState(false)
  const [showLogic, setShowLogic] = useState(false)
  const line2HoldTimer = useRef<number | null>(null)
  const investigateTimer = useRef<number | null>(null)
  const line2RevealScheduled = useRef(false)
  const revealShownRef = useRef(false)
  const navigatingToCh5Ref = useRef(false)
  const revealTimelineRef = useRef<number[]>([])

  const canSolve = KEY_CLUE_IDS.every((id) => briefcaseClues.has(id))
  const activeClue = activeClueId ? getClue(activeClueId) : undefined
  const activeInBriefcase =
    activeClueId !== null && briefcaseClues.has(activeClueId)
  const briefcaseFull = briefcaseClues.size >= BRIEFCASE_CAPACITY
  const briefcaseList = [...briefcaseClues]

  useEffect(() => {
    return () => {
      stopChapter4Footsteps()
      if (!navigatingToCh5Ref.current) {
        stopChapter4Tension()
      }
    }
  }, [])

  useEffect(() => {
    if (phase === 1) fadeInChapter4Footsteps()
  }, [phase])

  useEffect(() => {
    if (screen !== 'investigate') return
    fadeInChapter4Tension(TENSION_FADE_IN_MS)
  }, [screen])

  useEffect(() => {
    if (!showReveal) {
      setRevealBeat(null)
      revealTimelineRef.current.forEach((id) => window.clearTimeout(id))
      revealTimelineRef.current = []
      return
    }

    const fadeMs = Math.ceil(REVELATION_SUBTITLE_FADE_S * 1000)
    const line1ToLine2 = fadeMs + REVELATION_LINE1_HOLD_MS
    const line2ToDone = line1ToLine2 + fadeMs + fadeMs + REVELATION_LINE2_HOLD_MS
    const navigateAt = line2ToDone + fadeMs

    setRevealBeat('line1')

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay)
      revealTimelineRef.current.push(id)
    }

    schedule(() => setRevealBeat('line2'), line1ToLine2)
    schedule(() => setRevealBeat('done'), line2ToDone)
    schedule(() => goToChapter5(), navigateAt)

    return () => {
      revealTimelineRef.current.forEach((id) => window.clearTimeout(id))
      revealTimelineRef.current = []
    }
  }, [showReveal])

  useEffect(() => {
    const t = window.setTimeout(() => setIntroVisible(false), INTRO_TITLE_HOLD_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 3) return
    fadeOutChapter4Footsteps(LINE_FADE_S * 1000)
  }, [phase])

  useEffect(() => {
    const tShow1 = window.setTimeout(() => setPhase(1), INTRO_TITLE_HOLD_MS + 1000)
    const tToLine2 = window.setTimeout(
      () => setPhase(2),
      INTRO_TITLE_HOLD_MS + 1000 + 1500,
    )
    return () => {
      window.clearTimeout(tShow1)
      window.clearTimeout(tToLine2)
      if (line2HoldTimer.current) {
        window.clearTimeout(line2HoldTimer.current)
        line2HoldTimer.current = null
      }
      if (investigateTimer.current) {
        window.clearTimeout(investigateTimer.current)
        investigateTimer.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (phase !== 3 || screen !== 'intro') return
    investigateTimer.current = window.setTimeout(() => {
      investigateTimer.current = null
      setScreen('investigate')
    }, INVESTIGATE_AFTER_LINE2_EXIT_MS)
    return () => {
      if (investigateTimer.current) {
        window.clearTimeout(investigateTimer.current)
        investigateTimer.current = null
      }
    }
  }, [phase, screen])

  useEffect(() => {
    if (activeClueId === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveClueId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeClueId])

  function openClue(id: ClueId) {
    setActiveClueId(id)
  }

  function addToBriefcase() {
    if (activeClueId === null) return
    if (briefcaseClues.has(activeClueId) || briefcaseClues.size >= BRIEFCASE_CAPACITY) {
      return
    }
    setBriefcaseClues((prev) => new Set([...prev, activeClueId]))
    setActiveClueId(null)
  }

  function submitAnswer() {
    if (!canSolve) return
    if (revealShownRef.current) return
    revealShownRef.current = true
    setShowReveal(true)
  }

  function goToChapter5() {
    if (navigatingToCh5Ref.current) return
    navigatingToCh5Ref.current = true
    router.push('/chapter5')
    window.setTimeout(() => {
      fadeOutChapter4Tension(TENSION_FADE_OUT_MS)
    }, 0)
  }

  function removeFromBriefcase() {
    if (activeClueId === null || !briefcaseClues.has(activeClueId)) return
    setBriefcaseClues((prev) => {
      const next = new Set(prev)
      next.delete(activeClueId)
      return next
    })
    setActiveClueId(null)
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: '#16161c' }}
    >
      <AnimatePresence mode="wait">
        {screen === 'intro' ? (
          <motion.div
            key="intro"
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/chapter4-room.png"
              alt="柯老雄房間"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                {phase === 1 && (
                  <motion.p
                    key="line1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: LINE_FADE_S }}
                    className="max-w-[min(92vw,36rem)] px-6 text-center font-serif"
                    style={TEXT_STYLE}
                  >
                    進入柯老雄房間...
                  </motion.p>
                )}
                {phase === 2 && (
                  <motion.p
                    key="line2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: LINE_FADE_S }}
                    className="max-w-[min(92vw,36rem)] px-6 text-center font-serif leading-relaxed"
                    style={TEXT_STYLE}
                    onAnimationComplete={() => {
                      if (line2RevealScheduled.current) return
                      line2RevealScheduled.current = true
                      line2HoldTimer.current = window.setTimeout(() => {
                        line2HoldTimer.current = null
                        setPhase(3)
                      }, 2500)
                    }}
                  >
                    請你揭發柯老雄的秘密
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="investigate"
            className="flex h-full w-full flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55 }}
          >
            {/* ── 上方場景 ── */}
            <div className="relative flex-1 min-h-0 overflow-hidden">
              <Image
                src="/images/chapter4-room-clues.png"
                alt="房內搜查視角"
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 60%, rgba(22,22,28,0.75) 100%)',
                }}
              />

              <div
                className="pointer-events-none absolute top-4 left-5 flex flex-col gap-0.5"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
              >
                <p
                  style={{
                    color: '#806030',
                    fontSize: '0.55rem',
                    letterSpacing: '0.38em',
                    fontFamily: 'sans-serif',
                  }}
                >
                  CHAPTER&nbsp;&nbsp;IV
                </p>
                <p
                  style={{
                    color: '#e8c870',
                    fontSize: '1rem',
                    letterSpacing: '0.2em',
                    fontFamily: 'serif',
                  }}
                >
                  柯老雄房間
                </p>
              </div>

              <div
                className="pointer-events-none absolute top-4 right-5 flex flex-col gap-1"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
              >
                <p
                  style={{
                    color: '#806030',
                    fontSize: '0.55rem',
                    letterSpacing: '0.3em',
                    fontFamily: 'sans-serif',
                    textAlign: 'right',
                  }}
                >
                  CLUES
                </p>
                <p
                  style={{
                    color: '#e8c870',
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    fontFamily: 'serif',
                    textAlign: 'right',
                  }}
                >
                  {briefcaseClues.size} / {BRIEFCASE_CAPACITY}
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
                style={{
                  color: '#c8a040',
                  fontSize: '0.78rem',
                  letterSpacing: '0.22em',
                  fontFamily: 'sans-serif',
                  textShadow: '0 2px 10px rgba(0,0,0,0.95)',
                }}
              >
                點擊場景中發光的物件進行調查，找出三項關鍵線索放入公事包
              </motion.p>

              <div className="absolute inset-0 z-10">
                {LIGHT_HOTSPOTS.map((spot) => {
                  const ox = 'offsetXPx' in spot ? spot.offsetXPx : 0
                  const oy = 'offsetYPx' in spot ? spot.offsetYPx : 0
                  const inBriefcase = briefcaseClues.has(spot.id)
                  return (
                    <div
                      key={spot.id}
                      className="absolute"
                      style={{
                        left: spot.left,
                        ...('bottom' in spot
                          ? { bottom: spot.bottom }
                          : { top: spot.top }),
                        transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
                      }}
                    >
                      <motion.button
                        type="button"
                        aria-label="線索"
                        initial={{ scale: 0.85 }}
                        animate={{
                          opacity: inBriefcase ? 0.45 : [0.75, 1, 0.75],
                          scale: inBriefcase ? 0.85 : [0.92, 1.08, 0.92],
                        }}
                        transition={{
                          repeat: inBriefcase ? 0 : Infinity,
                          duration: 2.4,
                          ease: 'easeInOut',
                        }}
                        className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full border border-yellow-300/90 bg-yellow-400/95 shadow-[0_0_10px_4px_rgba(255,214,94,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                        onClick={() => openClue(spot.id)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── 底部工具列 ── */}
            <div className="flex flex-none items-center gap-4 px-6"
                 style={{ height: 'clamp(100px, 14vh, 150px)', background: 'rgba(8,7,14,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>

              {/* Evidence button */}
              <motion.button
                type="button"
                onClick={() => setShowEvidence(true)}
                className="flex-1 flex flex-col justify-center gap-3"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(200,160,55,0.07)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  height: 'clamp(74px, 10vh, 110px)', background: 'rgba(200,160,55,0.04)',
                  border: '1px solid rgba(200,160,55,0.18)', borderRadius: 10,
                  padding: '0 22px', cursor: 'pointer',
                }}
              >
                <div className="flex items-baseline gap-2">
                  <span style={{ color: '#dcc070', fontSize: '1rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>Evidence</span>
                  <span style={{ color: '#5a4820', fontSize: '0.62rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>證據欄</span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: BRIEFCASE_CAPACITY }, (_, i) => (
                    <div key={i} style={{
                      width: 9, height: 9, borderRadius: '50%',
                      background: briefcaseList[i] ? '#c8a030' : 'rgba(90,72,30,0.3)',
                      boxShadow: briefcaseList[i] ? '0 0 6px rgba(200,160,48,0.6)' : 'none',
                      transition: 'all 0.3s',
                    }} />
                  ))}
                </div>
              </motion.button>

              {/* Logic Board button */}
              <motion.button
                type="button"
                onClick={() => setShowLogic(true)}
                className="flex-1 flex flex-col justify-center gap-3"
                whileHover={{ scale: 1.02, backgroundColor: canSolve ? 'rgba(200,150,45,0.1)' : 'rgba(200,160,55,0.07)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  height: 'clamp(74px, 10vh, 110px)',
                  background: canSolve ? 'rgba(200,150,45,0.07)' : 'rgba(200,160,55,0.04)',
                  border: `1px solid ${canSolve ? 'rgba(200,150,45,0.4)' : 'rgba(200,160,55,0.18)'}`,
                  borderRadius: 10, padding: '0 22px', cursor: 'pointer',
                  transition: 'border-color 0.4s, background 0.4s',
                  boxShadow: canSolve ? '0 0 18px rgba(200,150,45,0.1)' : 'none',
                }}
              >
                <div className="flex items-baseline gap-2">
                  <span style={{
                    color: canSolve ? '#dcc070' : '#4a4858',
                    fontSize: '1rem', letterSpacing: '0.22em', fontFamily: 'serif', transition: 'color 0.4s',
                  }}>Logic Board</span>
                  <span style={{ color: '#5a4820', fontSize: '0.62rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>推理板</span>
                </div>
                <AnimatePresence>
                  {canSolve ? (
                    <motion.span key="ready" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ color: '#c8a030', fontSize: '0.6rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>
                      線索齊全　可提交答案
                    </motion.span>
                  ) : (
                    <motion.span key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ color: '#3a3848', fontSize: '0.6rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>
                      蒐集線索以解鎖推理
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* ── Evidence panel modal ── */}
            <AnimatePresence>
              {showEvidence && (
                <motion.div key="evidence-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
                  onClick={() => setShowEvidence(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 26, scale: 0.93 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 14, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: 'linear-gradient(155deg, #1e1710 0%, #120e07 100%)',
                      border: '1px solid rgba(200,160,55,0.38)', borderRadius: 14,
                      width: 'min(480px, 92vw)', padding: '24px 28px', boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
                    }}
                  >
                    <div className="flex items-baseline justify-between mb-5">
                      <div className="flex items-baseline gap-2">
                        <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>Evidence</h2>
                        <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>證據欄</span>
                      </div>
                      <button type="button" onClick={() => setShowEvidence(false)}
                        style={{ color: '#5a4820', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3" style={{ height: 'min(200px, 28vh)' }}>
                      {Array.from({ length: BRIEFCASE_CAPACITY }, (_, slotIndex) => {
                        const id = briefcaseList[slotIndex]
                        const spot = id ? getClue(id) : null
                        return (
                          <motion.button key={slotIndex} type="button" disabled={!spot}
                            onClick={() => { if (spot) { setShowEvidence(false); setActiveClueId(spot.id) } }}
                            className="relative flex flex-col items-center justify-between overflow-hidden rounded-lg"
                            style={{
                              background: spot ? 'rgba(26,20,10,0.95)' : 'rgba(18,18,24,0.8)',
                              border: `1px solid ${spot ? 'rgba(210,165,55,0.6)' : 'rgba(50,50,62,0.5)'}`,
                              boxShadow: spot ? '0 0 16px rgba(210,165,55,0.14)' : 'none',
                              cursor: spot ? 'pointer' : 'default',
                              padding: spot ? '8px 10px 6px' : 0,
                            }}
                            whileHover={spot ? { scale: 1.025, y: -1 } : {}}
                            whileTap={spot ? { scale: 0.97 } : {}}
                          >
                            {spot ? (
                              <>
                                <div className="flex-1 min-h-0 flex items-center justify-center w-full overflow-hidden px-1.5 py-1">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={spot.clueSrc} alt={spot.clueTitle}
                                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', display: 'block' }} />
                                </div>
                                <p style={{ color: '#a08838', fontSize: '0.48rem', letterSpacing: '0.1em', fontFamily: 'sans-serif', flexShrink: 0, marginTop: 2 }}>
                                  {spot.clueTitle}
                                </p>
                              </>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5" style={{ opacity: 0.18 }}>
                                <span style={{ fontSize: '1.2rem' }}>?</span>
                                <span style={{ color: '#606075', fontSize: '0.45rem', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>未放入</span>
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Logic Board modal ── */}
            <AnimatePresence>
              {showLogic && (
                <motion.div key="logic-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
                  onClick={() => setShowLogic(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 26, scale: 0.93 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 14, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: 'linear-gradient(155deg, #1e1710 0%, #120e07 100%)',
                      border: '1px solid rgba(200,160,55,0.38)', borderRadius: 14,
                      width: 'min(480px, 92vw)', padding: '24px 28px', boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
                    }}
                  >
                    <div className="flex items-baseline justify-between mb-5">
                      <div className="flex items-baseline gap-2">
                        <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>Logic Board</h2>
                        <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>推理板</span>
                      </div>
                      <button type="button" onClick={() => setShowLogic(false)}
                        style={{ color: '#5a4820', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-5">
                      {KEY_CLUE_IDS.map((id, i) => {
                        const spot = getClue(id)
                        const collected = briefcaseClues.has(id)
                        return (
                          <Fragment key={id}>
                            <motion.button type="button" disabled={!collected}
                              onClick={() => { if (collected) { setShowLogic(false); setActiveClueId(id) } }}
                              className="flex flex-col items-center gap-1"
                              style={{ cursor: collected ? 'pointer' : 'default' }}
                              whileHover={collected ? { scale: 1.05, y: -2 } : {}}
                            >
                              <div style={{
                                width: 58, height: 58,
                                background: collected ? 'rgba(22,16,8,0.95)' : 'rgba(18,18,24,0.7)',
                                border: `1px solid ${collected ? 'rgba(210,165,55,0.65)' : 'rgba(45,45,58,0.6)'}`,
                                borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', boxShadow: collected ? '0 0 12px rgba(210,165,55,0.18)' : 'none',
                                opacity: collected ? 1 : 0.28, flexShrink: 0,
                              }}>
                                {collected ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={spot.clueSrc} alt={spot.clueTitle}
                                    style={{ maxWidth: '88%', maxHeight: '88%', objectFit: 'contain', display: 'block' }} />
                                ) : (
                                  <span style={{ color: '#4a4a5a', fontSize: '1.1rem', fontFamily: 'serif' }}>?</span>
                                )}
                              </div>
                              <span style={{ color: collected ? '#9a7e38' : '#30303c', fontSize: '0.5rem', letterSpacing: '0.08em', fontFamily: 'sans-serif', maxWidth: 62, textAlign: 'center' }}>
                                {spot.clueTitle}
                              </span>
                            </motion.button>
                            {i < KEY_CLUE_IDS.length - 1 && (
                              <div style={{ color: canSolve ? '#b89030' : '#282832', fontSize: '1.1rem', fontWeight: 600, flexShrink: 0, paddingBottom: 16, transition: 'color 0.4s' }}>+</div>
                            )}
                          </Fragment>
                        )
                      })}
                    </div>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

                    <p className="text-center mb-4" style={{
                      color: canSolve ? '#c8aa60' : '#484858',
                      fontSize: '0.78rem', letterSpacing: '0.2em', fontFamily: 'serif', transition: 'color 0.4s',
                    }}>
                      {PUZZLE_QUESTION}
                    </p>

                    <motion.button type="button" className="w-full" onClick={submitAnswer} disabled={!canSolve}
                      style={{ cursor: canSolve ? 'pointer' : 'default' }}
                      whileHover={canSolve ? { scale: 1.02 } : {}}
                      whileTap={canSolve ? { scale: 0.97 } : {}}
                    >
                      <div style={{
                        padding: '9px',
                        background: canSolve ? 'rgba(200,150,45,0.16)' : 'rgba(18,18,24,0.6)',
                        border: `1px solid ${canSolve ? 'rgba(200,150,45,0.65)' : 'rgba(40,40,52,0.45)'}`,
                        borderRadius: 7, color: canSolve ? '#e0b040' : '#30303c',
                        fontSize: '0.7rem', letterSpacing: '0.3em', fontFamily: 'sans-serif',
                        textAlign: 'center', boxShadow: canSolve ? '0 0 20px rgba(200,150,45,0.12)' : 'none',
                        transition: 'all 0.35s',
                      }}>
                        {canSolve ? '提交答案' : '需要蒐集更多線索'}
                      </div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 線索詳情視窗 */}
            <AnimatePresence mode="wait">
              {activeClue && (
                <motion.div
                  key={activeClue.id}
                  role="presentation"
                  className="fixed inset-0 z-100 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(5px)',
                  }}
                  onClick={() => setActiveClueId(null)}
                >
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="clue-modal-title"
                    initial={{ opacity: 0, y: 26, scale: 0.93 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 14, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: 'linear-gradient(155deg, #1e1710 0%, #120e07 100%)',
                      border: '1px solid rgba(200,160,55,0.38)',
                      borderRadius: 14,
                      width: 390,
                      maxWidth: '92vw',
                      maxHeight: '80vh',
                      padding: '26px 30px',
                      boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
                      overflowY: 'auto',
                    }}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3
                        id="clue-modal-title"
                        style={{
                          color: '#dcc070',
                          fontSize: '0.85rem',
                          letterSpacing: '0.2em',
                          fontFamily: 'serif',
                        }}
                      >
                        {activeClue.clueTitle}
                      </h3>
                      <button type="button" onClick={() => setActiveClueId(null)}
                        style={{ color: '#5a4820', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                    </div>

                    <div
                      className="mb-5 flex items-center justify-center"
                      style={{
                        background: 'rgba(0,0,0,0.55)',
                        border: '1px solid rgba(200,160,55,0.1)',
                        borderRadius: 8,
                        padding: 12,
                        minHeight: 180,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeClue.clueSrc}
                        alt={activeClue.clueTitle}
                        style={{
                          maxWidth: '100%',
                          maxHeight: 260,
                          objectFit: 'contain',
                          borderRadius: 4,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        padding: '11px 14px',
                        background: 'rgba(200,160,55,0.055)',
                        border: '1px solid rgba(200,160,55,0.16)',
                        borderRadius: 7,
                        marginBottom: 18,
                      }}
                    >
                      <p
                        style={{
                          color: '#9a7a38',
                          fontSize: '0.68rem',
                          letterSpacing: '0.14em',
                          fontFamily: 'sans-serif',
                          lineHeight: 1.75,
                        }}
                      >
                        💡　{activeClue.clueHint}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        activeInBriefcase ? removeFromBriefcase : addToBriefcase
                      }
                      disabled={!activeInBriefcase && briefcaseFull}
                      style={{
                        width: '100%',
                        padding: '9px',
                        background: activeInBriefcase
                          ? 'rgba(120,50,50,0.12)'
                          : 'rgba(200,160,55,0.1)',
                        border: `1px solid ${activeInBriefcase ? 'rgba(180,90,90,0.4)' : 'rgba(200,160,55,0.35)'}`,
                        borderRadius: 7,
                        color: activeInBriefcase ? '#c07070' : '#a88030',
                        fontSize: '0.65rem',
                        letterSpacing: '0.3em',
                        fontFamily: 'sans-serif',
                        cursor:
                          activeInBriefcase || !briefcaseFull
                            ? 'pointer'
                            : 'not-allowed',
                        opacity: !activeInBriefcase && briefcaseFull ? 0.45 : 1,
                      }}
                    >
                      {activeInBriefcase ? '從公事包移除' : '收入公事包'}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 三項關鍵線索齊備時的揭曉（opening 風格字幕，播畢自動進 chapter5） */}
            <AnimatePresence>
              {showReveal && (
                <motion.div
                  key="reveal"
                  role="presentation"
                  className="pointer-events-none fixed inset-0 z-110 flex items-center justify-center p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  style={{
                    background: 'rgba(0,0,0,0.78)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <div
                    className="relative z-10 flex min-h-[8rem] w-full items-center justify-center px-4"
                    style={{ maxWidth: 'min(92vw, 36rem)' }}
                  >
                    <AnimatePresence mode="wait">
                      {revealBeat === 'line1' && (
                        <motion.p
                          key="reveal-line1"
                          initial={{ opacity: 0, y: -28 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -18 }}
                          transition={{ duration: REVELATION_SUBTITLE_FADE_S, ease: 'easeOut' }}
                          className="absolute text-center font-serif"
                          style={REVELATION_SUBTITLE_STYLE}
                        >
                          {REVELATION_LINE1}
                        </motion.p>
                      )}
                      {revealBeat === 'line2' && (
                        <motion.p
                          key="reveal-line2"
                          initial={{ opacity: 0, x: -36 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 28 }}
                          transition={{ duration: REVELATION_SUBTITLE_FADE_S, ease: 'easeOut' }}
                          className="absolute text-center font-serif"
                          style={REVELATION_SUBTITLE_STYLE}
                        >
                          {REVELATION_LINE2A}
                          <br />
                          {REVELATION_LINE2B}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter title card（同 chapter1 開場） */}
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: '#000' }}
            exit={{ opacity: 0 }}
            transition={{ duration: INTRO_TITLE_FADE_S, ease: 'easeInOut' }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              style={{
                color: '#6a4820',
                fontSize: '0.55rem',
                letterSpacing: '0.55em',
                fontFamily: 'sans-serif',
                marginBottom: 14,
              }}
            >
              CHAPTER&nbsp;&nbsp;IV
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
              style={{
                color: '#e8c870',
                fontSize: '2.4rem',
                letterSpacing: '0.35em',
                fontFamily: 'serif',
                textShadow:
                  '0 0 50px rgba(232,200,112,0.3), 0 4px 20px rgba(0,0,0,0.9)',
              }}
            >
              柯老雄房間
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
