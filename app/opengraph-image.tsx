import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadKoreanFont(text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`
  const css = await (await fetch(cssUrl)).text()
  const match = css.match(
    /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/
  )
  if (!match)
    throw new Error('Korean font source not found in Google Fonts response')
  const fontRes = await fetch(match[1])
  return fontRes.arrayBuffer()
}

export default async function Image() {
  const fontData = await loadKoreanFont(`${SITE_NAME}${SITE_DESCRIPTION}`)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 96,
          height: 96,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #3b82f6, #14b8a6, #22c55e)',
        }}
      />
      <div
        style={{
          display: 'flex',
          fontFamily: 'Noto Sans KR',
          fontSize: 72,
          fontWeight: 700,
          color: '#fafafa',
        }}
      >
        {SITE_NAME}
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: 'Noto Sans KR',
          fontSize: 36,
          color: '#a3a3a3',
        }}
      >
        {SITE_DESCRIPTION}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Noto Sans KR', data: fontData, style: 'normal', weight: 700 },
      ],
    }
  )
}
