/** Ícone de bandeira quadriculada (checkered flag) usado como logo do site. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="3" width="2" height="27" rx="1" fill="#111111" />
      <g>
        <rect x="6" y="4" width="18" height="13" fill="#ffffff" />
        {[0, 1, 2, 3, 4, 5].map((col) =>
          [0, 1, 2, 3].map((row) => {
            const isBlack = (col + row) % 2 === 0;
            if (!isBlack) return null;
            return <rect key={`${col}-${row}`} x={6 + col * 3} y={4 + row * 3.25} width={3} height={3.25} fill="#111111" />;
          }),
        )}
      </g>
      <rect x="6" y="4" width="18" height="13" fill="none" stroke="#E10600" strokeWidth="0.6" />
    </svg>
  );
}
