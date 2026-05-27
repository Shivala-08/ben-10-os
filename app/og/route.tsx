import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const alien = searchParams.get('alien') || 'OMNITRIX OS';
  const color = searchParams.get('color') || '#00FF41';

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: `10px solid ${color}`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ color, fontSize: 75, fontWeight: 900, fontFamily: 'sans-serif', letterSpacing: '4px' }}>
          ⬡ OMNITRIX OS
        </div>
        <div
          style={{
            color: '#ffffff',
            fontSize: 38,
            marginTop: 25,
            textTransform: 'uppercase',
            fontFamily: 'monospace',
            letterSpacing: '2px',
          }}
        >
          {alien}
        </div>
        <div style={{ color: '#555555', fontSize: 20, marginTop: 45, fontFamily: 'monospace' }}>
          ben-10-os.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
