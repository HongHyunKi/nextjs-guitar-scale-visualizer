'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 서버 렌더 시 테마를 알 수 없으므로 마운트 후에만 아이콘 표시
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="테마 전환"
    >
      {mounted &&
        (isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
    </Button>
  )
}
