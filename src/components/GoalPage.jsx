import React, { memo, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import  ChristmasBauble  from "@/components/ui/ChristmasBauble";
import {RetroTV} from "@/components/ui/RetroTV.jsx";
import FlappyImageGame from "@/components/ui/FlappyImageGame.jsx";

const GoalPage = () => {
    // --- Confetti (short, premium burst) ---
    useEffect(() => {
        const duration = 2400;
        const animationEnd = Date.now() + duration;

        const defaults = {
            startVelocity: 28,
            spread: 360,
            ticks: 70,
            zIndex: 2,
            scalar: 0.9,
            gravity: 0.9,
        };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = Math.max(18, 70 * (timeLeft / duration));

            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.12, 0.32), y: random(0.05, 0.25) },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.68, 0.88), y: random(0.05, 0.25) },
            });
        }, 220);

        return () => clearInterval(interval);
    }, []);

    // --- Background snow (stable random) ---
    const flakes = useMemo(() => {
        return Array.from({ length: 34 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // %
            size: 1 + Math.random() * 2.2, // px
            duration: 12 + Math.random() * 10,
            delay: Math.random() * 10,
            drift: -14 + Math.random() * 28, // px
            opacity: 0.45 + Math.random() * 0.45,
        }));
    }, []);

    // --- Bauble slideshow ---
    const slideshowImages = useMemo(
        () => [
            `${import.meta.env.BASE_URL}images/Sop1.jpg`,
            `${import.meta.env.BASE_URL}images/Sop2.png`,
            `${import.meta.env.BASE_URL}images/Sop3.png`,
            `${import.meta.env.BASE_URL}images/dia1.jpg`,
            `${import.meta.env.BASE_URL}images/dia2.jpg`,
            `${import.meta.env.BASE_URL}images/dia3.jpg`,
            `${import.meta.env.BASE_URL}images/dia4.jpg`,
            `${import.meta.env.BASE_URL}images/dia5.jpg`,
            `${import.meta.env.BASE_URL}images/dia6.jpg`,
            `${import.meta.env.BASE_URL}images/dia7.jpg`,
            `${import.meta.env.BASE_URL}images/dia8.jpg`,
            `${import.meta.env.BASE_URL}images/dia9.jpg`,
            `${import.meta.env.BASE_URL}images/dia10.png`,
            `${import.meta.env.BASE_URL}images/dia11.jpg`,
            `${import.meta.env.BASE_URL}images/dia12.jpg`,
            `${import.meta.env.BASE_URL}images/Meme5.JPG`,
            `${import.meta.env.BASE_URL}images/Meme6.JPG`,
            `${import.meta.env.BASE_URL}images/Smort1.JPG`,
        ],
        []
    );

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
        }, 3200);

        return () => clearInterval(timer);
    }, [slideshowImages.length]);

    return (
        <div
            className="
        min-h-screen w-full relative flex items-center justify-center overflow-hidden p-4
        bg-gradient-to-br from-[#fff8ee] via-[#fde8e8] to-[#eef7f1]
      "
        >
            {/* Paper texture */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: "radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Christmas glow */}
            <div className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-red-300 opacity-20 blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] rounded-full bg-green-300 opacity-20 blur-[120px]" />

            {/* Candle glow bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-64 bg-gradient-to-t from-amber-200/40 via-rose-200/20 to-transparent blur-2xl pointer-events-none" />

            {/* Christmas lights */}
            <div className="absolute top-0 left-0 w-full h-16 z-0 pointer-events-none">
                <div className="flex justify-around items-center h-full px-6">
                    {Array.from({ length: 14 }).map((_, i) => (
                        <motion.span
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: i % 3 === 0 ? "#facc15" : i % 3 === 1 ? "#ef4444" : "#22c55e",
                                boxShadow: "0 0 12px currentColor",
                            }}
                            animate={{ opacity: [0.35, 1, 0.35] }}
                            transition={{
                                duration: 2 + (i % 3),
                                repeat: Infinity,
                                delay: i * 0.18,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Snow (small dots) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                {flakes.map((f) => (
                    <motion.span
                        key={f.id}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{
                            y: "110vh",
                            opacity: [0, f.opacity, f.opacity, 0],
                            x: [0, f.drift],
                        }}
                        transition={{
                            duration: f.duration,
                            repeat: Infinity,
                            delay: f.delay,
                            ease: "linear",
                        }}
                        className="absolute top-0 rounded-full bg-white/80 blur-[0.5px]"
                        style={{
                            left: `${f.left}%`,
                            width: `${f.size}px`,
                            height: `${f.size}px`,
                        }}
                    />
                ))}
            </div>

            {/* Snow (large flakes for depth) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-8 h-8 rounded-full border border-white/20 blur-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{ y: [0, 30, 0], opacity: [0.08, 0.22, 0.08] }}
                        transition={{ duration: 8 + Math.random() * 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* Floating Cats (kept, slightly refined) */}
            <motion.div
                animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-12 left-8 w-28 md:w-40 z-10 will-change-transform"
            >
                <img
                    alt="Floating kitten with balloons"
                    className="w-full drop-shadow-lg rounded-2xl"
                    src="../../public/images/Meme3.JPG"
                    loading="lazy"
                    width="160"
                    height="160"
                />
            </motion.div>

            <motion.div
                animate={{ y: [0, 18, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
                className="absolute top-20 right-8 w-28 md:w-40 z-10 will-change-transform"
            >
                <img
                    alt="Happy kitten with a party hat"
                    className="w-full drop-shadow-lg rounded-2xl"
                    src="../../public/images/Meme4.JPG"
                    loading="lazy"
                    width="160"
                    height="160"
                />
            </motion.div>

            <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-1/4 w-32 md:w-36 z-10 will-change-transform"
            >
                <img
                    alt="Two kittens hugging"
                    className="w-full drop-shadow-lg rounded-2xl"
                    src="../../public/images/Meme3.JPG"
                    loading="lazy"
                    width="144"
                    height="144"
                />
            </motion.div>

            {/* Bauble Slideshow (background decor) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute left-6 top-20 md:left-16 md:bottom-24">
                    <ChristmasBauble
                        src={slideshowImages[(currentIndex + slideshowImages.length - 1) % slideshowImages.length]}
                        size={170}
                        ringColor="#b91c1c"
                        ribbonColor="#14532d"
                        className="opacity-90"
                    />
                </div>

                <div className="absolute right-6 bottom-16 md:right-16 md:bottom-20">
                    <ChristmasBauble
                        src={slideshowImages[(currentIndex + 1) % slideshowImages.length]}
                        size={200}
                        ringColor="#0f766e"
                        ribbonColor="#991b1b"
                        className="opacity-90"
                    />
                </div>
            </div>

            {/* Center Slideshow (main) */}
            <div className="relative z-20 w-full max-w-3xl flex items-center justify-center">
                <div className="relative w-full">
                    {/* Main Glass Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="relative mx-auto w-full max-w-3xl rounded-3xl border border-white/55 bg-white/55 backdrop-blur-xl shadow-2xl px-6 md:px-12 py-10 overflow-hidden"
                    >
                        {/* Ambient glow inside card */}
                        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-300/35 blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl" />

                        {/* Subtle sparkle grid */}
                        <div
                            className="absolute inset-0 opacity-[0.05]"
                            style={{
                                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                                backgroundSize: "28px 28px",
                            }}
                        />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Heart badge */}
                            <motion.div
                                initial={{ scale: 0.75, opacity: 0, rotate: -6 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                className="mb-6 flex justify-center"
                            >
                                <div className="relative rounded-full p-6 bg-white/60 border border-white/70 shadow-xl">
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        animate={{ opacity: [0.18, 0.35, 0.18] }}
                                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            background:
                                                "conic-gradient(from 180deg, rgba(244,63,94,0.25), rgba(236,72,153,0.20), rgba(16,185,129,0.18), rgba(244,63,94,0.25))",
                                            filter: "blur(10px)",
                                        }}
                                    />
                                    <Heart className="relative w-20 h-20 text-red-500 fill-red-500 drop-shadow-md" />
                                    <motion.div
                                        className="absolute -right-2 -top-2"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Stars className="w-8 h-8 text-yellow-500 fill-yellow-500 drop-shadow-sm" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-serif-art text-5xl md:text-6xl text-gray-900 mb-3 drop-shadow-sm"
                            >
                                But now to ur real present
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="font-hand text-2xl md:text-[28px] text-gray-700 leading-relaxed mb-7"
                            >
                                I dont know when ur free but i would sponsor ourselfs
                                <br />
                                a great weekend at a wellness hotel
                            </motion.p>

                            {/* Main Bauble Slideshow */}
                            {/*<FlappyImageGame birdSrc="public/images/Meme1.jpg" />*/}

                            {/* Emoji row */}
                            <motion.div>

                                <RetroTV
                                    src="public/Images/Paar_Wellness1.jpg"
                                    width={380}
                                    aspect="4/3"
                                    scanlines
                                    screenGlow
                                    mode="cover"
                                    focus="50% 25%"   // wenn Gesichter sonst zu tief sitzen
                                    onClick={() => console.log("next")}
                                />
                            </motion.div>

                        </div>
                    </motion.div>

                    {/* Tiny floating sparkle near card */}
                    <motion.div
                        className="absolute -top-3 right-8 z-20 text-2xl"
                        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        ✨
                    </motion.div>

                    <motion.div
                        className="absolute -bottom-4 left-10 z-20 text-2xl"
                        animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        ✨
                    </motion.div>


                </div>
            </div>
        </div>
    );
};

export default memo(GoalPage);
