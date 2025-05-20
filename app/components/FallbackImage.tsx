'use client';

import { useState } from 'react';
import Image from 'next/image';

type FallbackImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function FallbackImage({ src, alt, width, height }: FallbackImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? '/fallback.png' : src} // Replace with a fallback image if an error occurs
      alt={alt}
      width={width}
      height={height}
      onError={() => setHasError(true)} // Handle the error and set fallback
    />
  );
}