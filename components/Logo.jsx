import Image from 'next/image'

const DARK_LOGO_SRC = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Blue-and-Black-Minimalist-Brand-Logo-3-1768609870958.png?width=8000&height=8000&resize=contain'
const LIGHT_LOGO_SRC = 'https://convos.store/_next/image?url=%2FUntitled%20design-3.png&w=256&q=75'

const sizes = {
  sm: { width: 100, height: 28 },
  md: { width: 140, height: 38 },
  lg: { width: 180, height: 48 },
}

export function Logo({ className = '', size = 'md', theme = 'dark' }) {
  const { width, height } = sizes[size]
  const src = theme === 'light' ? LIGHT_LOGO_SRC : DARK_LOGO_SRC
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={src}
        alt="Convos"
        width={width}
        height={height}
        className="object-contain w-auto h-auto"
        priority
        unoptimized
      />
    </div>
  )
}
