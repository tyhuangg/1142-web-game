'use client'

import { useState, Fragment, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { fadeOutOpeningMusic } from '@/lib/openingAudio'

type EvidenceId = 'ledger' | 'glass' | 'engraved' | 'card'

type EvidenceData = {
  name: string
  icon: string
  title: string
  content: string[]
  clue: string
  image: string
}

const EVIDENCE: Record<EvidenceId, EvidenceData> = {
  ledger: {
    name: '訂位紀錄簿',
    icon: '📋',
    title: '五月花　訂位紀錄簿',
    content: [],
    clue: '305桌的客人名字被刻意劃掉了……',
    image: '/images/ch1_ledger.png',
  },
  glass: {
    name: '口紅酒杯',
    icon: '🍷',
    title: '305桌　酒杯',
    content: [],
    clue: '有人和娟娟喝過酒……',
    image: '/images/ch1_glass.png',
  },
  engraved: {
    name: '刻字酒杯',
    icon: '🥃',
    title: '專屬刻字酒杯',
    content: [],
    clue: '杯底三個字母，是某人姓名的縮寫。',
    image: '/images/ch1_engraved_glass.png',
  },
  card: {
    name: '會員卡',
    icon: '🎫',
    title: '五月花歌廳　貴賓會員卡',
    content: [],
    clue: '桌下掉落的一張會員卡……真相就在眼前。',
    image: '/images/ch1_card.png',
  },
}

const HOTSPOTS: { id: EvidenceId; label: string; style: CSSProperties }[] = [
  { id: 'ledger',   label: '訂位紀錄簿', style: { left: '78%', top: '75%', width: 94, height: 72 } },
  { id: 'glass',    label: '酒杯',       style: { left: '20%', top: '45%', width: 52, height: 88 } },
  { id: 'engraved', label: '刻字酒杯',   style: { left: '72%', top: '45%', width: 52, height: 88 } },
  { id: 'card',     label: '桌下',       style: { left: '9%', top: '70%', width: 80, height: 24 } },
]

const NEED_FOR_PUZZLE: EvidenceId[] = ['ledger', 'engraved', 'card']
const ALL_IDS: EvidenceId[] = ['ledger', 'glass', 'engraved', 'card']

/* ─── small reusable pieces ─── */

function PulseNode({ collected }: { collected: boolean }) {
  if (collected) {
    return (
      <div className="absolute top-1.5 right-1.5 rounded-full"
           style={{ width: 7, height: 7, background: '#50d060', boxShadow: '0 0 6px #50d060' }} />
    )
  }
  return (
    <motion.div
      className="absolute top-1.5 right-1.5 rounded-full"
      style={{ width: 7, height: 7, background: '#c8a030', boxShadow: '0 0 6px #c8a030' }}
      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.6, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ─── main component ─── */

export default function Chapter1() {
  const router = useRouter()
  const [inventory, setInventory] = useState<Set<EvidenceId>>(new Set())
  const [modal, setModal] = useState<EvidenceId | null>(null)
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState(false)
  const [hoveredId, setHoveredId] = useState<EvidenceId | null>(null)
  const [showEvidence, setShowEvidence] = useState(false)
  const [showLogic, setShowLogic] = useState(false)

  const canSolve = NEED_FOR_PUZZLE.every(id => inventory.has(id))
  const [introVisible, setIntroVisible] = useState(true)

  useEffect(() => {
    fadeOutOpeningMusic()
    const t = setTimeout(() => setIntroVisible(false), 3000)
    return () => clearTimeout(t)
  }, [])

  function pick(id: EvidenceId) {
    setInventory(prev => new Set([...prev, id]))
    setModal(id)
  }

  function submitAnswer() {
    if (answer.trim() === '柯老雄') {
      router.push('/cutscene1')
    } else {
      setWrong(true)
      setTimeout(() => setWrong(false), 600)
    }
  }

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden"
         style={{ background: '#16161c' }}>

      {/* ══════════════════════════════════════════
          Scene (fills all space above toolbar)
      ══════════════════════════════════════════ */}
      <div className="relative flex-1 min-h-0">

        {/* Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: "url('/images/ch1_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
        }} />
        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 60%, rgba(22,22,28,0.7) 100%)',
        }} />

        {/* Chapter label */}
        <div className="absolute top-4 left-5 flex flex-col gap-0.5 pointer-events-none"
             style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
          <p style={{ color: '#806030', fontSize: '0.55rem', letterSpacing: '0.38em', fontFamily: 'sans-serif' }}>
            CHAPTER  I
          </p>
          <p style={{ color: '#e8c870', fontSize: '1rem', letterSpacing: '0.2em', fontFamily: 'serif' }}>
            五月花歌廳
          </p>
        </div>

        {/* Collected count badge (top-right, Notes-style) */}
        <div className="absolute top-4 right-5 flex flex-col gap-1 pointer-events-none"
             style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
          <p style={{ color: '#806030', fontSize: '0.55rem', letterSpacing: '0.3em', fontFamily: 'sans-serif', textAlign: 'right' }}>
            CLUES
          </p>
          <p style={{ color: '#e8c870', fontSize: '0.75rem', letterSpacing: '0.15em', fontFamily: 'serif', textAlign: 'right' }}>
            {inventory.size} / {ALL_IDS.length}
          </p>
        </div>

        {/* Hotspots */}
        {HOTSPOTS.map(({ id, label, style }) => {
          const collected = inventory.has(id)
          const hovered = hoveredId === id
          return (
            <motion.button
              key={id}
              className="absolute"
              style={{ ...style, cursor: 'pointer' }}
              onClick={() => pick(id)}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              whileTap={{ scale: 0.93 }}
            >
              <PulseNode collected={collected} />

              {/* Hover border */}
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="absolute inset-0"
                    style={{
                      border: `2px solid ${collected ? 'rgba(80,210,80,0.75)' : 'rgba(220,175,60,0.85)'}`,
                      background: collected ? 'rgba(60,180,60,0.07)' : 'rgba(220,175,60,0.08)',
                      borderRadius: 5,
                      boxShadow: collected
                        ? '0 0 18px rgba(60,200,60,0.28)'
                        : '0 0 18px rgba(220,175,60,0.28)',
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Tooltip */}
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.12 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10"
                    style={{
                      background: 'rgba(6,5,14,0.92)',
                      border: '1px solid rgba(200,160,50,0.5)',
                      borderRadius: 4,
                      padding: '4px 12px',
                      color: '#d4b060',
                      fontSize: '0.6rem',
                      letterSpacing: '0.18em',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    {label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}

        {/* Hint */}
        <AnimatePresence>
          {inventory.size === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
              style={{
                color: '#c8a040',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                fontFamily: 'sans-serif',
                textShadow: '0 2px 10px rgba(0,0,0,0.95)',
              }}
            >
              點擊場景中發光的物件進行調查
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════
          Bottom toolbar
      ══════════════════════════════════════════ */}
      <div className="flex-none flex items-center gap-4 px-6"
           style={{ height: 'clamp(100px, 14vh, 150px)', background: 'rgba(8,7,14,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Evidence button */}
        <motion.button
          onClick={() => setShowEvidence(true)}
          className="flex-1 flex flex-col justify-center gap-3"
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(200,160,55,0.07)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            height: 'clamp(74px, 10vh, 110px)',
            background: 'rgba(200,160,55,0.04)',
            border: '1px solid rgba(200,160,55,0.18)',
            borderRadius: 10,
            padding: '0 22px',
            cursor: 'pointer',
          }}
        >
          <div className="flex items-baseline gap-2">
            <span style={{ color: '#dcc070', fontSize: '1rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>Evidence</span>
            <span style={{ color: '#5a4820', fontSize: '0.62rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>證據欄</span>
          </div>
          <div className="flex gap-2">
            {ALL_IDS.map(id => (
              <div key={id} style={{
                width: 9, height: 9, borderRadius: '50%',
                background: inventory.has(id) ? '#c8a030' : 'rgba(90,72,30,0.3)',
                boxShadow: inventory.has(id) ? '0 0 6px rgba(200,160,48,0.6)' : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </motion.button>

        {/* Logic Board button */}
        <motion.button
          onClick={() => setShowLogic(true)}
          className="flex-1 flex flex-col justify-center gap-3"
          whileHover={{ scale: 1.02, backgroundColor: canSolve ? 'rgba(200,150,45,0.1)' : 'rgba(200,160,55,0.07)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            height: 'clamp(74px, 10vh, 110px)',
            background: canSolve ? 'rgba(200,150,45,0.07)' : 'rgba(200,160,55,0.04)',
            border: `1px solid ${canSolve ? 'rgba(200,150,45,0.4)' : 'rgba(200,160,55,0.18)'}`,
            borderRadius: 10,
            padding: '0 22px',
            cursor: 'pointer',
            transition: 'border-color 0.4s, background 0.4s',
            boxShadow: canSolve ? '0 0 18px rgba(200,150,45,0.1)' : 'none',
          }}
        >
          <div className="flex items-baseline gap-2">
            <span style={{
              color: canSolve ? '#dcc070' : '#4a4858',
              fontSize: '1rem', letterSpacing: '0.22em', fontFamily: 'serif',
              transition: 'color 0.4s',
            }}>Logic Board</span>
            <span style={{ color: '#5a4820', fontSize: '0.62rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>推理板</span>
          </div>
          <AnimatePresence>
            {canSolve ? (
              <motion.span
                key="ready"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  color: '#c8a030', fontSize: '0.6rem', letterSpacing: '0.18em', fontFamily: 'sans-serif',
                }}
              >
                線索齊全　可提交答案
              </motion.span>
            ) : (
              <motion.span
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  color: '#3a3848', fontSize: '0.6rem', letterSpacing: '0.18em', fontFamily: 'sans-serif',
                }}
              >
                蒐集線索以解鎖推理
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ══════════════════════════════════════════
          Evidence panel modal
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showEvidence && (
          <motion.div
            key="evidence-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
            onClick={() => setShowEvidence(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'linear-gradient(155deg, #1e1710 0%, #120e07 100%)',
                border: '1px solid rgba(200,160,55,0.38)',
                borderRadius: 14,
                width: 'min(520px, 92vw)',
                padding: '24px 28px',
                boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
              }}
            >
              <div className="flex items-baseline justify-between mb-5">
                <div className="flex items-baseline gap-2">
                  <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>Evidence</h2>
                  <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>證據欄</span>
                </div>
                <button onClick={() => setShowEvidence(false)}
                        style={{ color: '#5a4820', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
              </div>

              <div className="grid grid-cols-2 gap-3" style={{ height: 'min(280px, 40vh)' }}>
                {ALL_IDS.map(id => {
                  const ev = EVIDENCE[id]
                  const collected = inventory.has(id)
                  return (
                    <motion.button
                      key={id}
                      onClick={() => { if (collected) { setShowEvidence(false); setModal(id) } }}
                      disabled={!collected}
                      className="relative flex flex-col items-center justify-between rounded-lg overflow-hidden"
                      style={{
                        background: collected ? 'rgba(26,20,10,0.95)' : 'rgba(18,18,24,0.8)',
                        border: `1px solid ${collected ? 'rgba(210,165,55,0.6)' : 'rgba(50,50,62,0.5)'}`,
                        boxShadow: collected ? '0 0 16px rgba(210,165,55,0.14), inset 0 1px 0 rgba(210,165,55,0.08)' : 'none',
                        cursor: collected ? 'pointer' : 'default',
                        padding: collected ? '8px 6px 6px' : 0,
                      }}
                      whileHover={collected ? { scale: 1.025, y: -1 } : {}}
                      whileTap={collected ? { scale: 0.97 } : {}}
                    >
                      {collected ? (
                        <>
                          <div className="flex-1 min-h-0 flex items-center justify-center w-full overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ev.image} alt={ev.name}
                                 style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                          </div>
                          <p style={{ color: '#a08838', fontSize: '0.52rem', letterSpacing: '0.12em', fontFamily: 'sans-serif', flexShrink: 0, marginTop: 4 }}>
                            {ev.name}
                          </p>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1" style={{ opacity: 0.18 }}>
                          <span style={{ fontSize: '1.6rem' }}>?</span>
                          <span style={{ color: '#606075', fontSize: '0.5rem', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>未發現</span>
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

      {/* ══════════════════════════════════════════
          Logic Board modal
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showLogic && (
          <motion.div
            key="logic-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
            onClick={() => setShowLogic(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'linear-gradient(155deg, #1e1710 0%, #120e07 100%)',
                border: '1px solid rgba(200,160,55,0.38)',
                borderRadius: 14,
                width: 'min(480px, 92vw)',
                padding: '24px 28px',
                boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
              }}
            >
              <div className="flex items-baseline justify-between mb-5">
                <div className="flex items-baseline gap-2">
                  <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>Logic Board</h2>
                  <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>推理板</span>
                </div>
                <button onClick={() => setShowLogic(false)}
                        style={{ color: '#5a4820', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
              </div>

              {/* Clue chain */}
              <div className="flex items-center justify-center gap-2 mb-5">
                {NEED_FOR_PUZZLE.map((id, i) => {
                  const ev = EVIDENCE[id]
                  const collected = inventory.has(id)
                  return (
                    <Fragment key={id}>
                      <motion.button
                        onClick={() => { if (collected) { setShowLogic(false); setModal(id) } }}
                        disabled={!collected}
                        className="flex flex-col items-center gap-1"
                        style={{ cursor: collected ? 'pointer' : 'default' }}
                        whileHover={collected ? { scale: 1.05, y: -2 } : {}}
                      >
                        <div style={{
                          width: 58, height: 58,
                          background: collected ? 'rgba(22,16,8,0.95)' : 'rgba(18,18,24,0.7)',
                          border: `1px solid ${collected ? 'rgba(210,165,55,0.65)' : 'rgba(45,45,58,0.6)'}`,
                          borderRadius: 7,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden',
                          boxShadow: collected ? '0 0 12px rgba(210,165,55,0.18)' : 'none',
                          opacity: collected ? 1 : 0.28,
                          flexShrink: 0,
                        }}>
                          {collected ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={ev.image} alt={ev.name}
                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ color: '#4a4a5a', fontSize: '1.1rem', fontFamily: 'serif' }}>?</span>
                          )}
                        </div>
                        <span style={{
                          color: collected ? '#9a7e38' : '#30303c',
                          fontSize: '0.5rem', letterSpacing: '0.08em', fontFamily: 'sans-serif',
                          maxWidth: 62, textAlign: 'center',
                        }}>
                          {ev.name}
                        </span>
                      </motion.button>
                      {i < NEED_FOR_PUZZLE.length - 1 && (
                        <div style={{
                          color: canSolve ? '#b89030' : '#282832',
                          fontSize: '1rem', flexShrink: 0, paddingBottom: 16, transition: 'color 0.4s',
                        }}>→</div>
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
                305桌的客人是誰？
              </p>

              <motion.div
                className="mb-3"
                animate={wrong ? { x: [-6, 6, -6, 6, 0] } : { x: 0 }}
                transition={{ duration: 0.32 }}
              >
                <input
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  disabled={!canSolve}
                  placeholder={canSolve ? '輸入名字……' : '需蒐集更多線索'}
                  style={{
                    width: '100%', padding: '9px 14px',
                    background: wrong ? 'rgba(180,50,50,0.09)' : (canSolve ? 'rgba(6,5,12,0.7)' : 'rgba(14,14,20,0.5)'),
                    border: `1px solid ${wrong ? 'rgba(210,70,70,0.6)' : (canSolve ? 'rgba(200,155,55,0.42)' : 'rgba(40,40,52,0.55)')}`,
                    borderRadius: 7, color: canSolve ? '#e8dcc0' : '#30303c',
                    fontSize: '0.88rem', letterSpacing: '0.28em', fontFamily: 'serif',
                    outline: 'none', textAlign: 'center', boxSizing: 'border-box',
                    transition: 'border-color 0.3s, color 0.3s',
                  }}
                />
              </motion.div>

              {wrong && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-3"
                  style={{ color: '#a04040', fontSize: '0.58rem', letterSpacing: '0.14em', fontFamily: 'sans-serif' }}
                >
                  答案不對，再想想……
                </motion.p>
              )}

              <motion.button
                className="w-full"
                onClick={() => canSolve && submitAnswer()}
                disabled={!canSolve}
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
                  textAlign: 'center',
                  boxShadow: canSolve ? '0 0 20px rgba(200,150,45,0.12)' : 'none',
                  transition: 'all 0.35s',
                }}>
                  提交答案
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          Evidence detail modal (overlay)
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {modal && (
          <motion.div
            key="ev-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'linear-gradient(155deg, #1e1710 0%, #120e07 100%)',
                border: '1px solid rgba(200,160,55,0.38)',
                borderRadius: 14,
                width: 'min(390px, 92vw)',
                maxHeight: '80vh',
                padding: '26px 30px',
                boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 style={{ color: '#dcc070', fontSize: '0.85rem', letterSpacing: '0.2em', fontFamily: 'serif' }}>
                  {EVIDENCE[modal].title}
                </h3>
                <button
                  onClick={() => setModal(null)}
                  style={{ color: '#5a4820', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
                >✕</button>
              </div>

              {/* Evidence image */}
              <div className="flex items-center justify-center mb-5" style={{
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(200,160,55,0.1)',
                borderRadius: 8,
                padding: 12,
                minHeight: 180,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={EVIDENCE[modal].image}
                  alt={EVIDENCE[modal].name}
                  style={{ maxWidth: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 4 }}
                />
              </div>

              {/* Clue */}
              <div style={{
                padding: '11px 14px',
                background: 'rgba(200,160,55,0.055)',
                border: '1px solid rgba(200,160,55,0.16)',
                borderRadius: 7,
                marginBottom: 18,
              }}>
                <p style={{ color: '#9a7a38', fontSize: '0.68rem', letterSpacing: '0.14em', fontFamily: 'sans-serif', lineHeight: 1.75 }}>
                  💡　{EVIDENCE[modal].clue}
                </p>
              </div>

              <button
                onClick={() => setModal(null)}
                style={{
                  width: '100%', padding: '9px',
                  background: 'rgba(200,160,55,0.1)',
                  border: '1px solid rgba(200,160,55,0.35)',
                  borderRadius: 7,
                  color: '#a88030',
                  fontSize: '0.65rem',
                  letterSpacing: '0.3em',
                  fontFamily: 'sans-serif',
                  cursor: 'pointer',
                }}
              >
                收入口袋
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter title card */}
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            style={{ background: '#000' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
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
              CHAPTER  I
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
                textShadow: '0 0 50px rgba(232,200,112,0.3), 0 4px 20px rgba(0,0,0,0.9)',
              }}
            >
              五月花歌廳
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
