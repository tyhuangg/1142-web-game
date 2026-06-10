"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Page = "prelude" | "question" | "ending1" | "ending2";

const PRELUDE_LINES = [
  "你推理出了娟娟殺人的真相",
  "現在變得瘋瘋癲癲的她，",
  "殺人的原因究竟是什麼？",
  "你究竟要如何處理這個案件？",
];

export default function Ending() {
  const [page, setPage] = useState<Page>("prelude");
  const tensionAudioRef = useRef<HTMLAudioElement>(null);
const gulianhuaAudioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  function ending1() {
    setPage("ending1");
  }

  function ending2() {
    setPage("ending2");
  }

  useEffect(() => {
    const audio = gulianhuaAudioRef.current;
    if (!audio) return;
  
    if (page === "ending1" || page === "ending2") {
      audio.volume = 0.75;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [page]);

  useEffect(() => {
    const audio = tensionAudioRef.current;
    if (!audio) return;
  
    if (page === "question") {
      audio.volume = 0.55;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [page]);

  return (
    <main className="relative h-full w-full overflow-hidden bg-black text-[#e8c870] font-[serif] tracking-widest">
      <audio ref={tensionAudioRef} src="/audio/tensions.mp3" loop />
      <audio ref={gulianhuaAudioRef} src="/audio/ch1_gulianhua.mp3" loop />

      <AnimatePresence mode="wait">
        {page === "prelude" && (
          <motion.section
            key="prelude"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            onClick={() => setPage("question")}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden cursor-pointer"
          >
            {/* 背景圖片：娟娟房間 */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/CH5/room.png')",
                backgroundSize: "cover",
                backgroundPosition: "center 45%",
                filter: "brightness(0.16) blur(1px)",
                transform: "scale(1.03)",
              }}
            />

            <div className="absolute inset-0 bg-black/65" />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(200,150,45,0.12), transparent 48%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="relative z-10 flex flex-col items-center text-center px-8"
              style={{ maxWidth: 620 }}
            >
              <p
                style={{
                  color: "#6a4820",
                  fontSize: "0.55rem",
                  letterSpacing: "0.55em",
                  fontFamily: "sans-serif",
                  marginBottom: 30,
                }}
              >
                FINAL CASE
              </p>

              <div className="flex flex-col items-center gap-5">
                {PRELUDE_LINES.map((line, index) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.75,
                      duration: 0.85,
                    }}
                    style={{
                      color: index === 0 ? "#d8c8a0" : "#7a6848",
                      fontSize: index === 0 ? "1.25rem" : "0.95rem",
                      letterSpacing: "0.28em",
                      fontFamily: "serif",
                      lineHeight: 2,
                      textAlign: "center",
                      textShadow: "0 0 40px rgba(216,200,160,0.18)",
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            <motion.p
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
              style={{
                color: "#3e2c0e",
                fontSize: "0.52rem",
                letterSpacing: "0.35em",
                fontFamily: "sans-serif",
              }}
            >
              點擊進入最終提問
            </motion.p>
          </motion.section>
        )}

        {page === "question" && (
          <motion.section
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            className="absolute inset-0 flex flex-col items-center px-6 overflow-y-auto"
          >
            {/* 背景圖片：娟娟房間 */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/CH5/room.png')",
                backgroundSize: "cover",
                backgroundPosition: "center 45%",
                filter: "brightness(0.18) blur(1px)",
                transform: "scale(1.03)",
              }}
            />

            <div className="absolute inset-0 bg-black/60" />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(200,150,45,0.12), transparent 48%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative z-10 text-center pt-10 pb-4 flex-none"
            >
              <p className="text-xs md:text-sm text-[#6a4820] tracking-[0.5em] font-sans mb-3">
                FINAL QUESTION
              </p>
              <h1 className="text-2xl md:text-4xl text-[#e8c870]">
                最終提問
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="
                relative z-10
                w-full max-w-5xl
                border border-[#b48737]/40
                bg-black/65
                shadow-[0_0_60px_rgba(232,200,112,0.12)]
                px-6 md:px-16
                py-8 md:py-12
                text-center
                flex-1 flex flex-col justify-center
              "
            >
              <p className="text-sm md:text-base text-[#e8c870]/55 mb-6 tracking-[0.4em] font-sans">
                請做出最後的判斷
              </p>

              <h2 className="text-2xl md:text-5xl leading-relaxed md:leading-[1.6] mb-6 text-[#d8c8a0]">
                請問娟娟殺人的動機是什麼？
              </h2>

              <div className="mb-8 inline-flex items-center justify-center border border-[#b48737]/35 bg-black/45 px-5 py-2">
                <p className="text-xs md:text-sm text-[#e8c870]/55 tracking-[0.28em] font-sans">
                  你的選擇將導向不同結局
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                <motion.button
                  onClick={ending1}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className="
                    group min-h-[88px]
                    border border-[#b48737]/60
                    bg-black/60
                    hover:bg-[#e8c870]
                    hover:text-black
                    transition-all duration-300
                    px-5 py-5
                    text-sm md:text-base
                    tracking-[0.28em]
                    font-sans
                  "
                >
                  <span className="block text-xs opacity-50 mb-2 group-hover:opacity-70">
                    OPTION A
                  </span>
                  A. 蓄意謀殺
                </motion.button>

                <motion.button
                  onClick={ending1}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className="
                    group min-h-[88px]
                    border border-[#b48737]/60
                    bg-black/60
                    hover:bg-[#e8c870]
                    hover:text-black
                    transition-all duration-300
                    px-5 py-5
                    text-sm md:text-base
                    tracking-[0.28em]
                    font-sans
                  "
                >
                  <span className="block text-xs opacity-50 mb-2 group-hover:opacity-70">
                    OPTION B
                  </span>
                  B. 毒品失控
                </motion.button>

                <motion.button
                  onClick={ending2}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className="
                    group min-h-[88px]
                    border border-[#b48737]/60
                    bg-black/60
                    hover:bg-[#e8c870]
                    hover:text-black
                    transition-all duration-300
                    px-5 py-5
                    text-sm md:text-base
                    tracking-[0.28em]
                    font-sans
                  "
                >
                  <span className="block text-xs opacity-50 mb-2 group-hover:opacity-70">
                    OPTION C
                  </span>
                  C. 自我防衛
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="relative z-10 py-4 flex-none text-xs md:text-sm text-[#e8c870]/35 tracking-[0.35em] text-center"
            >
              選擇後將揭開結局
            </motion.div>
          </motion.section>
        )}

        {page === "ending1" && (
          <motion.section
            key="ending1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
            className="absolute inset-0 flex flex-col items-center bg-black overflow-hidden px-6"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(200,150,45,0.1), transparent 48%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="relative z-10 text-center pt-8 pb-4 flex-none w-full"
            >
              <p className="text-xs text-[#6a4820] tracking-[0.5em] font-sans mb-3">
                ENDING
              </p>

              <h1 className="text-2xl md:text-4xl text-[#e8c870] mb-4">
                結局：瘋人院
              </h1>

              <p className="text-sm md:text-base text-[#d8c8a0]/75 leading-loose">
                娟娟已被折磨得癲狂，你將她送進了瘋人院。
                此後瘋人院中的病房一角，夜夜唱響孤戀花。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 1 }}
              className="relative z-0 flex justify-center items-center flex-1 min-h-0 w-full max-w-5xl"
            >
              <img
                src="/ending_sin.png"
                alt="She was caught"
                className="max-h-full w-auto object-contain opacity-90"
              />
            </motion.div>

            <div className="relative z-20 flex justify-center items-center py-5 flex-none">
              <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="
                  px-8 py-3
                  border border-[#b48737]/60
                  bg-black/60
                  text-[#e8c870]
                  hover:bg-[#e8c870]
                  hover:text-black
                  transition-all duration-300
                  text-sm
                  tracking-[0.32em]
                  font-sans
                  whitespace-nowrap
                "
              >
                回到主頁
              </motion.button>
            </div>
          </motion.section>
        )}

        {page === "ending2" && (
          <motion.section
            key="ending2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
            className="absolute inset-0 flex flex-col items-center bg-black overflow-hidden px-6"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(200,150,45,0.1), transparent 48%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="relative z-10 text-center pt-8 pb-4 flex-none w-full"
            >
              <p className="text-xs text-[#6a4820] tracking-[0.5em] font-sans mb-3">
                ENDING
              </p>

              <h1 className="text-2xl md:text-4xl text-[#e8c870] mb-4">
                結局：隱瞞真相
              </h1>

              <p className="text-sm md:text-base text-[#d8c8a0]/75 leading-loose">
                你將那一夜的真相深埋了心底。娟娟沒有被帶走——她剪去了那一頭長髮，悄悄離開了金華街。從此，再也沒有人找到她。或許，這才是她此生第一次，真正的自由。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 1 }}
              className="relative z-0 flex justify-center items-center flex-1 min-h-0 w-full max-w-5xl"
            >
              <img
                src="/ending_letGo.png"
                alt="You let her go."
                className="max-h-full w-auto object-contain opacity-90"
              />
            </motion.div>

            <div className="relative z-20 flex justify-center items-center py-5 flex-none">
              <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="
                  px-8 py-3
                  border border-[#b48737]/60
                  bg-black/60
                  text-[#e8c870]
                  hover:bg-[#e8c870]
                  hover:text-black
                  transition-all duration-300
                  text-sm
                  tracking-[0.32em]
                  font-sans
                  whitespace-nowrap
                "
              >
                回到主頁
              </motion.button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}