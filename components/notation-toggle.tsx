"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NotationToggleProps {
  type: "alphabetical" | "syllabic"
  onTypeChange: (type: "alphabetical" | "syllabic") => void
}

export function NotationToggle({ type, onTypeChange }: NotationToggleProps) {
  return (
    <div className="relative inline-flex p-1 bg-muted rounded-lg">
      <button
        onClick={() => onTypeChange("alphabetical")}
        className={cn(
          "relative z-10 px-4 py-2 text-sm font-medium transition-colors rounded-md",
          type === "alphabetical" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Alphabetical
      </button>
      <button
        onClick={() => onTypeChange("syllabic")}
        className={cn(
          "relative z-10 px-4 py-2 text-sm font-medium transition-colors rounded-md",
          type === "syllabic" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Syllabic (Solfège)
      </button>
      <motion.div
        layoutId="notation-toggle"
        className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm"
        initial={false}
        animate={{
          left: type === "alphabetical" ? "4px" : "50%",
          right: type === "alphabetical" ? "50%" : "4px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  )
}
