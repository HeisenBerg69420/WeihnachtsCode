import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import ChristmasBauble  from '@/components/ui/ChristmasBauble';

const StartPage = ({ onStart }) => {
    return (
        <div className="
      min-h-screen w-full relative flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-[#fff8ee] via-[#fde8e8] to-[#eef7f1]
    ">
            {/* Subtle paper texture */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        'radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Christmas glow */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-red-300 opacity-20 blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-green-300 opacity-20 blur-[120px]" />

            {/* Snow effect */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <motion.span
                        key={i}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{
                            y: '110vh',
                            opacity: [0, 1, 1, 0],
                            x: Math.random() * window.innerWidth
                        }}
                        transition={{
                            duration: 12 + Math.random() * 8,
                            repeat: Infinity,
                            delay: Math.random() * 10,
                            ease: 'linear'
                        }}
                        className="absolute top-0 w-1.5 h-1.5 rounded-full bg-white/80 blur-[0.5px]"
                    />
                ))}
            </div>

            {/* Corner Cat Top */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute top-0 right-[10%] w-32 md:w-48 z-10"
            >
                <ChristmasBauble
                    src="/images/Sop2.png"
                    size={180}
                />
            </motion.div>

            {/* Corner Cat Bottom */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-0 left-[5%] w-40 md:w-56 z-10"
            >
                <ChristmasBauble
                    src="public/Images/Car1.jpg"
                    size={180}
                />
            </motion.div>

            {/* Christmas lights */}
            <div className="absolute top-0 left-0 w-full h-16 z-0 pointer-events-none">
                <div className="flex justify-around items-center h-full">
                    {Array.from({ length: 14 }).map((_, i) => (
                        <motion.span
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: i % 3 === 0 ? "#facc15" : i % 3 === 1 ? "#ef4444" : "#22c55e",
                                boxShadow: "0 0 12px currentColor",
                            }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                                duration: 2 + (i % 3),
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-64 bg-gradient-to-t from-amber-200/40 via-rose-200/20 to-transparent blur-2xl pointer-events-none z-0" />


            {/* Main Content */}
            <div className="relative z-20 text-center p-8 max-w-2xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <h1 className="
            font-serif-art text-5xl md:text-7xl mb-2
            text-red-700 drop-shadow-[0_2px_6px_rgba(150,0,0,0.25)]
          ">
                        Ho Ho Hoe
                        <br />
                        <span className="text-green-700">Merry Christmas</span>
                    </h1>

                </motion.div>

                {/* Center Cat */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-44 mx-auto mb-8"
                >

                    <ChristmasBauble
                        src="public/Images/Love1.png"
                        size={220}
                        ringColor="#0f766e"
                        ribbonColor="#991b1b"
                    />
                </motion.div>

                {/* Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={onStart}
                        className="
              bg-gray-900 text-white px-8 py-6 rounded-full text-xl
              font-serif-art shadow-xl hover:bg-gray-800 hover:shadow-2xl
              transition-all group
            "
                    >
                        Stort
                        <Heart
                            className="ml-2 w-5 h-5 group-hover:text-pink-400 transition-colors"
                            fill="currentColor"
                        />
                    </Button>
                </motion.div>
            </div>

        </div>
    );
};

export default memo(StartPage);