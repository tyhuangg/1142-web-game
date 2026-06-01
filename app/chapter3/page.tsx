'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

// ── Types ──────────────────────────────────────────────────────────────────

type Phase = 'explore' | 'puzzle' | 'dialogue'

type ModalContent = {
  title: string
  lines: string[]
  clue?: string
}

// ── Puzzle helpers ─────────────────────────────────────────────────────────

// 12 puzzle pieces in correct order (4 cols × 3 rows)
const PUZZLE_IMAGES = [
  '/image_CH3/puzzle/1-1.png',
  '/image_CH3/puzzle/1-2.png',
  '/image_CH3/puzzle/1-3.png',
  '/image_CH3/puzzle/1-4.png',
  '/image_CH3/puzzle/2-1.png',
  '/image_CH3/puzzle/2-2.png',
  '/image_CH3/puzzle/2-3.png',
  '/image_CH3/puzzle/2-4.png',
  '/image_CH3/puzzle/3-1.png',
  '/image_CH3/puzzle/3-2.png',
  '/image_CH3/puzzle/3-3.png',
  '/image_CH3/puzzle/3-4.png',
]

function isTilesSolved(tiles: number[]) {
  return tiles.every((t, i) => t === i + 1)
}

function makeShuffled(): number[] {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  } while (isTilesSolved(arr))
  return arr
}

// ── Dialogue beats ─────────────────────────────────────────────────────────

const DIALOGUE_BEATS = [
  { lines: ['這張照片背面似乎寫著字……'] },
  { lines: ['五寶', '89年生'] },
  { lines: ['她曾經住在這裡。'] },
  { lines: ['鄰居多次聽見哭聲。'] },
  { lines: ['但沒有人阻止。'] },
  { lines: ['最後……', '五寶死於長期虐待。'] },
]

// ── PulseNode (identical to CH1) ───────────────────────────────────────────

function PulseNode({ collected }: { collected: boolean }) {
  if (collected) {
    return (
      <div
        className="absolute top-1.5 right-1.5 rounded-full"
        style={{ width: 7, height: 7, background: '#50d060', boxShadow: '0 0 6px #50d060' }}
      />
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

// ── Main component ─────────────────────────────────────────────────────────

export default function Chapter3() {
  const router = useRouter()

  // Scene exploration state
  const [wardrobeClicks, setWardrobeClicks] = useState(0)
  const [dresserCollected, setDresserCollected] = useState(false)
  const [modal, setModal] = useState<ModalContent | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [notReadyHint, setNotReadyHint] = useState(false)

  // Phase
  const [phase, setPhase] = useState<Phase>('explore')

  // Puzzle state
  const [tiles, setTiles] = useState<number[]>(makeShuffled)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)
  const [puzzleSolved, setPuzzleSolved] = useState(false)

  // Dialogue state
  const [beat, setBeat] = useState(0)
  const [beatVisible, setBeatVisible] = useState(true)

  // Intro title card
  const [introVisible, setIntroVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), 3000)
    return () => clearTimeout(t)
  }, [])

  const wardrobeExplored = wardrobeClicks >= 2
  const canOpenPhoto = wardrobeExplored && dresserCollected
  const collectedCount = (wardrobeExplored ? 1 : 0) + (dresserCollected ? 1 : 0)

  // ── Interaction handlers ──

  function handleWardrobeClick() {
    if (wardrobeClicks === 0) {
      setWardrobeClicks(1)
      setModal({ title: '衣櫃', lines: ['衣櫃裡掛著幾件小女孩的衣服。'] })
    } else if (wardrobeClicks === 1) {
      setWardrobeClicks(2)
      setModal({
        title: '衣櫃',
        lines: ['衣服尺寸很小。', '像是國小女孩穿的。'],
        clue: '這裡曾經住過孩子。',
      })
    } else {
      setModal({
        title: '衣櫃',
        lines: ['衣服尺寸很小。', '像是國小女孩穿的。'],
        clue: '這裡曾經住過孩子。',
      })
    }
  }

  function handleDresserClick() {
    setDresserCollected(true)
    setModal({
      title: '梳妝台',
      lines: ['梳妝台上放著一張泛黃的紙條。', '', '雲芳：', '不要再讓五寶哭了。', '——娟娟'],
      clue: '發現關鍵名字：雲芳、娟娟',
    })
  }

  function handlePhotoClick() {
    if (!canOpenPhoto) {
      setNotReadyHint(true)
      setTimeout(() => setNotReadyHint(false), 2500)
      return
    }
    setPhase('puzzle')
  }

  function onTileDragStart(e: React.DragEvent, idx: number) {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onTileDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTarget(idx)
  }

  function onTileDragLeave() {
    setDropTarget(null)
  }

  function onTileDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    setDropTarget(null)
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); return }
    const next = [...tiles]
    ;[next[dragIdx], next[idx]] = [next[idx], next[dragIdx]]
    setTiles(next)
    setDragIdx(null)
    if (isTilesSolved(next)) {
      setPuzzleSolved(true)
      setTimeout(() => {
        setPhase('dialogue')
        setBeat(0)
        setBeatVisible(true)
      }, 1200)
    }
  }

  function onTileDragEnd() {
    setDragIdx(null)
    setDropTarget(null)
  }

  function advanceDialogue() {
    if (beat < DIALOGUE_BEATS.length - 1) {
      setBeatVisible(false)
      setTimeout(() => {
        setBeat(b => b + 1)
        setBeatVisible(true)
      }, 300)
    } else {
      router.push('/chapter4')
    }
  }

  // Keyboard shortcut for dialogue (matches cutscene pattern)
  useEffect(() => {
    if (phase !== 'dialogue') return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') advanceDialogue()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const currentBeat = DIALOGUE_BEATS[beat]
  const isLastBeat = beat === DIALOGUE_BEATS.length - 1

  // ── Hotspot definitions ──

  const HOTSPOTS: {
    id: string
    label: string
    collected: boolean
    style: CSSProperties
    onClick: () => void
  }[] = [
    {
      id: 'wardrobe',
      label: '衣櫃',
      collected: wardrobeExplored,
      style: { left: '12%', top: '12%', width: 88, height: 140 },
      onClick: handleWardrobeClick,
    },
    {
      id: 'dresser',
      label: '梳妝台',
      collected: dresserCollected,
      style: { left: '58%', top: '18%', width: 105, height: 100 },
      onClick: handleDresserClick,
    },
    {
      id: 'photo',
      label: '照片',
      collected: false,
      style: { left: '38%', top: '52%', width: 64, height: 52 },
      onClick: handlePhotoClick,
    },
  ]

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ background: '#16161c' }}>

      {/* ══════════════════════════════════════════
          TOP: Scene (56% height)
      ══════════════════════════════════════════ */}
      <div className="relative flex-none" style={{ height: '56%' }}>

        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/image_CH3/ch3_bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 50%',
            backgroundColor: '#1a120e',
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.06) 60%, rgba(22,22,28,0.75) 100%)',
          }}
        />

        {/* Chapter label */}
        <div
          className="absolute top-4 left-5 flex flex-col gap-0.5 pointer-events-none"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
        >
          <p style={{ color: '#806030', fontSize: '0.55rem', letterSpacing: '0.38em', fontFamily: 'sans-serif' }}>
            CHAPTER  III
          </p>
          <p style={{ color: '#e8c870', fontSize: '1rem', letterSpacing: '0.2em', fontFamily: 'serif' }}>
            金華街公寓
          </p>
        </div>

        {/* Clues badge (top-right) */}
        <div
          className="absolute top-4 right-5 flex flex-col gap-1 pointer-events-none"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
        >
          <p style={{ color: '#806030', fontSize: '0.55rem', letterSpacing: '0.3em', fontFamily: 'sans-serif', textAlign: 'right' }}>
            CLUES
          </p>
          <p style={{ color: '#e8c870', fontSize: '0.75rem', letterSpacing: '0.15em', fontFamily: 'serif', textAlign: 'right' }}>
            {collectedCount} / 2
          </p>
        </div>

        {/* Hotspots */}
        {HOTSPOTS.map(({ id, label, collected, style, onClick }) => {
          const hovered = hoveredId === id
          return (
            <motion.button
              key={id}
              className="absolute"
              style={{ ...style, cursor: 'pointer' }}
              onClick={onClick}
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

        {/* "Not ready" hint when photo clicked early */}
        <AnimatePresence>
          {notReadyHint && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
              style={{
                color: '#c8a040',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                fontFamily: 'sans-serif',
                textShadow: '0 2px 10px rgba(0,0,0,0.95)',
                background: 'rgba(6,5,14,0.85)',
                padding: '6px 18px',
                borderRadius: 4,
                border: '1px solid rgba(200,160,50,0.3)',
              }}
            >
              也許還有其他地方值得調查。
            </motion.p>
          )}
        </AnimatePresence>

        {/* Initial instruction hint */}
        <AnimatePresence>
          {collectedCount === 0 && !notReadyHint && (
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
          BOTTOM: Evidence + Notes (44% height)
      ══════════════════════════════════════════ */}
      <div
        className="flex-1 flex overflow-hidden"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >

        {/* ── Evidence Panel (left half) ── */}
        <div
          className="flex flex-col overflow-hidden"
          style={{ width: '50%', padding: '14px 16px', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-baseline gap-2 mb-3 flex-none">
            <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>
              Evidence
            </h2>
            <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>
              證據欄
            </span>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 min-h-0">
            {[
              { id: 'wardrobe', name: '衣櫃', collected: wardrobeExplored, image: '/image_CH3/wardrobe.png', onClick: handleWardrobeClick },
              { id: 'note', name: '梳妝台紙條', collected: dresserCollected, image: '/image_CH3/note.png', onClick: handleDresserClick },
            ].map(ev => (
              <motion.button
                key={ev.id}
                onClick={() => ev.collected && ev.onClick()}
                disabled={!ev.collected}
                className="relative flex items-center gap-3 rounded-lg overflow-hidden flex-1 min-h-0"
                style={{
                  background: ev.collected ? 'rgba(26,20,10,0.95)' : 'rgba(18,18,24,0.8)',
                  border: `1px solid ${ev.collected ? 'rgba(210,165,55,0.6)' : 'rgba(50,50,62,0.5)'}`,
                  boxShadow: ev.collected
                    ? '0 0 16px rgba(210,165,55,0.14), inset 0 1px 0 rgba(210,165,55,0.08)'
                    : 'none',
                  cursor: ev.collected ? 'pointer' : 'default',
                  padding: ev.collected ? '10px 14px' : 0,
                }}
                whileHover={ev.collected ? { scale: 1.02, y: -1 } : {}}
                whileTap={ev.collected ? { scale: 0.97 } : {}}
              >
                {ev.collected ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ev.image}
                      alt={ev.name}
                      style={{ width: 60, height: 60, objectFit: 'contain', flexShrink: 0 }}
                    />
                    <p style={{ color: '#a08838', fontSize: '0.6rem', letterSpacing: '0.14em', fontFamily: 'sans-serif' }}>
                      {ev.name}
                    </p>
                  </>
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                    style={{ opacity: 0.18 }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>?</span>
                    <span style={{ color: '#606075', fontSize: '0.5rem', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>
                      未發現
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Notes Panel (right half) ── */}
        <div className="flex flex-col overflow-hidden" style={{ width: '50%', padding: '14px 18px' }}>
          <div className="flex items-baseline gap-2 mb-3 flex-none">
            <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>
              Notes
            </h2>
            <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>
              調查筆記
            </span>
          </div>

          <div className="flex flex-col gap-2 flex-1 min-h-0">
            {[
              { label: '雲芳', sub: '紙條收件人', unlocked: dresserCollected },
              { label: '娟娟', sub: '紙條寄件人', unlocked: dresserCollected },
              { label: '五寶', sub: '照片中的孩子', unlocked: puzzleSolved },
            ].map(item => (
              <div
                key={item.label}
                className="flex-1 min-h-0 flex flex-col justify-center"
                style={{
                  padding: '8px 12px',
                  background: item.unlocked ? 'rgba(200,160,55,0.055)' : 'rgba(18,18,24,0.6)',
                  border: `1px solid ${item.unlocked ? 'rgba(200,160,55,0.2)' : 'rgba(40,40,52,0.45)'}`,
                  borderRadius: 7,
                  transition: 'all 0.4s',
                }}
              >
                <p
                  style={{
                    color: item.unlocked ? '#c8a040' : '#303040',
                    fontSize: '1rem',
                    letterSpacing: '0.2em',
                    fontFamily: 'serif',
                    transition: 'color 0.4s',
                  }}
                >
                  {item.unlocked ? item.label : '？？'}
                </p>
                <p
                  style={{
                    color: item.unlocked ? '#5a4820' : '#252530',
                    fontSize: '0.5rem',
                    letterSpacing: '0.18em',
                    fontFamily: 'sans-serif',
                    marginTop: 2,
                    transition: 'color 0.4s',
                  }}
                >
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                width: 340,
                maxHeight: '70vh',
                padding: '26px 30px',
                boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
                overflowY: 'auto',
              }}
            >
              <h3
                style={{
                  color: '#dcc070',
                  fontSize: '0.85rem',
                  letterSpacing: '0.2em',
                  fontFamily: 'serif',
                  marginBottom: 18,
                }}
              >
                {modal.title}
              </h3>

              <div style={{ marginBottom: 16 }}>
                {modal.lines.map((line, i) => (
                  <p
                    key={i}
                    style={{
                      color: '#d8cca8',
                      fontSize: '0.82rem',
                      letterSpacing: '0.14em',
                      fontFamily: 'serif',
                      lineHeight: 2.1,
                      minHeight: line === '' ? '0.8rem' : undefined,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {modal.clue && (
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
                    💡　{modal.clue}
                  </p>
                </div>
              )}

              <button
                onClick={() => setModal(null)}
                style={{
                  width: '100%',
                  padding: '9px',
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

      {/* ══════════════════════════════════════════
          Puzzle overlay
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'puzzle' && (
          <motion.div
            key="puzzle-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
          >
            <p
              style={{
                color: '#806030',
                fontSize: '0.55rem',
                letterSpacing: '0.45em',
                fontFamily: 'sans-serif',
                marginBottom: 10,
              }}
            >
              PUZZLE
            </p>
            <p
              style={{
                color: '#e8c870',
                fontSize: '0.95rem',
                letterSpacing: '0.3em',
                fontFamily: 'serif',
                marginBottom: 6,
              }}
            >
              拼湊照片
            </p>
            <p
              style={{
                color: '#5a4820',
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                fontFamily: 'sans-serif',
                marginBottom: 20,
              }}
            >
              {puzzleSolved ? '照片還原完成' : '拖曳拼圖片段，還原完整照片'}
            </p>

            {/* 4×3 drag-and-drop tile grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 80px)',
                gridTemplateRows: 'repeat(3, 80px)',
                gap: 3,
              }}
            >
              {tiles.map((tile, idx) => {
                const isDragging = dragIdx === idx
                const isTarget = dropTarget === idx
                const inPlace = tile === idx + 1
                return (
                  <div
                    key={idx}
                    draggable={!puzzleSolved}
                    onDragStart={e => onTileDragStart(e, idx)}
                    onDragOver={e => onTileDragOver(e, idx)}
                    onDragLeave={onTileDragLeave}
                    onDrop={e => onTileDrop(e, idx)}
                    onDragEnd={onTileDragEnd}
                    style={{
                      width: 80,
                      height: 80,
                      border: `2px solid ${
                        puzzleSolved
                          ? 'rgba(50,200,70,0.65)'
                          : isTarget
                          ? 'rgba(200,160,55,0.95)'
                          : inPlace
                          ? 'rgba(80,180,90,0.4)'
                          : 'rgba(60,50,32,0.6)'
                      }`,
                      borderRadius: 4,
                      overflow: 'hidden',
                      cursor: puzzleSolved ? 'default' : 'grab',
                      opacity: isDragging ? 0.4 : 1,
                      boxShadow: isTarget ? '0 0 14px rgba(200,160,55,0.45)' : 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s, opacity 0.15s',
                      position: 'relative',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PUZZLE_IMAGES[tile - 1]}
                      alt={`piece ${tile}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        pointerEvents: 'none',
                        filter: puzzleSolved ? 'brightness(1.05)' : 'brightness(0.9)',
                        transition: 'filter 0.3s',
                      }}
                    />
                    {isTarget && !puzzleSolved && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(200,160,55,0.18)',
                        pointerEvents: 'none',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>

            <AnimatePresence>
              {puzzleSolved && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{
                    color: '#50d060',
                    fontSize: '0.72rem',
                    letterSpacing: '0.32em',
                    fontFamily: 'sans-serif',
                    marginTop: 24,
                    textShadow: '0 0 14px rgba(80,208,96,0.5)',
                  }}
                >
                  ✓　照片還原完成
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          Dialogue overlay (cinematic, matches cutscene style)
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'dialogue' && (
          <motion.div
            key="dialogue-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-40 overflow-hidden select-none cursor-pointer"
            style={{ background: '#0a0808' }}
            onClick={advanceDialogue}
          >
            {/* ── Beat 0: ending-1 ── */}
            <AnimatePresence>
              {beat < DIALOGUE_BEATS.length - 1 && (
                <motion.div
                  key="bg-ending1"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/image_CH3/ending-1.png"
                    alt=""
                    style={{ maxWidth: '70%', maxHeight: '60%', objectFit: 'contain' }}
                  />
                  <div className="film-grain" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Beat 5: ending-2 ── */}
            <AnimatePresence>
              {beat === DIALOGUE_BEATS.length - 1 && (
                <motion.div
                  key="bg-ending2"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/image_CH3/ending-2.png"
                    alt=""
                    style={{ maxWidth: '70%', maxHeight: '60%', objectFit: 'contain' }}
                  />
                  <div className="film-grain" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cinematic bars */}
            <div className="absolute top-0 left-0 right-0" style={{ height: '10%', background: '#000' }} />
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '10%', background: '#000' }} />

            {/* Gradient for text area */}
            <div
              className="absolute left-0 right-0"
              style={{
                bottom: '10%',
                height: '40%',
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 70%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Dialogue text */}
            <div
              className="absolute left-0 right-0 flex flex-col items-center"
              style={{ bottom: 'calc(10% + 28px)', padding: '0 10%' }}
            >
              <AnimatePresence mode="wait">
                {beatVisible && (
                  <motion.div
                    key={beat}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    {currentBeat.lines.map((line, i) => (
                      <p
                        key={i}
                        style={{
                          color: '#d8cca8',
                          fontSize: '0.9rem',
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
              {DIALOGUE_BEATS.map((_, i) => (
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
                {isLastBeat ? '點擊進入下一段' : '點擊繼續'}
              </motion.p>
            </div>

            {/* Top bar: chapter label */}
            <div
              className="absolute top-0 left-0 right-0 flex items-center"
              style={{ height: '10%', padding: '0 28px' }}
            >
              <p
                style={{
                  color: '#5a4020',
                  fontSize: '0.55rem',
                  letterSpacing: '0.35em',
                  fontFamily: 'sans-serif',
                }}
              >
                CHAPTER  III　　金華街公寓
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          Chapter title card (intro)
      ══════════════════════════════════════════ */}
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
              CHAPTER  III
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
              金華街公寓
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
