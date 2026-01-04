import { motion } from "framer-motion";

export default function Logo() {
  return (
    <div className="w-32 h-32">
    <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9400D3"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
    >
    {/* Eye outline (Lucide Eye inspired) */}
    <path
    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
    stroke="#4B0082"
    />
    
    
    {/* Clip area so the iris never leaves the eye */}
    <defs>
    <clipPath id="eye-clip">
    <ellipse cx="12" cy="12" rx="6" ry="3.8" />
    </clipPath>
    </defs>
    
    
    {/* Iris + pupil */}
    <g clipPath="url(#eye-clip)">
    <motion.circle
    cx="12"
    cy="12"
    r="2"
    fill="#9400D3"
    animate={{
    x: [0, 1, -1, 0.7, -0.7, 0],
    y: [0, -0.5, 0.5, -0.3, 0.3, 0],
    }}
    transition={{
    duration: 10,
    repeat: Infinity,
    ease: "easeInOut",
    }}
    />
    </g>
    </svg>
    </div>
    );
}
