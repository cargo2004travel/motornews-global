import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const squares = [];
  const cols = 4;
  const rows = 4;
  const cell = 32 / cols;

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
          display: "flex",
          border: "2px solid #E10600",
        }}
      >
        {squares}
      </div>
    ),
    { ...size },
  );
}
