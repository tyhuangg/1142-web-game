"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Page = "title" | "story" | "game" | "correct";

type Choice = {
  title: string;
  img: string;
};

export default function Chapter5() {
  const router = useRouter();
  const tensionAudioRef = useRef<HTMLAudioElement>(null);

  const [page, setPage] = useState<Page>("title");
  const [answer, setAnswer] = useState<number[]>([]);
  const [ACount, setACount] = useState(0);
  const [BCount, setBCount] = useState(0);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const audio = tensionAudioRef.current;
    if (!audio) return;
  
    if (page === "game") {
      audio.volume = 0.55;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [page]);

  const choices: Choice[] = [
    {
      title: "1. 柯老雄跟著娟娟回家",
      img: "/CH5/ch5_cube1.png",
    },
    {
      title: "2. 娟娟用熨斗打中柯老雄的頭",
      img: "/CH5/ch5_cube2.png",
    },
    {
      title: "3. 柯老雄離開公寓",
      img: "/CH5/ch5_cube3.png",
    },
    {
      title: "4. 柯老雄對娟娟施暴",
      img: "/CH5/ch5_cube4.png",
    },
    {
      title: "5. 柯老雄付錢給娟娟",
      img: "/CH5/ch5_cube5.png",
    },
    {
      title: "6. 娟娟用刀刺中柯老雄",
      img: "/CH5/ch5_cube6.png",
    },
    {
      title: "7. 柯老雄死亡",
      img: "/CH5/ch5_cube7.png",
    },
    {
      title: "8. 娟娟用酒瓶打中柯老雄的頭",
      img: "/CH5/ch5_cube8.png",
    },
  ];

  // 畫面上的正確順序：1 → 4 → 2 → 7
  // 陣列 index：0 → 3 → 1 → 6
  const rightAnswer = [0, 3, 1, 6];

  function handleSelect(index: number) {
    if (answer.includes(index)) {
      setAnswer(answer.filter((item) => item !== index));
      setMessage("");
      return;
    }

    if (answer.length >= 4) {
      setMessage("最多只能選 4 個碎片");
      return;
    }

    setAnswer([...answer, index]);
    setMessage("");
  }

  function checkAnswer() {
    if (answer.length !== 4) {
      setMessage("請選滿 4 個碎片");
      return;
    }

    let a = 0;
    let b = 0;

    for (let i = 0; i < answer.length; i++) {
      if (answer[i] === rightAnswer[i]) {
        a++;
      } else if (rightAnswer.includes(answer[i])) {
        b++;
      }
    }

    setACount(a);
    setBCount(b);

    if (a === 4) {
      setMessage("真相已經重建完成。");
      setPage("correct");
    
      setTimeout(() => {
        router.push("/ending");
      }, 3000);
    } else {
      setMessage(`結果：${a}A${b}B`);
    }
  }

  function resetAnswer() {
    setAnswer([]);
    setACount(0);
    setBCount(0);
    setMessage("");
  }

  return (
    <main
      className="relative h-full w-full overflow-hidden select-none"
      style={{ background: "#000" }}
    >
      <audio ref={tensionAudioRef} src="/audio/tensions.mp3" loop />
      {/* 全頁共用背景：娟娟房間 */}
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

      {/* 壓暗與舞台感 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(200,150,45,0.10), transparent 45%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      <AnimatePresence mode="wait">
        {page === "title" && (
          <motion.section
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            onClick={() => setPage("story")}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1 }}
              className="relative z-10 flex flex-col items-center text-center px-8"
            >
              <p
                style={{
                  color: "#6a4820",
                  fontSize: "0.55rem",
                  letterSpacing: "0.55em",
                  fontFamily: "sans-serif",
                  marginBottom: 16,
                }}
              >
                CHAPTER V
              </p>

              <h1
                style={{
                  color: "#e8c870",
                  fontSize: "2.4rem",
                  letterSpacing: "0.35em",
                  fontFamily: "serif",
                  textShadow:
                    "0 0 50px rgba(232,200,112,0.3), 0 4px 20px rgba(0,0,0,0.9)",
                }}
              >
                娟娟房間
              </h1>
            </motion.div>

            <motion.p
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                color: "#3e2c0e",
                fontSize: "0.52rem",
                letterSpacing: "0.35em",
                fontFamily: "sans-serif",
              }}
            >
              點擊繼續
            </motion.p>
          </motion.section>
        )}

        {page === "story" && (
          <motion.section
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            onClick={() => setPage("game")}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.9 }}
              className="relative z-10 flex flex-col items-center text-center px-8"
              style={{ maxWidth: 520 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8 }}
                style={{
                  color: "#d8c8a0",
                  fontSize: "1.35rem",
                  letterSpacing: "0.3em",
                  fontFamily: "serif",
                  lineHeight: 2,
                  textAlign: "center",
                  textShadow: "0 0 40px rgba(216,200,160,0.2)",
                }}
              >
                這兇案的真相究竟是什麼？
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
                style={{
                  color: "#6a5838",
                  fontSize: "0.85rem",
                  letterSpacing: "0.28em",
                  fontFamily: "serif",
                  lineHeight: 2.2,
                  textAlign: "center",
                  marginTop: 24,
                }}
              >
                你身為偵探面對這疑問，
                <br />
                開始整理出腦中各種猜測的碎片。
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25, duration: 0.8 }}
                style={{
                  color: "#6a5838",
                  fontSize: "0.85rem",
                  letterSpacing: "0.28em",
                  fontFamily: "serif",
                  lineHeight: 2.2,
                  textAlign: "center",
                  marginTop: 14,
                }}
              >
                你將從這些碎片之中篩選出 4 個合理的片段，
                <br />
                依照順序排成真相。
              </motion.p>
            </motion.div>

            <motion.p
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                color: "#3e2c0e",
                fontSize: "0.52rem",
                letterSpacing: "0.35em",
                fontFamily: "sans-serif",
              }}
            >
              點擊繼續
            </motion.p>
          </motion.section>
        )}

        {page === "game" && (
          <motion.section
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0"
          >
            <div className="relative min-h-screen w-screen overflow-hidden text-[#e8c870] font-[serif] tracking-widest flex flex-col items-center">
              {/* 背景圖片 */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('/CH5/room.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center 45%",
                  filter: "brightness(0.2) blur(1px)",
                  transform: "scale(1.03)",
                }}
              />

              <div className="absolute top-4 left-5 flex flex-col gap-0.5 pointer-events-none z-10"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
                <p style={{ color: '#806030', fontSize: '0.55rem', letterSpacing: '0.38em', fontFamily: 'sans-serif' }}>
                  CHAPTER  V
                </p>
                <p style={{ color: '#e8c870', fontSize: '1rem', letterSpacing: '0.2em', fontFamily: 'serif' }}>
                  娟娟房間
                </p>
              </div>

              <div className="absolute top-4 right-5 border-1 border-'#e8c870' flex flex-col gap-0.5 pointer-events-none p-2 z-10 opacity-70"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
                <p style={{ color: '#e8c870', fontSize: '0.75rem', letterSpacing: '0.2em', fontFamily: 'sans-serif' }}>
                  幾 A 幾 B 判定規則：
                </p>
                <p style={{ color: '#e8c870', fontSize: '0.75rem', letterSpacing: '0.2em', fontFamily: 'sans-serif' }}>
                  有幾個 A 即代表選項正確且順序正確的數量
                </p>
                <p style={{ color: '#e8c870', fontSize: '0.75rem', letterSpacing: '0.2em', fontFamily: 'sans-serif' }}>
                  有幾個 B 即代表選項正確但順序不正確的數量
                </p>
              </div>

              {/* 黑色遮罩，讓文字和卡片更清楚 */}
              <div className="absolute inset-0 bg-black/25 backdrop-blur-sm backdrop-saturate-150" />

              {/* 遊戲內容 */}

              <div className="relative z-10 mt-8 mb-6 text-center">
                <p>請從以下 8 個碎片中找出正確的 4 個片段，並依照順序排列成真相。</p>
                <p className="mt-2 text-sm opacity-70">
                  目前選擇：
                  {answer.length === 0
                    ? "尚未選擇"
                    : answer.map((index) => choices[index].title.split(".")[0]).join(" → ")}
                </p>
                <p className="mt-2 text-sm text-black opacity-70 bg-[#e8c870]">
                  點擊碎片可選擇/取消選擇
                </p>
                <p className="mt-2 text-sm text-black opacity-70 bg-[#e8c870]">
                  點擊「判斷」按鍵後將按照「幾 A 幾 B」的規則給予提示
                </p>

              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8">
                {choices.map((choice, index) => {
                  const selectedIndex = answer.indexOf(index);
                  const isSelected = selectedIndex !== -1;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(index)}
                      className={`rounded-2xl w-[288px] h-[192px] relative overflow-hidden border-2 transition
                ${isSelected
                          ? "border-[#e8c870] scale-105"
                          : "border-transparent opacity-80 hover:opacity-100"
                        }
              `}
                    >
                      <img
                        src={choice.img}
                        alt={choice.title}
                        className="w-full h-full object-cover"
                      />

                      <div className="text-[#e8c870] bg-black/70 absolute bottom-0 w-full h-[28%] flex justify-center items-center text-sm px-2 text-center">
                        {choice.title}
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#e8c870] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {selectedIndex + 1}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 flex gap-4 mt-4">
                <button
                  onClick={checkAnswer}
                  className="px-6 py-3 rounded-xl bg-[#e8c870] text-black hover:opacity-80 transition"
                >
                  判斷幾 A 幾 B
                </button>

                <button
                  onClick={resetAnswer}
                  className="px-6 py-3 rounded-xl border border-[#e8c870] text-[#e8c870] hover:bg-[#e8c870] hover:text-black transition"
                >
                  重新選擇
                </button>
              </div>

              <div className="relative z-10 mt-4 text-xl">
                {ACount}A {BCount}B
              </div>

              {message && (
                <div className="relative z-10 mt-4 text-lg">
                  {message}
                </div>
              )}
            </div>
          </motion.section>
        )}

{page === "correct" && (
  <motion.section
    key="correct"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.65 }}
    className="absolute inset-0 flex flex-col items-center justify-center"
  >
    {/* 背景圖片 */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "url('/images/room.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 45%",
        filter: "brightness(0.16) blur(1px)",
        transform: "scale(1.03)",
      }}
    />

    {/* 黑色遮罩 */}
    <div className="absolute inset-0 bg-black/65" />

    {/* 文字內容 */}
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.9 }}
      className="relative z-10 flex flex-col items-center text-center px-8"
      style={{ maxWidth: 520 }}
    >
      <p
        style={{
          color: "#6a4820",
          fontSize: "0.55rem",
          letterSpacing: "0.55em",
          fontFamily: "sans-serif",
          marginBottom: 16,
        }}
      >
        TRUTH RESTORED
      </p>

      <h1
        style={{
          color: "#e8c870",
          fontSize: "2.2rem",
          letterSpacing: "0.28em",
          fontFamily: "serif",
          textShadow:
            "0 0 50px rgba(232,200,112,0.3), 0 4px 20px rgba(0,0,0,0.9)",
          marginBottom: 28,
        }}
      >
        回答正確
      </h1>

      <p
        style={{
          color: "#d8c8a0",
          fontSize: "1rem",
          letterSpacing: "0.24em",
          fontFamily: "serif",
          lineHeight: 2.2,
          textAlign: "center",
        }}
      >
        你已還原真相。
        <br />
        那一夜發生的一切，終於重新浮現。
      </p>
    </motion.div>
  </motion.section>
)}
      </AnimatePresence>
    </main>
  );
}