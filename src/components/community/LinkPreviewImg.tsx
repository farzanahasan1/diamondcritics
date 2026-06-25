'use client'

interface Props {
  src: string
  alt: string
}

export default function LinkPreviewImg({ src, alt }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', display: 'block' }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}
