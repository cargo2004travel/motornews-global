import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const cols = 4;
  const rows = 4;
  const cell = 180 / cols;
  const squares = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isBlack = (row + col) % 2 === 0;
      squares.push(
        <div
          key={`${row}-${col}`}
          style={{
            position: "absolute",
            left: col * cell,
            top: row * cell,
            width: cell,
            height: cell,
            background: isBlack ? "#111111" : "#ffffff",
          }}
        />,
      );
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: "#E10600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: 130, height: 130, display: "flex", border: "4px solid #ffffff" }}>
          {squares}
        </div>
      </div>
    ),
    { ...size },
  );
}
