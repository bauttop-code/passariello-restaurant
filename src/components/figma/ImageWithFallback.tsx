import React, { useEffect, useMemo, useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [srcIndex, setSrcIndex] = useState(0)

  const buildFallbackSources = (inputSrc: string | undefined): string[] => {
    if (!inputSrc) return []
    const sources = [inputSrc]

    const extractDriveId = (url: string): string | null => {
      const fromThumbnail = url.match(/[?&]id=([A-Za-z0-9_-]+)/)?.[1]
      if (fromThumbnail) return fromThumbnail
      const fromDrivePath = url.match(/\/d\/([A-Za-z0-9_-]+)/)?.[1]
      if (fromDrivePath) return fromDrivePath
      return null
    }

    const id = extractDriveId(inputSrc)
    if (!id) return sources

    const candidates = [
      `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
      `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
      `https://drive.google.com/uc?export=view&id=${id}`,
      `https://drive.usercontent.google.com/download?id=${id}&export=view&authuser=0`,
      `https://lh3.googleusercontent.com/d/${id}=w1200`,
    ]

    candidates.forEach((candidate) => {
      if (!sources.includes(candidate)) sources.push(candidate)
    })

    return sources
  }

  const handleError = () => {
    if (srcIndex < srcCandidates.length - 1) {
      setSrcIndex((prev) => prev + 1)
      return
    }
    setDidError(true)
  }

  const { src, alt, style, className, referrerPolicy, ...rest } = props
  const srcCandidates = useMemo(() => buildFallbackSources(typeof src === 'string' ? src : undefined), [src])
  const currentSrc = srcCandidates[srcIndex] ?? src

  useEffect(() => {
    setDidError(false)
    setSrcIndex(0)
  }, [src])

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      referrerPolicy={referrerPolicy ?? 'no-referrer'}
      {...rest}
      onError={handleError}
    />
  )
}
