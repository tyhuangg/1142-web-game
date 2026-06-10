'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { startOpeningMusic } from '@/lib/openingAudio'

export default function LandingPage() {
  const router = useRouter()
  const [hasStarted, setHasStarted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem('ch1_started')) setHasStarted(true)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden select-none">

      {/* Background — subtle breathing scale */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage: "url('/images/landing_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          transformOrigin: 'center center',
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.88) 100%)',
      }} />

      {/* Subtle light flicker */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.025, 0, 0.018, 0, 0.032, 0, 0.01, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
        style={{ background: '#fff8e0' }}
      />

      {/* Content */}
      {mounted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">

          {/* Era badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            style={{
              color: '#5a3a10',
              fontSize: '0.58rem',
              letterSpacing: '0.55em',
              fontFamily: 'sans-serif',
              marginBottom: 22,
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            1968　臺灣
          </motion.p>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1.4, ease: 'easeOut' }}
            style={{
              color: '#e8c870',
              fontSize: 'clamp(2.8rem, 5vw, 4.8rem)',
              letterSpacing: '0.55em',
              fontFamily: 'serif',
              lineHeight: 1,
              paddingLeft: '0.55em',
              textShadow: '0 0 80px rgba(232,200,112,0.32), 0 0 20px rgba(232,200,112,0.18), 0 4px 28px rgba(0,0,0,0.95)',
            }}
          >
            孤戀花
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 1.1 }}
            style={{
              color: '#7a5a28',
              fontSize: '0.68rem',
              letterSpacing: '0.5em',
              fontFamily: 'sans-serif',
              marginTop: 16,
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            一場未解的命案
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.9, ease: 'easeOut' }}
            style={{
              width: 110,
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(200,160,64,0.5), transparent)',
              margin: '38px 0',
            }}
          />

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.9 }}
            className="flex flex-col items-center gap-3"
          >
            {/* 開始遊戲 */}
            <motion.button
              onClick={() => { startOpeningMusic(); router.push('/opening') }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(200,150,45,0.25)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '13px 56px',
                background: 'rgba(200,150,45,0.14)',
                border: '1px solid rgba(200,150,45,0.7)',
                borderRadius: 2,
                color: '#e0b040',
                fontSize: '0.8rem',
                letterSpacing: '0.45em',
                fontFamily: 'sans-serif',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(200,150,45,0.12)',
                transition: 'box-shadow 0.3s',
              }}
            >
              開始遊戲
            </motion.button>

            {/* 繼續遊戲 */}
            <motion.button
              onClick={() => { if (hasStarted) router.push('/chapter1') }}
              whileHover={hasStarted ? { scale: 1.03 } : {}}
              whileTap={hasStarted ? { scale: 0.97 } : {}}
              style={{
                padding: '11px 56px',
                background: 'transparent',
                border: `1px solid ${hasStarted ? 'rgba(180,135,55,0.48)' : 'rgba(55,42,18,0.45)'}`,
                borderRadius: 2,
                color: hasStarted ? '#8a6828' : '#382a10',
                fontSize: '0.75rem',
                letterSpacing: '0.45em',
                fontFamily: 'sans-serif',
                cursor: hasStarted ? 'pointer' : 'default',
              }}
            >
              繼續遊戲
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Credits link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1.2 }}
        className="absolute"
        style={{ bottom: 20, right: 24 }}
      >
        <Link
          href="/credits"
          style={{
            color: '#2e2010',
            fontSize: '0.62rem',
            letterSpacing: '0.28em',
            fontFamily: 'sans-serif',
            textDecoration: 'none',
          }}
        >
          關於本作
        </Link>
      </motion.div>
    </div>
  )
}
