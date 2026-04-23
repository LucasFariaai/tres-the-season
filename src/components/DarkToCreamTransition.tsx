const DarkToCreamTransition = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(400px, 50vw, 640px)",
        overflow: "hidden",
        backgroundColor: "#1b1310",
      }}
    >
      {/* Base vertical gradient — very gradual, 26 stops */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom,
            #1b1310 0%,
            #1c1411 4%,
            #1e1512 8%,
            #201713 12%,
            #231916 17%,
            #271c18 22%,
            #2c201b 27%,
            #32261f 32%,
            #3a2e26 37%,
            #46392f 42%,
            #57483a 47%,
            #6a5a49 52%,
            #816d5b 57%,
            #98836f 62%,
            #af9b87 67%,
            #c4b09d 72%,
            #d4c5b0 77%,
            #ddd0bf 81%,
            #e5d9ca 85%,
            #ece2d5 88%,
            #f0e8dc 91%,
            #f3ece2 93%,
            #f5efe7 95%,
            #f6f0e9 97%,
            #f7f1eb 99%,
            #f7f2ee 100%
          )`,
        }}
      />

      {/* Organic mist blob — left, rises higher */}
      <div
        style={{
          position: "absolute",
          left: "-10%",
          top: "22%",
          width: "55%",
          height: "60%",
          borderRadius: "40% 60% 55% 45% / 50% 45% 55% 50%",
          background: "radial-gradient(ellipse at center, rgba(27,19,16,0.55) 0%, rgba(27,19,16,0.25) 45%, transparent 72%)",
          filter: "blur(48px)",
          transform: "rotate(-8deg)",
        }}
      />

      {/* Organic mist blob — right, dips lower */}
      <div
        style={{
          position: "absolute",
          right: "-8%",
          top: "38%",
          width: "50%",
          height: "55%",
          borderRadius: "55% 45% 50% 50% / 45% 55% 45% 55%",
          background: "radial-gradient(ellipse at center, rgba(27,19,16,0.5) 0%, rgba(27,19,16,0.2) 45%, transparent 70%)",
          filter: "blur(56px)",
          transform: "rotate(5deg)",
        }}
      />

      {/* Center breath of darkness — asymmetric */}
      <div
        style={{
          position: "absolute",
          left: "30%",
          top: "28%",
          width: "45%",
          height: "50%",
          borderRadius: "50% 50% 45% 55% / 55% 50% 50% 45%",
          background: "radial-gradient(ellipse at 45% 40%, rgba(27,19,16,0.4) 0%, transparent 65%)",
          filter: "blur(64px)",
        }}
      />

      {/* Soft film grain overlay to kill banding */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />
    </div>
  );
};

export default DarkToCreamTransition;
