'use client'

import { motion } from 'framer-motion'

interface PixelGuitarProps {
  className?: string
  delay?: number
  model: 'lespaul' | 'telecaster' | 'prs'
  size?: 'sm' | 'md' | 'lg'
}

export function PixelGuitar({
  className = '',
  delay = 0,
  model,
  size = 'md',
}: PixelGuitarProps) {
  const sizeMap = {
    sm: 60,
    md: 90,
    lg: 130,
  }

  const s = sizeMap[size]

  const glowColors = {
    lespaul: 'rgba(255, 180, 50, 0.6)',
    telecaster: 'rgba(74, 144, 217, 0.6)',
    prs: 'rgba(74, 144, 217, 0.6)',
  }

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ y: 0, rotate: -5 }}
      animate={{
        y: [0, -15, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      style={{
        filter: `drop-shadow(0 0 20px ${glowColors[model]}) drop-shadow(0 0 40px ${glowColors[model]})`,
      }}
    >
      {model === 'lespaul' && <LesPaulSVG size={s} />}
      {model === 'telecaster' && <TelecasterSVG size={s} />}
      {model === 'prs' && <PRSSVG size={s} />}
    </motion.div>
  )
}

function LesPaulSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 2}
      viewBox="0 0 45 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="15" y="0" width="15" height="3" fill="#1a1a1a" />
      <rect x="13" y="3" width="19" height="3" fill="#1a1a1a" />
      <rect x="11" y="6" width="23" height="6" fill="#1a1a1a" />
      <rect x="16" y="7" width="13" height="3" fill="#D4AF37" />
      <rect x="8" y="4" width="3" height="3" fill="#C0C0C0" />
      <rect x="8" y="8" width="3" height="3" fill="#C0C0C0" />
      <rect x="8" y="12" width="3" height="3" fill="#C0C0C0" />
      <rect x="34" y="4" width="3" height="3" fill="#C0C0C0" />
      <rect x="34" y="8" width="3" height="3" fill="#C0C0C0" />
      <rect x="34" y="12" width="3" height="3" fill="#C0C0C0" />

      <rect x="16" y="12" width="13" height="2" fill="#FFFFF0" />

      <rect x="18" y="14" width="9" height="28" fill="#3D2314" />
      <rect x="19" y="14" width="7" height="28" fill="#1a1a1a" />
      <rect x="18" y="18" width="9" height="1" fill="#C0C0C0" />
      <rect x="18" y="23" width="9" height="1" fill="#C0C0C0" />
      <rect x="18" y="28" width="9" height="1" fill="#C0C0C0" />
      <rect x="18" y="33" width="9" height="1" fill="#C0C0C0" />
      <rect x="18" y="38" width="9" height="1" fill="#C0C0C0" />
      <rect x="21" y="20" width="3" height="2" fill="#E8E8E8" />
      <rect x="21" y="25" width="3" height="2" fill="#E8E8E8" />
      <rect x="21" y="30" width="3" height="2" fill="#E8E8E8" />
      <rect x="21" y="35" width="3" height="2" fill="#E8E8E8" />
      <rect x="20" y="14" width="1" height="28" fill="#E8E8E8" opacity="0.7" />
      <rect x="22" y="14" width="1" height="28" fill="#E8E8E8" opacity="0.7" />
      <rect x="24" y="14" width="1" height="28" fill="#E8E8E8" opacity="0.7" />

      <rect x="8" y="42" width="10" height="6" fill="#8B0000" />
      <rect x="27" y="42" width="10" height="6" fill="#8B0000" />
      <rect x="6" y="44" width="6" height="8" fill="#8B0000" />
      <rect x="33" y="44" width="6" height="8" fill="#8B0000" />

      <rect x="26" y="42" width="3" height="6" fill="#B22222" />

      <rect x="4" y="48" width="37" height="28" fill="#8B0000" />
      <rect x="6" y="76" width="33" height="6" fill="#8B0000" />
      <rect x="10" y="82" width="25" height="4" fill="#8B0000" />
      <rect x="14" y="86" width="17" height="3" fill="#8B0000" />

      <rect x="4" y="48" width="4" height="28" fill="#5C0000" />
      <rect x="37" y="48" width="4" height="28" fill="#5C0000" />
      <rect x="4" y="72" width="37" height="4" fill="#5C0000" />

      <rect x="14" y="52" width="17" height="18" fill="#B8860B" />
      <rect x="16" y="54" width="13" height="14" fill="#DAA520" />
      <rect x="18" y="56" width="9" height="10" fill="#FFD700" />

      <rect x="4" y="48" width="1" height="28" fill="#FFFFF0" />
      <rect x="40" y="48" width="1" height="28" fill="#FFFFF0" />
      <rect x="6" y="76" width="1" height="6" fill="#FFFFF0" />
      <rect x="38" y="76" width="1" height="6" fill="#FFFFF0" />

      <rect x="6" y="50" width="10" height="14" fill="#1a1a1a" />
      <rect x="8" y="64" width="6" height="4" fill="#1a1a1a" />

      <rect x="16" y="50" width="13" height="5" fill="#C0C0C0" />
      <rect x="17" y="51" width="11" height="3" fill="#1a1a1a" />
      <rect x="18" y="52" width="9" height="1" fill="#333" />
      <rect x="18" y="51" width="1" height="3" fill="#666" />
      <rect x="20" y="51" width="1" height="3" fill="#666" />
      <rect x="22" y="51" width="1" height="3" fill="#666" />
      <rect x="24" y="51" width="1" height="3" fill="#666" />
      <rect x="26" y="51" width="1" height="3" fill="#666" />

      <rect x="16" y="60" width="13" height="5" fill="#C0C0C0" />
      <rect x="17" y="61" width="11" height="3" fill="#1a1a1a" />
      <rect x="18" y="62" width="9" height="1" fill="#333" />
      <rect x="18" y="61" width="1" height="3" fill="#666" />
      <rect x="20" y="61" width="1" height="3" fill="#666" />
      <rect x="22" y="61" width="1" height="3" fill="#666" />
      <rect x="24" y="61" width="1" height="3" fill="#666" />
      <rect x="26" y="61" width="1" height="3" fill="#666" />

      <rect x="14" y="68" width="17" height="3" fill="#C0C0C0" />
      <rect x="15" y="69" width="15" height="1" fill="#888" />

      <rect x="16" y="74" width="13" height="4" fill="#C0C0C0" />
      <rect x="17" y="75" width="11" height="2" fill="#888" />

      <rect x="7" y="46" width="4" height="3" fill="#1a1a1a" />
      <rect x="8" y="44" width="2" height="2" fill="#FFFFF0" />

      <rect x="26" y="70" width="5" height="5" fill="#D4AF37" />
      <rect x="27" y="71" width="3" height="3" fill="#B8860B" />
      <rect x="33" y="70" width="5" height="5" fill="#D4AF37" />
      <rect x="34" y="71" width="3" height="3" fill="#B8860B" />
      <rect x="26" y="78" width="5" height="5" fill="#D4AF37" />
      <rect x="27" y="79" width="3" height="3" fill="#B8860B" />
      <rect x="33" y="78" width="5" height="5" fill="#D4AF37" />
      <rect x="34" y="79" width="3" height="3" fill="#B8860B" />
    </svg>
  )
}

function TelecasterSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 2.2}
      viewBox="0 0 40 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="15" y="0" width="14" height="3" fill="#3B2507" />
      <rect x="13" y="3" width="18" height="12" fill="#3B2507" />
      <rect x="16" y="5" width="12" height="3" fill="#4A3010" />
      <rect x="28" y="3" width="4" height="3" fill="#C0C0C0" />
      <rect x="28" y="6" width="4" height="3" fill="#C0C0C0" />
      <rect x="28" y="9" width="4" height="3" fill="#C0C0C0" />
      <rect x="28" y="12" width="4" height="3" fill="#C0C0C0" />
      <rect x="10" y="6" width="4" height="3" fill="#C0C0C0" />
      <rect x="10" y="9" width="4" height="3" fill="#C0C0C0" />

      <rect x="15" y="15" width="10" height="2" fill="#FFFFF0" />

      <rect x="16" y="17" width="8" height="32" fill="#F5DEB3" />
      <rect x="16" y="21" width="8" height="1" fill="#C0C0C0" />
      <rect x="16" y="26" width="8" height="1" fill="#C0C0C0" />
      <rect x="16" y="31" width="8" height="1" fill="#C0C0C0" />
      <rect x="16" y="36" width="8" height="1" fill="#C0C0C0" />
      <rect x="16" y="41" width="8" height="1" fill="#C0C0C0" />
      <rect x="16" y="46" width="8" height="1" fill="#C0C0C0" />
      <rect x="19" y="23" width="2" height="2" fill="#1a1a1a" />
      <rect x="19" y="28" width="2" height="2" fill="#1a1a1a" />
      <rect x="19" y="33" width="2" height="2" fill="#1a1a1a" />
      <rect x="19" y="38" width="2" height="2" fill="#1a1a1a" />
      <rect x="19" y="43" width="2" height="2" fill="#1a1a1a" />
      <rect x="17" y="17" width="1" height="32" fill="#C0C0C0" opacity="0.6" />
      <rect x="19" y="17" width="1" height="32" fill="#E0E0E0" opacity="0.6" />
      <rect x="21" y="17" width="1" height="32" fill="#E0E0E0" opacity="0.6" />
      <rect x="23" y="17" width="1" height="32" fill="#C0C0C0" opacity="0.6" />

      <rect x="4" y="49" width="32" height="32" fill="#4A90D9" />
      <rect x="6" y="81" width="28" height="4" fill="#4A90D9" />
      <rect x="10" y="85" width="20" height="2" fill="#4A90D9" />

      <rect x="4" y="45" width="12" height="4" fill="#4A90D9" />
      <rect x="2" y="47" width="8" height="6" fill="#4A90D9" />
      <rect x="0" y="49" width="6" height="8" fill="#4A90D9" />

      <rect x="2" y="75" width="4" height="6" fill="#4A90D9" />
      <rect x="34" y="75" width="4" height="6" fill="#4A90D9" />

      <rect x="4" y="49" width="6" height="10" fill="#5BA3E8" />
      <rect x="2" y="51" width="4" height="6" fill="#5BA3E8" />

      <rect x="30" y="65" width="6" height="16" fill="#3A7BBF" />
      <rect x="26" y="79" width="8" height="4" fill="#3A7BBF" />

      <rect x="4" y="51" width="18" height="18" fill="#1a1a1a" />
      <rect x="4" y="69" width="10" height="8" fill="#1a1a1a" />

      <rect x="14" y="53" width="12" height="6" fill="#C0C0C0" />
      <rect x="15" y="54" width="10" height="4" fill="#1a1a1a" />
      <rect x="16" y="55" width="8" height="2" fill="#333" />

      <rect x="12" y="66" width="18" height="8" fill="#C0C0C0" />
      <rect x="14" y="68" width="14" height="4" fill="#1a1a1a" />
      <rect x="15" y="69" width="12" height="2" fill="#333" />

      <rect x="10" y="64" width="22" height="12" fill="#C0C0C0" />
      <rect x="12" y="66" width="18" height="8" fill="#A0A0A0" />
      <rect x="14" y="72" width="2" height="2" fill="#888" />
      <rect x="17" y="72" width="2" height="2" fill="#888" />
      <rect x="20" y="72" width="2" height="2" fill="#888" />
      <rect x="23" y="72" width="2" height="2" fill="#888" />
      <rect x="26" y="72" width="2" height="2" fill="#888" />

      <rect x="24" y="78" width="10" height="6" fill="#C0C0C0" />
      <rect x="26" y="79" width="4" height="4" fill="#1a1a1a" />
      <rect x="27" y="80" width="2" height="2" fill="#333" />
      <rect x="31" y="79" width="3" height="4" fill="#1a1a1a" />

      <rect x="8" y="72" width="3" height="5" fill="#C0C0C0" />
      <rect x="9" y="71" width="1" height="2" fill="#FFFFF0" />

      <rect x="34" y="60" width="4" height="4" fill="#C0C0C0" />
      <rect x="35" y="61" width="2" height="2" fill="#1a1a1a" />
    </svg>
  )
}

function PRSSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 2}
      viewBox="0 0 44 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="16" y="0" width="12" height="3" fill="#1a1a1a" />
      <rect x="14" y="3" width="16" height="9" fill="#1a1a1a" />
      <rect x="18" y="4" width="8" height="5" fill="#222" />
      <rect x="20" y="5" width="4" height="3" fill="#D4AF37" />
      <rect x="10" y="3" width="4" height="3" fill="#C0C0C0" />
      <rect x="10" y="6" width="4" height="3" fill="#C0C0C0" />
      <rect x="10" y="9" width="4" height="3" fill="#C0C0C0" />
      <rect x="30" y="3" width="4" height="3" fill="#C0C0C0" />
      <rect x="30" y="6" width="4" height="3" fill="#C0C0C0" />
      <rect x="30" y="9" width="4" height="3" fill="#C0C0C0" />

      <rect x="16" y="12" width="12" height="2" fill="#FFFFF0" />

      <rect x="18" y="14" width="8" height="30" fill="#3D2314" />
      <rect x="19" y="14" width="6" height="30" fill="#2D1B0E" />
      <rect x="18" y="18" width="8" height="1" fill="#C0C0C0" />
      <rect x="18" y="23" width="8" height="1" fill="#C0C0C0" />
      <rect x="18" y="28" width="8" height="1" fill="#C0C0C0" />
      <rect x="18" y="33" width="8" height="1" fill="#C0C0C0" />
      <rect x="18" y="38" width="8" height="1" fill="#C0C0C0" />
      <rect x="20" y="19" width="4" height="3" fill="#E8E8E8" />
      <rect x="21" y="20" width="2" height="1" fill="#C0C0C0" />
      <rect x="20" y="25" width="4" height="2" fill="#E8E8E8" />
      <rect x="20" y="30" width="4" height="2" fill="#E8E8E8" />
      <rect x="20" y="35" width="4" height="2" fill="#E8E8E8" />
      <rect x="20" y="14" width="1" height="30" fill="#E8E8E8" opacity="0.6" />
      <rect x="22" y="14" width="1" height="30" fill="#E8E8E8" opacity="0.6" />
      <rect x="24" y="14" width="1" height="30" fill="#E8E8E8" opacity="0.6" />

      <rect x="8" y="44" width="10" height="6" fill="#1E3A5F" />
      <rect x="26" y="44" width="10" height="6" fill="#1E3A5F" />
      <rect x="6" y="46" width="6" height="8" fill="#1E3A5F" />
      <rect x="32" y="46" width="6" height="8" fill="#1E3A5F" />

      <rect x="16" y="44" width="4" height="4" fill="#2D5A8A" />
      <rect x="24" y="44" width="4" height="4" fill="#2D5A8A" />

      <rect x="4" y="50" width="36" height="26" fill="#1E3A5F" />
      <rect x="6" y="76" width="32" height="6" fill="#1E3A5F" />
      <rect x="10" y="82" width="24" height="4" fill="#1E3A5F" />
      <rect x="14" y="86" width="16" height="2" fill="#1E3A5F" />

      <rect x="4" y="50" width="4" height="26" fill="#0D1F33" />
      <rect x="36" y="50" width="4" height="26" fill="#0D1F33" />
      <rect x="4" y="72" width="36" height="4" fill="#0D1F33" />

      <rect x="10" y="52" width="24" height="20" fill="#2D5A8A" />

      <rect x="14" y="54" width="16" height="16" fill="#4A90D9" />
      <rect x="16" y="56" width="12" height="12" fill="#5BA3E8" />
      <rect x="18" y="58" width="8" height="8" fill="#7AB8F5" />

      <rect x="12" y="55" width="2" height="14" fill="#3A7BBF" opacity="0.5" />
      <rect x="16" y="55" width="2" height="14" fill="#3A7BBF" opacity="0.5" />
      <rect x="20" y="55" width="2" height="14" fill="#3A7BBF" opacity="0.5" />
      <rect x="24" y="55" width="2" height="14" fill="#3A7BBF" opacity="0.5" />
      <rect x="28" y="55" width="2" height="14" fill="#3A7BBF" opacity="0.5" />

      <rect x="4" y="50" width="1" height="26" fill="#FFFFF0" />
      <rect x="39" y="50" width="1" height="26" fill="#FFFFF0" />
      <rect x="6" y="76" width="1" height="6" fill="#FFFFF0" />
      <rect x="37" y="76" width="1" height="6" fill="#FFFFF0" />

      <rect x="15" y="52" width="14" height="5" fill="#C0C0C0" />
      <rect x="16" y="53" width="12" height="3" fill="#1a1a1a" />
      <rect x="17" y="54" width="10" height="1" fill="#333" />

      <rect x="15" y="62" width="14" height="5" fill="#C0C0C0" />
      <rect x="16" y="63" width="12" height="3" fill="#1a1a1a" />
      <rect x="17" y="64" width="10" height="1" fill="#333" />

      <rect x="14" y="70" width="16" height="6" fill="#C0C0C0" />
      <rect x="15" y="71" width="14" height="4" fill="#888" />
      <rect x="16" y="72" width="2" height="2" fill="#666" />
      <rect x="19" y="72" width="2" height="2" fill="#666" />
      <rect x="22" y="72" width="2" height="2" fill="#666" />
      <rect x="25" y="72" width="2" height="2" fill="#666" />

      <rect x="8" y="56" width="5" height="10" fill="#1a1a1a" />
      <rect x="9" y="58" width="3" height="6" fill="#333" />
      <rect x="10" y="60" width="1" height="3" fill="#FFFFF0" />

      <rect x="30" y="58" width="5" height="5" fill="#1a1a1a" />
      <rect x="31" y="59" width="3" height="3" fill="#333" />

      <rect x="32" y="66" width="5" height="5" fill="#1a1a1a" />
      <rect x="33" y="67" width="3" height="3" fill="#333" />
    </svg>
  )
}
