import React, { memo } from "react";
import { motion } from "framer-motion";

/**
 * ChristmasBauble
 * Props:
 * - src: Bild-URL
 * - alt: alt text
 * - size: number (px) default 180
 * - ringColor: string (css color) default "#b91c1c" (weihnachtsrot)
 * - ribbonColor: string default "#14532d" (tannengrün)
 * - shine: boolean default true
 * - float: boolean default true (sanftes schweben)
 * - className: string
 * - onClick: optional
 */
const ChristmasBauble = ({
                             src,
                             alt = "Christmas bauble photo",
                             size = 180,
                             ringColor = "#b91c1c",
                             ribbonColor = "#14532d",
                             shine = true,
                             float = true,
                             className = "",
                             onClick,
                         }) => {
    const Wrapper = float ? motion.div : "div";

    return (
        <Wrapper
            {...(float
                ? {
                    animate: { y: [0, -8, 0] },
                    transition: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
                }
                : {})}
            className={`relative inline-block ${className}`}
            style={{ width: size, height: size + size * 0.22 }}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* Ribbon + cap */}
            <div
                className="absolute left-1/2 -translate-x-1/2 top-0 z-20"
                style={{ width: size * 0.6, height: size * 0.28 }}
            >
                {/* little loop */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 -top-1 rounded-full"
                    style={{
                        width: size * 0.16,
                        height: size * 0.16,
                        border: `3px solid ${ringColor}`,
                        background: "transparent",
                    }}
                />
                {/* ribbon strap */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[18%] rounded-full"
                    style={{
                        width: size * 0.12,
                        height: size * 0.22,
                        background: ribbonColor,
                        boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                    }}
                />
                {/* cap */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-b-2xl"
                    style={{
                        width: size * 0.46,
                        height: size * 0.16,
                        background: `linear-gradient(180deg, ${ringColor}, rgba(0,0,0,0.12))`,
                        boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                    }}
                />
            </div>

            {/* Bauble sphere */}
            <div
                className="absolute left-0 right-0 bottom-0 mx-auto rounded-full overflow-hidden"
                style={{
                    width: size,
                    height: size,
                    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                }}
            >
                {/* Inner photo */}
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover scale-[1.03]"
                    draggable={false}
                />

                {/* Rim (glass edge) */}
                <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                        boxShadow:
                            "inset 0 0 0 5px rgba(255,255,255,0.22), inset 0 -18px 30px rgba(0,0,0,0.22)",
                    }}
                />

                {/* Color tint (subtle christmas vibe) */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.20), transparent 45%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.10))",
                    }}
                />

                {/* Shine highlight */}
                {shine && (
                    <>
                        <div
                            className="absolute pointer-events-none rounded-full"
                            style={{
                                left: "14%",
                                top: "10%",
                                width: "42%",
                                height: "52%",
                                background:
                                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.78), rgba(255,255,255,0.10) 55%, transparent 70%)",
                                filter: "blur(1px)",
                                transform: "rotate(-14deg)",
                            }}
                        />
                        <div
                            className="absolute pointer-events-none rounded-full"
                            style={{
                                right: "16%",
                                bottom: "12%",
                                width: "56%",
                                height: "28%",
                                background:
                                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22), transparent 65%)",
                                filter: "blur(2px)",
                            }}
                        />
                    </>
                )}
            </div>
        </Wrapper>
    );
};

export default memo(ChristmasBauble);
