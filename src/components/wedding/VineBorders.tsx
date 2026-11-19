import { weddingData } from "@/config/weddingData";

/** Climbing rose vines running down both edges of the invitation. */
export function VineBorders() {
  const style = {
    backgroundImage: `url(${weddingData.images.vine})`,
    backgroundSize: "46px auto",
    backgroundRepeat: "repeat-y",
  } as const;
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-[46px] animate-vine opacity-95" style={style} />
      <div
        className="absolute inset-y-0 right-0 w-[46px] animate-vine opacity-95"
        style={{ ...style, transform: "scaleX(-1)", backgroundPositionY: "120px", animationDelay: "-3s" }}
      />
    </div>
  );
}

/** Lightweight drifting petals and leaves layered over the invitation. */
export function PetalField() {
  const petals = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div
      className="pointer-events-none fixed inset-y-0 left-1/2 z-20 w-full max-w-[480px] -translate-x-1/2 overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((i) => {
        const leaf = i % 3 === 0;
        return (
          <span
            key={i}
            className={`absolute top-0 block animate-petal ${leaf ? "bg-sage/50" : "bg-blush/70"}`}
            style={
              {
                left: `${(i * 37) % 100}%`,
                width: leaf ? 7 : 9,
                height: leaf ? 12 : 9,
                borderRadius: leaf ? "0 100% 0 100%" : "100% 0 100% 0",
                "--dur": `${12 + (i % 5) * 3}s`,
                "--delay": `${-i * 2.1}s`,
                "--drift": `${(i % 2 ? 1 : -1) * (30 + (i % 4) * 20)}px`,
                "--spin": `${(i % 2 ? 1 : -1) * 420}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
