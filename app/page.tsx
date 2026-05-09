import Link from 'next/link'
import { Music } from 'lucide-react'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-blue via-accent-teal to-accent-green">
            <Music className="w-10 h-10 text-background" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">
            Guitar ScaleUp
          </h1>
          <p className="text-muted-foreground text-lg">
            방구석 기타리스트를 위한 스케일 시각화
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/guitar-scale"
            className="px-6 py-3 rounded-lg bg-accent-teal text-background font-medium hover:opacity-90 transition-opacity"
          >
            스케일 시각화 시작하기
          </Link>
        </div>
      </div>
    </div>
  )
}
