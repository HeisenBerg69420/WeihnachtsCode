import { memo } from "react";
import { motion } from "framer-motion";

type IntroAnimationProps = {
    leftSrc: string;
    rightSrc: string;
    duration?: number;
};

const IntroAnimation = memo(function IntroAnimation({
                                                        leftSrc,
                                                        rightSrc,
                                                        duration = 1.8,
                                                    }: IntroAnimationProps) {
    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
            <div className="relative w-full max-w-3xl px-6">
                <div className="relative h-64 flex items-center justify-center">
                    <motion.img
                        src={leftSrc}
                        className="absolute w-64 h-64 "
                        initial={{ x: -400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration, ease: "easeOut" }}
                    />

                    <motion.img
                        src={rightSrc}
                        className="absolute w-64 h-64 "
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration, ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
    );
});

export default IntroAnimation;
