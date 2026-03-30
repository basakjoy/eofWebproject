import Image from 'next/image';

export function LogoIcon({ size = 45, rounded = true, className = '' }: { size?: number; rounded?: boolean; className?: string }) {
  return (
    <div className={`flex items-center justify-center ${rounded ? 'rounded-lg' : ''} overflow-hidden ${className}`} style={{ width: size, height: size }}>
      <Image 
        src="/images/eoflogo.png" 
        alt="Empire of Forex" 
        width={size} 
        height={size}
        priority
      />
    </div>
  );
}
