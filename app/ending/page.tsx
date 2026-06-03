"use client"
import Image from "next/image"
import Link from "next/link";
import { div } from 'framer-motion/client';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'


export default function Ending() {

  const [counter, setCounter] = useState(0);

  function ending1() {
    setCounter(counter + 1);
  }
  function ending2() {
    setCounter(counter + 2);
  }

  return (
    <>
      {counter === 0 && (
  <section className="min-h-screen w-full bg-black text-[#e8c870] font-[serif] tracking-widest flex flex-col items-center justify-center px-6 relative overflow-hidden">
    {/* 上方章節標題 */}
    <div className="absolute top-10 left-1/2 -translate-x-1/2 text-xl md:text-3xl">
      最終提問
    </div>

    {/* 中央內容 */}
    <div className="w-full max-w-5xl flex flex-col items-center text-center">
      <div className="mb-12">
        <p className="text-sm md:text-base text-[#e8c870]/60 mb-4">
          請做出最後的判斷
        </p>

        <h1 className="text-2xl md:text-4xl leading-relaxed">
          請問娟娟殺人的動機是什麼？
        </h1>
      </div>

      {/* 選項按鈕 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <motion.button
          onClick={ending1}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="h-20 border border-[#b48737]/60 rounded-md text-[#e8c870] hover:bg-[#e8c870] hover:text-black transition duration-300 text-sm md:text-base tracking-[0.28em] font-sans"
        >
          A. 蓄意謀殺
        </motion.button>

        <motion.button
          onClick={ending1}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="h-20 border border-[#b48737]/60 rounded-md text-[#e8c870] hover:bg-[#e8c870] hover:text-black transition duration-300 text-sm md:text-base tracking-[0.28em] font-sans"
        >
          B. 毒品失控
        </motion.button>

        <motion.button
          onClick={ending2}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="h-20 border border-[#b48737]/60 rounded-md text-[#e8c870] hover:bg-[#e8c870] hover:text-black transition duration-300 text-sm md:text-base tracking-[0.28em] font-sans"
        >
          C. 自我防衛
        </motion.button>
      </div>
    </div>

    {/* 底部提示 */}
    <div className="absolute bottom-10 text-xs md:text-sm text-[#e8c870]/40 tracking-[0.3em]">
      選擇後將進入結局
    </div>
  </section>
)}


      {
        (counter == 1) &&
        <div className='text-white bg-black flex flex-col justify-center items-center w-full h-full relative'>
          <div className='flex flex-col items-center w-full h-full text-[32px] absolute top-8'>
            <div>
              結局：瘋人院
            </div>
            <div className='text-[16px]'>
              瘋人院中的病房一角，夜夜唱響孤戀花。
            </div>
          </div>

          <div className='flex justify-center items-center w-full h-full'>
            <img src="/ending_sin.png" alt="She was caught" />
          </div>
        </div>
      }

      {
        (counter == 2) &&

        <div className='text-white bg-black flex flex-col justify-center items-center w-full h-full relative'>
          <div className='flex flex-col items-center w-full h-full text-[32px] absolute top-8'>
            <div>
              結局：隱瞞真相
            </div>
            <div className='text-[16px]'>
              你同情她的遭遇，而她繼續著不變的生活
            </div>
          </div>

          <div className='flex justify-center items-center w-full h-full'>
            <img src="ending_letGo.png" alt="You let her go." />
          </div>
        </div>


      }

    </>

  )
}