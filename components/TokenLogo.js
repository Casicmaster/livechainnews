import { useState } from 'react';
import { getTokenMeta } from '../lib/utils';

// Shows the real coin logo. If missing or fails to load,
// falls back to the colored letter circle.
export default function TokenLogo({ symbol, image, size = 34 }) {
  const [failed, setFailed] = useState(false);
  const meta = getTokenMeta(symbol);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={symbol}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          flexShrink: 0,
          objectFit: 'cover',
          background: '#0d1117',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 800,
        flexShrink: 0,
        fontFamily: 'var(--font-mono)',
        background: meta.bg,
        color: meta.color,
      }}
    >
      {meta.icon}
    </div>
  );
}