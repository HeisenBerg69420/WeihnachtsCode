import React, { memo } from "react";
import { motion } from "framer-motion";

/**
 * RetroTV
 * Props:
 * - src: string (image url)
 * - alt: string
 * - width: number (px) default 360
 * - aspect: "4/3" | "16/9" default "4/3"
 * - frameColor: string default "#2a1f1a"
 * - accentColor: string default "#b45309"
 * - screenGlow: boolean default true
 * - scanlines: boolean default true
 * - mode: "cover" | "contain" default "cover"
 * - focus: string CSS object-position, e.g. "50% 30%"
 * - float: boolean default true
 * - className: string
 * - onClick: () => void
 */
export const RetroTV = memo(function RetroTV({
                                                 src,
                                                 alt = "TV screen",
                                                 width = 360,
                                                 aspect = "4/3",
                                                 frameColor = "#2a1f1a",
                                                 accentColor = "#b45309",
                                                 screenGlow = true,
                                                 scanlines = true,
                                                 mode = "cover",
                                                 focus = "50% 35%",
                                                 float = true,
                                                 className = "",
                                                 onClick,
                                             }) {
    const Wrapper = float ? motion.div : "div";
    const screenH = aspect === "16/9" ? width * 0.56 : width * 0.75; // ~16:9 or 4:3
    const tvH = screenH + width * 0.38;

    return (
        <Wrapper
            {...(float
                ? {
                    animate: { y: [0, -6, 0] },
                    transition: { repeat: Infinity, duration: 3.4, ease: "easeInOut" },
                }
                : {})}
            className={`relative inline-block ${className}`}
            style={{ width, height: tvH }}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* TV Shadow */}
            <div
                className="absolute inset-0 rounded-[36px] blur-2xl opacity-25"
                style={{
                    background: `radial-gradient(circle at 50% 60%, ${accentColor}55, transparent 70%)`,
                }}
            />

            {/* TV Body */}
            <div
                className="relative w-full h-full rounded-[36px] overflow-hidden"
                style={{
                    background: `linear-gradient(180deg, ${frameColor}, rgba(0,0,0,0.18))`,
                    boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
                }}
            >
                {/* Top highlight */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.14), transparent 50%)",
                    }}
                />

                {/* Screen area frame */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[10%] rounded-[28px] p-[10px]"
                    style={{
                        width: width * 0.82,
                        height: screenH * 1.03,
                        background: "rgba(0,0,0,0.22)",
                        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.10)",
                    }}
                >
                    {/* Screen */}
                    <div
                        className="relative w-full h-full rounded-[18px] overflow-hidden"
                        style={{
                            background: "#0b0b0b",
                            boxShadow:
                                "inset 0 0 0 2px rgba(255,255,255,0.10), inset 0 -22px 40px rgba(0,0,0,0.55)",
                        }}
                    >
                        {/* Content */}
                        <img
                            src={src}
                            alt={alt}
                            className={`w-full h-full ${mode === "contain" ? "object-contain" : "object-cover"}`}
                            style={{ objectPosition: focus }}
                            draggable={false}
                        />

                        {/* Screen glow */}
                        {screenGlow && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(circle at 50% 40%, rgba(34,197,94,0.10), transparent 55%), radial-gradient(circle at 35% 30%, rgba(244,63,94,0.10), transparent 55%)",
                                    mixBlendMode: "screen",
                                }}
                            />
                        )}

                        {/* Scanlines */}
                        {scanlines && (
                            <div
                                className="absolute inset-0 pointer-events-none opacity-[0.12]"
                                style={{
                                    backgroundImage:
                                        "repeating-linear-gradient(to bottom, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 3px, transparent 6px)",
                                }}
                            />
                        )}

                        {/* Vignette + glass reflection */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%), radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 45%)",
                            }}
                        />
                    </div>
                </div>

                {/* Right-side controls */}
                <div
                    className="absolute right-[7%] top-[18%] rounded-2xl p-3"
                    style={{
                        width: width * 0.16,
                        height: screenH * 0.95,
                        background: "rgba(255,255,255,0.05)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Knobs */}
                    <motion.div
                        className="mx-auto mt-2 rounded-full"
                        style={{
                            width: width * 0.09,
                            height: width * 0.09,
                            background: `linear-gradient(180deg, ${accentColor}, rgba(0,0,0,0.18))`,
                            boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                        }}
                        animate={{ rotate: [0, 6, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div
                        className="mx-auto mt-4 rounded-full"
                        style={{
                            width: width * 0.09,
                            height: width * 0.09,
                            background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.12))",
                            boxShadow: "0 8px 18px rgba(0,0,0,0.22)",
                        }}
                    />
                    {/* Speaker */}
                    <div className="mt-6 space-y-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[3px] rounded-full opacity-70"
                                style={{
                                    background: "rgba(255,255,255,0.12)",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* TV feet */}
                <div className="absolute bottom-0 left-0 w-full h-[18%]">
                    <div
                        className="absolute bottom-[18%] left-[18%] w-[18%] h-[22%] rounded-2xl"
                        style={{ background: "rgba(0,0,0,0.25)" }}
                    />
                    <div
                        className="absolute bottom-[18%] right-[18%] w-[18%] h-[22%] rounded-2xl"
                        style={{ background: "rgba(0,0,0,0.25)" }}
                    />
                </div>
            </div>

            {/* Tiny “power” LED */}
            <motion.div
                className="absolute bottom-[14%] left-[18%] w-2.5 h-2.5 rounded-full"
                style={{
                    background: "#22c55e",
                    boxShadow: "0 0 12px rgba(34,197,94,0.65)",
                }}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
        </Wrapper>
    );
});
