"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion'

type Choice = {
  title: string;
  img: string;
};


export default function Chapter5() {
  const [page, setPage] = useState(0);
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


  function RevelationScene() {
    return (
      <div className="flex flex-col items-center gap-6" style={{ maxWidth: 360 }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          style={{
            color: '#d8c8a0',
            fontSize: '1.35rem',
            letterSpacing: '0.3em',
            fontFamily: 'serif',
            textAlign: 'center',
            textShadow: '0 0 40px rgba(216,200,160,0.2)',
          }}
        >
          這兇案的真相究竟是什麼？
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{
            color: '#6a5838',
            fontSize: '0.85rem',
            letterSpacing: '0.28em',
            fontFamily: 'serif',
            textAlign: 'center',
          }}
        >
          身為偵探，你面對這疑問，開始整理出腦中各種猜測的碎片。
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{
            color: '#6a5838',
            fontSize: '0.85rem',
            letterSpacing: '0.28em',
            fontFamily: 'serif',
            textAlign: 'center',
          }}
        >
          你將從這些碎片中篩選出 4 個合理的片段，依照順序排成真相。
        </motion.p>
      </div>
    )
  }

  function Game() {
    return (
      <div className="relative min-h-screen w-screen bg-black overflow-hidden text-[#e8c870] font-[serif] tracking-widest flex flex-col items-center">
      <div className="absolute top-8 text-2xl">第五章</div>

      <div className="mt-24 mb-6 text-center">
        <p>請從以下 8 個碎片中找出正確的 4 個片段，並依照順序排列成真相。</p>
        <p className="mt-2 text-sm opacity-70">
          目前選擇：
          {answer.length === 0
            ? "尚未選擇"
            : answer.map((index) => choices[index].title.split(".")[0]).join(" → ")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8">
        {choices.map((choice, index) => {
          const selectedIndex = answer.indexOf(index);
          const isSelected = selectedIndex !== -1;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`rounded-2xl w-[240px] h-[160px] relative overflow-hidden border-2 transition
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

      <div className="flex gap-4 mt-4">
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

      <div className="mt-6 text-xl">
        {ACount}A {BCount}B
      </div>

      {message && <div className="mt-4 text-lg">{message}</div>}
    </div>
    )
  }

  // 正確答案：畫面上的 1 → 4 → 2 → 7
  // 因為陣列 index 從 0 開始，所以要寫成 0 → 3 → 1 → 6
  const rightAnswer = [0, 3, 1, 6];

  const [answer, setAnswer] = useState<number[]>([]);
  const [ACount, setACount] = useState(0);
  const [BCount, setBCount] = useState(0);
  const [message, setMessage] = useState("");

  function handleSelect(index: number) {
    // 如果已經選過，再點一次就取消
    if (answer.includes(index)) {
      setAnswer(answer.filter((item) => item !== index));
      return;
    }

    // 最多只能選 4 個
    if (answer.length >= 4) {
      setMessage("最多只能選 4 個選項");
      return;
    }

    setAnswer([...answer, index]);
    setMessage("");
  }

  function checkAnswer() {
    if (answer.length !== 4) {
      setMessage("請選滿 4 個答案");
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
      setMessage("完全正確！");
      router.push("/ending");
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
  const router = useRouter();
  return (
   <></>
  );
}