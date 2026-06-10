'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const CUPS = [
  { id: 1, label: '杯子 1', hasLipstick: true, description: '杯緣留有鮮紅且凌亂的口紅印。', image: '/images/ch2_glass1.jpg', position: { left: '14%', top: '12%' } },
  { id: 2, label: '杯子 2', hasLipstick: true, description: '杯緣留有口紅印。', image: '/images/ch2_glass2.jpg', position: { left: '32%', top: '10%' } },
  { id: 3, label: '杯子 3', hasLipstick: false, description: '杯緣乾淨，沒有任何口紅痕跡。', image: '/images/ch2_glass3.jpg', position: { left: '50%', top: '14%' } },
  { id: 4, label: '杯子 4', hasLipstick: false, description: '杯口殘留著淡淡的血絲與紅印。', image: '/images/ch2_glass4.jpg', position: { left: '68%', top: '11%' } },
  { id: 5, label: '杯子 5', hasLipstick: true, description: '杯身濕漉漉的，口紅印清晰可見。', image: '/images/ch2_glass5.jpg', position: { left: '18%', top: '42%' } },
  { id: 6, label: '杯子 6', hasLipstick: true, description: '杯口碎裂，好似娟涓的心。', image: '/images/ch2_glass6.jpg', position: { left: '36%', top: '40%' } },
  { id: 7, label: '杯子 7', hasLipstick: true, description: '最後一杯酒，印記顯得支離破碎。', image: '/images/ch2_glass7.jpg', position: { left: '56%', top: '40%' } },
  { id: 8, label: '杯子 8', hasLipstick: true, description: '這杯酒似乎混雜了淚水。', image: '/images/ch2_glass8.jpg', position: { left: '74%', top: '38%' } },
]

const TARGET_IDS = CUPS.filter((cup) => cup.hasLipstick).map((cup) => cup.id)

export default function Chapter2() {
  const router = useRouter()
  const [inventory, setInventory] = useState<Set<number>>(new Set())
  const [selectedCupId, setSelectedCupId] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState(false)
  const [cupError, setCupError] = useState(false)
  const [excluded, setExcluded] = useState<Set<number>>(new Set())
  const [isSolved, setIsSolved] = useState(false)
  const [endingVisible, setEndingVisible] = useState(false)
  const [endingIndex, setEndingIndex] = useState(0)
  const [introVisible, setIntroVisible] = useState(true)
  const [showEvidence, setShowEvidence] = useState(false)
  const [showLogic, setShowLogic] = useState(false)
  const dripAudio = useRef<HTMLAudioElement | null>(null)
  const drip2Audio = useRef<HTMLAudioElement | null>(null)
  const advanceLock = useRef(false)

  const selectedCup = selectedCupId ? CUPS.find((cup) => cup.id === selectedCupId) ?? null : null
  const collectedLips = TARGET_IDS.filter((id) => inventory.has(id)).length
  const canSolve = collectedLips === TARGET_IDS.length

  function collectCup(id: number) {
    if (id === 3 || id === 4) {
      setExcluded((prev) => new Set(prev).add(id))
      setCupError(true)
      window.setTimeout(() => setCupError(false), 1500)
      return
    }
    setInventory((prev) => new Set(prev).add(id))
    setSelectedCupId(id)
  }

  function submitAnswer() {
    if (answer.trim() === '6' && canSolve) {
      setIsSolved(true)
      // 延迟 8 秒後顯示結局頁面
      window.setTimeout(() => {
        setEndingVisible(true)
        setEndingIndex(0)
      }, 5000)
      return
    }

    setWrong(true)
    window.setTimeout(() => setWrong(false), 1500)
  }

  // keyboard navigation for ending pages
  useEffect(() => {
    if (!endingVisible) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        if (advanceLock.current) return
        if (endingIndex < 2) {
          advanceLock.current = true
          setEndingIndex(i => i + 1)
          window.setTimeout(() => {
            advanceLock.current = false
          }, 700)
        } else {
          router.push('/chapter3')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [endingVisible, endingIndex, router])

  useEffect(() => {
    dripAudio.current = new Audio('/audio/ch2_drip.mp3')
    dripAudio.current.loop = true
    dripAudio.current.volume = 0.65

    drip2Audio.current = new Audio('/audio/ch2_drip2.mp3')
    drip2Audio.current.loop = true
    drip2Audio.current.volume = 0.65

    const playOnInteraction = () => {
      dripAudio.current?.play().catch(() => {})
      window.removeEventListener('pointerdown', playOnInteraction)
    }

    window.addEventListener('pointerdown', playOnInteraction)

    return () => {
      window.removeEventListener('pointerdown', playOnInteraction)
      dripAudio.current?.pause()
      drip2Audio.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (!isSolved) return
    dripAudio.current?.pause()
    if (drip2Audio.current) {
      drip2Audio.current.currentTime = 0
      drip2Audio.current.play().catch(() => {})
    }
  }, [isSolved])

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#060506] text-slate-100" style={{ fontFamily: 'serif' }}>
      <div
        className="absolute inset-0 bg-[url('/images/ch2_washroom_bg2.jpg')] bg-cover bg-center"
        style={{ filter: 'contrast(1.1) brightness(0.74)' }}
      />
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />

      <div className="absolute top-4 left-5 flex flex-col gap-0.5 pointer-events-none" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
        <p style={{ color: '#806030', fontSize: '0.55rem', letterSpacing: '0.38em' }}>
          CHAPTER  II
        </p>
        <p style={{ color: '#e8c870', fontSize: '1rem', letterSpacing: '0.2em' }}>
          洗手間的倒影
        </p>
      </div>

      <div className="absolute inset-x-0 top-24 z-10" style={{ bottom: 'clamp(100px, 14vh, 150px)' }}>
        {CUPS.map((cup) => {
          const collected = inventory.has(cup.id)
          const selected = selectedCupId === cup.id
          return (
            <motion.button
              key={cup.id}
              onClick={() => collectCup(cup.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`absolute flex items-center justify-center overflow-hidden rounded-xl border transition-all ${
                collected ? 'border-amber-400/70 shadow-[0_0_32px_rgba(245,158,11,0.18)]' : 'border-white/15'
              } ${selected ? 'ring-2 ring-amber-300/80' : ''}`}
              style={{
                left: cup.position.left,
                top: cup.position.top,
                width: 'clamp(100px, 10vw, 130px)',
                height: 'clamp(100px, 10vw, 130px)',
              }}
            >
              <img src={cup.image} alt={cup.label} className="h-full w-full object-contain" />
            </motion.button>
          )
        })}
        {/* 閃爍的黃底提示區塊（顯示在照片區下方） */}
        <div className="absolute left-1/2 bottom-4 z-20 -translate-x-1/2 transform">
          <AnimatePresence mode="wait">
            {cupError ? (
              <motion.div
                key="cup-error"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl bg-red-500/90 px-6 py-2 text-sm font-semibold text-white shadow-lg"
              >
                這個杯子沒有口紅印，不是目標證物
              </motion.div>
            ) : (
              <motion.div
                key="cup-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="animate-pulse rounded-xl bg-amber-300/90 px-6 py-2 text-sm font-semibold text-slate-950 shadow-lg"
              >
                請注意不同酒杯的杯緣
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── 底部工具列 ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-4 px-6"
           style={{ height: 'clamp(100px, 14vh, 150px)', background: 'rgba(8,7,14,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Evidence button */}
        <motion.button
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
            {CUPS.map(cup => (
              <div key={cup.id} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: inventory.has(cup.id) ? '#c8a030' : excluded.has(cup.id) ? 'rgba(180,60,60,0.5)' : 'rgba(90,72,30,0.3)',
                boxShadow: inventory.has(cup.id) ? '0 0 5px rgba(200,160,48,0.6)' : 'none',
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
            borderRadius: 10, padding: '0 22px', cursor: 'pointer',
            transition: 'border-color 0.4s, background 0.4s',
            boxShadow: canSolve ? '0 0 18px rgba(200,150,45,0.1)' : 'none',
          }}
        >
          <div className="flex items-baseline gap-2">
            <span style={{ color: canSolve ? '#dcc070' : '#4a4858', fontSize: '1rem', letterSpacing: '0.22em', fontFamily: 'serif', transition: 'color 0.4s' }}>Logic Board</span>
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
                蒐集所有杯子以解鎖推理
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
                width: 'min(560px, 92vw)', padding: '24px 28px', boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
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
              <div className="grid grid-cols-4 gap-2 mb-4">
                {CUPS.map(cup => {
                  const collected = inventory.has(cup.id)
                  const isExcluded = excluded.has(cup.id)
                  return (
                    <button key={cup.id}
                      onClick={() => { if (collected) setSelectedCupId(cup.id) }}
                      disabled={!collected && !isExcluded}
                      className={`rounded-lg border p-2 text-left transition ${
                        collected ? 'border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/15'
                        : isExcluded ? 'border-slate-600/50 bg-slate-800/40'
                        : 'border-white/10 bg-white/5'
                      }`}
                      style={{ height: 72 }}
                    >
                      <p style={{ fontSize: '0.55rem', letterSpacing: '0.18em', color: isExcluded ? '#6b7280' : '#94a3b8', textDecoration: isExcluded ? 'line-through' : 'none' }}>
                        {cup.label}
                      </p>
                      <p style={{ marginTop: 6, fontSize: '0.65rem', fontWeight: 600, color: collected ? '#f1f5f9' : isExcluded ? '#6b7280' : '#6b7280' }}>
                        {collected ? '已收集' : isExcluded ? '已排除' : '未檢查'}
                      </p>
                    </button>
                  )
                })}
              </div>
              {selectedCup && (
                <div style={{ padding: '12px 14px', background: 'rgba(200,160,55,0.055)', border: '1px solid rgba(200,160,55,0.16)', borderRadius: 8 }}>
                  <p style={{ color: '#d8cca8', fontSize: '0.72rem', letterSpacing: '0.12em', fontFamily: 'serif', lineHeight: 1.8 }}>
                    {selectedCup.description}
                  </p>
                  <p style={{ color: '#9a7a38', fontSize: '0.6rem', letterSpacing: '0.12em', fontFamily: 'sans-serif', marginTop: 6 }}>
                    💡　{selectedCup.hasLipstick ? '杯緣有口紅印，可能屬於受害者。' : '杯緣乾淨，可能是施暴者所用。'}
                  </p>
                </div>
              )}
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
                width: 'min(420px, 92vw)', padding: '24px 28px', boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
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

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

              <div className="flex items-center justify-center gap-3 mb-5">
                <span style={{ color: '#d8cca8', fontSize: '1rem', letterSpacing: '0.14em', fontFamily: 'serif' }}>娟娟喝了</span>
                <input
                  type="number"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  disabled={!canSolve}
                  placeholder="?"
                  style={{
                    width: 72, padding: '8px',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(200,168,72,0.3)',
                    borderRadius: 8, color: '#e8c870', fontSize: '1.4rem',
                    textAlign: 'center', outline: 'none', fontFamily: 'serif',
                  }}
                />
                <span style={{ color: '#d8cca8', fontSize: '1rem', letterSpacing: '0.14em', fontFamily: 'serif' }}>杯</span>
              </div>

              <motion.button className="w-full" onClick={submitAnswer} disabled={!canSolve}
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
                  textAlign: 'center', transition: 'all 0.35s',
                }}>
                  {canSolve ? '提交答案' : '需蒐集所有杯子'}
                </div>
              </motion.button>

              {wrong && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-3"
                  style={{ color: '#a04040', fontSize: '0.58rem', letterSpacing: '0.14em', fontFamily: 'sans-serif' }}>
                  答案不對，再確認你收集到的線索。
                </motion.p>
              )}

              <AnimatePresence>
                {isSolved && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 16, padding: '14px', background: 'rgba(16,80,40,0.25)', border: '1px solid rgba(60,180,100,0.3)', borderRadius: 8 }}>
                    <p style={{ color: '#6ee7b7', fontSize: '0.52rem', letterSpacing: '0.3em', fontFamily: 'sans-serif', marginBottom: 6 }}>解謎完成</p>
                    <p style={{ color: '#d8cca8', fontSize: '0.72rem', letterSpacing: '0.1em', fontFamily: 'serif', lineHeight: 1.8 }}>
                      真相：柯老雄在三一三號房強迫娟娟飲下六杯紹興酒。
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {endingVisible && (
          <motion.div
            key={`ending-${endingIndex}`}
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{ background: 'transparent' }}
            onClick={() => {
              if (advanceLock.current) return
              if (endingIndex < 2) {
                advanceLock.current = true
                setEndingIndex(i => i + 1)
                window.setTimeout(() => {
                  advanceLock.current = false
                }, 700)
              } else {
                router.push('/chapter3')
              }
            }}
          >
            {/* backdrop to dim the game scene beneath, but keep it visible */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            {endingIndex === 0 && (
              <motion.div
                key="end-1"
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65 }}
              >
                <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="mx-auto overflow-hidden shadow-2xl"
                    style={{
                      width: 'min(42vh, 80vw)',
                      height: 'min(42vh, 80vw)',
                      WebkitMaskImage: 'radial-gradient(circle at center, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
                      maskImage: 'radial-gradient(circle at center, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
                    }}
                  >
                    <img src="/images/ch1_glass.png" alt="酒杯特寫" className="h-full w-full object-cover" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.55 }}
                    className="max-w-2xl"
                  >
                    <p className="text-lg font-serif text-[#e8c870]" style={{ letterSpacing: '0.24em', lineHeight: 1.2 }}>
                      六個刺眼的口紅印
                    </p>
                    {/* <p className="mt-4 text-sm leading-relaxed text-[#d8cca8]" style={{ letterSpacing: '0.16em', lineHeight: 2 }}>
                      畫面慢慢聚焦到洗手台上帶血和口紅印的酒杯，光線邊緣泛著冷冽的光。
                    </p> */}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {endingIndex === 1 && (
              <motion.div
                key="end-2"
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65 }}
              >
                <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="mx-auto overflow-hidden shadow-2xl"
                    style={{
                      width: 'min(42vh, 80vw)',
                      height: 'min(42vh, 80vw)',
                      WebkitMaskImage: 'radial-gradient(circle at center, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
                      maskImage: 'radial-gradient(circle at center, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
                    }}
                  >
                    <img src="/images/ch2_juan.jpg" alt="娟娟特寫" className="h-full w-full object-cover" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.55 }}
                    className="max-w-2xl"
                  >
                    <p className="text-lg font-serif text-[#f2e7d1]" style={{ letterSpacing: '0.22em', lineHeight: 1.25 }}>
                      在無數個寒冷夜晚裡，她被一杯杯灌進了無止盡的痛苦。
                    </p>
                    {/* <p className="mt-4 text-sm leading-relaxed text-[#b7b1a2]" style={{ letterSpacing: '0.16em', lineHeight: 2 }}>
                      畫面從特寫慢慢拉遠，娟娟的面容一片模糊，只有雪白杯緣還閃著餘光。
                    </p> */}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {endingIndex === 2 && (
              <motion.div
                key="end-3"
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65 }}
              >
                <div className="absolute inset-0 bg-black/96" />
                <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-lg font-serif text-[#f8f4e6]"
                    style={{ letterSpacing: '0.2em', lineHeight: 1.5 }}
                  >
                    命運多舛的靈魂，只能在黑夜裡默默等待下一個光亮。
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="text-sm leading-relaxed text-[#c8c0a6] font-serif"
                    style={{ letterSpacing: '0.14em', lineHeight: 2 }}
                  >
                    片刻後，金華街的光線會帶領你到新的篇章。
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="text-xs uppercase tracking-[0.35em] text-[#8d8468]"
                  >
                    請按任意鍵繼續
                  </motion.p>
                </div>
              </motion.div>
            )}
            <motion.div
              className="absolute right-6 bottom-6 pointer-events-none"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[#b8a87d]">
                點擊繼續
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter title card (intro) copied from chapter3 */}
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none"
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
              CHAPTER  II
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
              洗手間的倒影
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


