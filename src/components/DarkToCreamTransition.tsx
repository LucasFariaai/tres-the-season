import React from 'react';

const DarkToCreamTransition: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #1A1410 0%, #1A1410 5%, #1D1712 10%, #211B15 16%, #271F18 22%, #30261D 29%, #3D3224 36%, #4F4332 44%, #675A48 52%, #847660 60%, #A29580 68%, #BDB09A 75%, #D4C9B4 82%, #E4DBC8 88%, #EDE5D4 93%, #F5EFE6 100%)',
      }}
    >
      {/* Left edge shadow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '35%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(26,20,16,0.85) 0%, rgba(26,20,16,0.5) 30%, rgba(26,20,16,0.15) 65%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Right edge shadow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '35%',
          height: '100%',
          background: 'linear-gradient(to left, rgba(26,20,16,0.85) 0%, rgba(26,20,16,0.5) 30%, rgba(26,20,16,0.15) 65%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Bottom corners extra hold */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '45%',
          background: 'radial-gradient(ellipse 55% 70% at 50% 100%, transparent 0%, transparent 40%, rgba(26,20,16,0.25) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default DarkToCreamTransition;
