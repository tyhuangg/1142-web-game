"use client"
import Image from "next/image"
import Link from "next/link";
import { div } from 'framer-motion/client';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

type Choice = {
    title: string;
    img: string;
  };

export default function Chapter5() {
    const [choiceText, setChoiceText] = useState(0);
    const choices = [{
        title: '1. 柯老雄對娟娟施暴',
        img: '/images/ch5_cube1.png'
    },
    {
        title: '2. 柯老雄對娟娟施暴',
        img: '/images/ch5_cube1.png'
    },
    {
        title: '3. 柯老雄對娟娟施暴',
        img: '/images/ch5_cube1.png'
    }];

    const answer = [0, 1, 2, 3];
    const rightAnswer = [0, 1, 2, 3];
    const [ACount, setACount] = useState(0);
    const [BCount, setBCount] = useState(0);

    // function(answer:string){
    //     for(let i = 0; i<answer.length; i++){
    //         if(answer[i] == rightAnswer[i])
    //         {
    //             setACount++;
    //         }            
    //     }        
    // }

    return (
        <>
            <div className="relative h-screen w-screen bg-black overflow-hidden text-[#e8c870] font-[serif] tracking-widest flex justify-center items-center">
                <div className="absolute top-8">第五章</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full h-full p-8 pt-20">
                    <div className="bg-[#e8c870] rounded-2xl w-[240px] h-[160px] relative">
                        {/* <img src="" alt="" className="w-full h-full object-cover" /> */}
                        <div className="text-[#e8c870] opacity-40 bg-black absolute bottom-0 w-full h-[20%] flex justify-center items-center">
                            1. 柯老雄對娟娟施暴
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}
