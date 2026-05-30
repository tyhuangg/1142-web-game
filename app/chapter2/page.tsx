'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const CUPS = [
  { id: 1, label: '杯子 1', hasLipstick: true, description: '杯緣留有鮮紅且凌亂的口紅印。', image: '/images/ch2_glass1.jpg', position: { left: '14%', top: '12%' } },
  { id: 2, label: '杯子 2', hasLipstick: false, description: '杯緣乾淨，只有一些指紋。', image: '/images/ch2_glass1.jpg', position: { left: '32%', top: '10%' } },
  { id: 3, label: '杯子 3', hasLipstick: true, description: '口紅印已經暈開，顯示飲用者情緒不穩。', image: '/images/ch2_glass3.jpg', position: { left: '50%', top: '14%' } },
  { id: 4, label: '杯子 4', hasLipstick: true, description: '杯口殘留著淡淡的血絲與紅印。', image: '/images/ch2_glass4.jpg', position: { left: '68%', top: '11%' } },
  { id: 5, label: '杯子 5', hasLipstick: true, description: '杯身濕漉漉的，口紅印清晰可見。', image: '/images/ch2_glass5.jpg', position: { left: '18%', top: '42%' } },
  { id: 6, label: '杯子 6', hasLipstick: false, description: '完全乾淨的杯子，應該是施暴者喝的。', image: '/images/ch2_glass6.jpg', position: { left: '36%', top: '40%' } },
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

  const selectedCup = selectedCupId ? CUPS.find((cup) => cup.id === selectedCupId) ?? null : null
  const collectedLips = TARGET_IDS.filter((id) => inventory.has(id)).length
  const canSolve = collectedLips === TARGET_IDS.length

  function collectCup(id: number) {
    setInventory((prev) => new Set(prev).add(id))
    setSelectedCupId(id)
  }

  function submitAnswer() {
    if (answer.trim() === '6' && canSolve) {
      setIsSolved(true)
      return
    }

    setWrong(true)
    window.setTimeout(() => setWrong(false), 700)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#060506] text-slate-100">
      <div
        className="absolute inset-0 bg-[url('/images/ch2_washroom_bg2.jpg')] bg-cover bg-center"
        style={{ filter: 'contrast(1.1) brightness(0.74)' }}
      />
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />

      <div className="absolute top-4 left-5 flex flex-col gap-0.5 pointer-events-none" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
        <p style={{ color: '#806030', fontSize: '0.55rem', letterSpacing: '0.38em', fontFamily: 'sans-serif' }}>
          CHAPTER  II
        </p>
        <p style={{ color: '#e8c870', fontSize: '1rem', letterSpacing: '0.2em', fontFamily: 'serif' }}>
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
            請注意：請注意不同酒杯上的細節
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-[38%] flex border-t border-white/10 bg-black/70 backdrop-blur-sm">
        <div className="flex flex-col overflow-hidden" style={{ width: '50%', padding: '14px 16px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-baseline gap-2 mb-3 flex-none">
            <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>
              Evidence
            </h2>
            <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>
              證據欄
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {CUPS.slice(0, 6).map((cup) => {
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

          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">已收集口紅杯</p>
            <p className="mt-1 text-3xl font-serif text-amber-100">{collectedLips} / {TARGET_IDS.length}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">點擊畫面上的杯子，收集六杯帶有口紅印的證據。</p>
          </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 relative">
            {selectedCup ? (
              <>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">當前杯子</p>
                <p className="mt-2 text-lg font-serif text-amber-100">{selectedCup.label}</p>
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
            <h2 style={{ color: '#dcc070', fontSize: '0.9rem', letterSpacing: '0.22em', fontFamily: 'serif' }}>
              Logic Board
            </h2>
            <span style={{ color: '#5a4820', fontSize: '0.55rem', letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>
              推理板
            </span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 flex-1 flex flex-col justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">目前收集到的杯子數量</p>
              <p className="mt-1 text-3xl font-serif text-amber-100">{inventory.size} / 8</p>
              <p className="mt-3 text-sm text-slate-300">收集全部 6 杯口紅杯後，即可解答她喝了幾杯。</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">她喝了</span>
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={!canSolve}
                  placeholder={canSolve ? '...' : '需收集 6 杯'}
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
          </div>

          <AnimatePresence>
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="rounded-3xl border border-emerald-500/40 bg-emerald-900/30 p-5 text-amber-100"
              >
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">解謎完成</p>
                <p className="mt-2 text-lg font-serif">真相：柯老雄在三一三號房強迫娟娟飲下六杯紹興酒。</p>
                <button
                  onClick={() => router.push('/chapter3')}
                  className="mt-4 inline-flex rounded-full bg-amber-400 px-4 py-2 text-sm text-slate-950 hover:bg-amber-300"
                >
                  前往第三關
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
