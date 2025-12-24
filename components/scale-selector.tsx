"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ScaleSelectorProps {
  scaleType: "major" | "pentatonic"
  onScaleTypeChange: (type: "major" | "pentatonic") => void
}

export function ScaleSelector({ scaleType, onScaleTypeChange }: ScaleSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={scaleType === "major" ? "default" : "outline"}
        onClick={() => onScaleTypeChange("major")}
        className={cn(
          "flex-1 transition-all",
          scaleType === "major" && "bg-accent-teal text-background hover:bg-accent-teal/90",
        )}
      >
        Major Scale
      </Button>
      <Button
        variant={scaleType === "pentatonic" ? "default" : "outline"}
        onClick={() => onScaleTypeChange("pentatonic")}
        className={cn(
          "flex-1 transition-all",
          scaleType === "pentatonic" && "bg-accent-teal text-background hover:bg-accent-teal/90",
        )}
      >
        Pentatonic
      </Button>
    </div>
  )
}
