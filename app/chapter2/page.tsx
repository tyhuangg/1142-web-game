'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const CUPS = [
  { id: 1, label: '杯子 1', hasLipstick: true, description: '杯緣留有鮮紅且凌亂的口紅印。', image: '/images/ch2_glass1.jpg', position: { left: '14%', top: '12%' } },
  { id: 2, label: '杯子 2', hasLipstick: true, description: '杯緣留有口紅印。', image: '/images/ch2_glass2.jpg', position: { left: '32%', top: '10%' } },
  { id: 3, label: '杯子 3', hasLipstick: false, description: '口紅印已經暈開。', image: '/images/ch2_glass3.jpg', position: { left: '50%', top: '14%' } },
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
  const [isSolved, setIsSolved] = useState(false)
  const [endingVisible, setEndingVisible] = useState(false)
  const [endingIndex, setEndingIndex] = useState(0)
  const [introVisible, setIntroVisible] = useState(true)
  const dripAudio = useRef<HTMLAudioElement | null>(null)
  const drip2Audio = useRef<HTMLAudioElement | null>(null)
  const advanceLock = useRef(false)

  const selectedCup = selectedCupId ? CUPS.find((cup) => cup.id === selectedCupId) ?? null : null
  const collectedLips = TARGET_IDS.filter((id) => inventory.has(id)).length
  const canSolve = collectedLips === TARGET_IDS.length

  function adjustAnswer(delta: number) {
    const cur = parseInt(answer || '0', 10) || 0
    const next = Math.max(0, Math.min(8, cur + delta))
    setAnswer(String(next))
  }

  function collectCup(id: number) {
    // 检查是否是错误的杯子（id 3 或 4）
    if (id === 3 || id === 4) {
      setWrong(true)
      window.setTimeout(() => setWrong(false), 1500)
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
      }, 2500)
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

    const startDrip = () => {
      if (!isSolved) {
        drip2Audio.current?.pause()
        dripAudio.current?.play().catch(() => {})
      }
    }

    const playOnInteraction = () => {
      startDrip()
      window.removeEventListener('pointerdown', playOnInteraction)
    }

    window.addEventListener('pointerdown', playOnInteraction)

    return () => {
      window.removeEventListener('pointerdown', playOnInteraction)
      dripAudio.current?.pause()
      drip2Audio.current?.pause()
    }
  }, [isSolved])

  useEffect(() => {
    if (isSolved) {
      dripAudio.current?.pause()
      if (drip2Audio.current) {
        drip2Audio.current.currentTime = 0
        drip2Audio.current.play().catch(() => {})
      }
    } else {
      drip2Audio.current?.pause()
      dripAudio.current?.play().catch(() => {})
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

      <div className="absolute inset-x-0 top-24 bottom-[38%] z-10">
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
                width: 110,
                height: 110,
              }}
            >
              <img src={cup.image} alt={cup.label} className="h-full w-full object-contain" />
            </motion.button>
          )
        })}
        {/* 閃爍的黃底提示區塊（顯示在照片區下方） */}
        <div className="absolute left-1/2 bottom-4 z-20 -translate-x-1/2 transform">
          <div className="animate-pulse rounded-xl bg-amber-300/90 px-6 py-2 text-sm font-semibold text-slate-950 shadow-lg">
            請注意不同酒杯的杯緣
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-[38%] flex border-t border-white/10 bg-black/70 backdrop-blur-sm">
        <div className="flex flex-col overflow-hidden" style={{ width: '50%', padding: '14px 16px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-baseline gap-2 mb-3 flex-none">
            <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em' }}>
              Evidence
            </h2>
            <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em' }}>
              證據欄
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {CUPS.slice(0, 8).map((cup) => {
              const collected = inventory.has(cup.id)
              return (
                <button
                  key={cup.id}
                  onClick={() => collected && setSelectedCupId(cup.id)}
                  disabled={!collected}
                  className={`h-24 rounded-lg border p-2 text-left transition ${
                    collected ? 'border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/15' : 'border-white/10 bg-white/5 text-slate-500'
                  }`}
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-slate-400">{cup.label}</p>
                  <p className={`mt-2 text-sm font-semibold ${collected ? 'text-slate-100' : 'text-slate-500'}`}>
                    {collected ? '已收集' : '未收集'}
                  </p>
                </button>
              )
            })}
          </div>



            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 relative">
            {selectedCup ? (
              <>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{selectedCup.description}</p>
                {/* 遊戲風格提示：根據是否有口紅顯示不同提示 */}
                <div className="mt-4 inline-flex items-center gap-3 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${selectedCup.hasLipstick ? 'bg-amber-400/20' : 'bg-slate-700/20'} animate-bounce`}>💡</div>
                  <div>
                    {selectedCup.hasLipstick ? (
                      <p className="font-semibold">提示：杯緣有口紅印，可能屬於受害者。</p>
                    ) : (
                      <p className="font-semibold">提示：杯緣乾淨，可能是施暴者所用。</p>
                    )}
                    <p className="text-xs text-slate-400">（可作為推理的輔助線索）</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400">點擊任意杯子查看它的線索，並將它收入囊中。</p>
            )}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden" style={{ width: '50%', padding: '14px 18px' }}>
          <div className="flex items-baseline gap-2 mb-3 flex-none">
            <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em' }}>
              Logic Board
            </h2>
            <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em' }}>
              推理板
            </span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
            <div className="space-y-3 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">她喝了</span>
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={!canSolve}
                  placeholder=""
                  className="w-20 rounded-xl border border-amber-500/30 bg-black/40 px-3 py-2 text-center text-2xl text-amber-100 outline-none"
                />
                <span className="text-lg">杯</span>
              </div>
              <button
                onClick={submitAnswer}
                disabled={!canSolve}
                className={`w-full rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.2em] transition ${
                  canSolve ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-white/5 text-slate-500 cursor-not-allowed'
                }`}
              >
                提交答案
              </button>
              {wrong && <p className="text-sm text-red-300">答案不對，再確認你收集到的線索。</p>}
            </div>

            <AnimatePresence>
              {isSolved && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="rounded-3xl border border-emerald-500/40 bg-emerald-900/30 p-5 text-amber-100 flex-shrink-0"
                >
                  <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">解謎完成</p>
                  <p className="mt-2 text-base font-serif leading-relaxed">真相：柯老雄在三一三號房強迫娟娟飲下六杯紹興酒。</p> 

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

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


