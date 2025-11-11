import React from "react";

type EnvId = "garden" | "living_room" | "table" | "floor" | "other";

const environments: Array<{ id: EnvId; label: string }> = [
  { id: "garden", label: "Jardín" },
  { id: "living_room", label: "Sala" },
  { id: "table", label: "Mesa" },
  { id: "floor", label: "Piso" },
  { id: "other", label: "Otro" },
];

// Busca /intro/spaces/<id>.jpg|png|webp en public
const srcFor = (id: EnvId) => [
  `/intro/spaces/${id}.webp`,
  `/intro/spaces/${id}.jpg`,
  `/intro/spaces/${id}.png`,
];

const Tile: React.FC<{ id: EnvId; label: string }> = ({ id, label }) => {
  const [failedAll, setFailedAll] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const candidates = srcFor(id);

  const onError = () => {
    if (idx < candidates.length - 1) setIdx(idx + 1);
    else setFailedAll(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card">
      {!failedAll && (
        <img
          src={candidates[idx]}
          alt={label}
          className="h-40 w-full object-cover md:h-56"
          loading="lazy"
          decoding="async"
          onError={onError}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
        <div className="text-sm md:text-base font-semibold">{label}</div>
      </div>
    </div>
  );
};

const NumberedTile: React.FC<{ index: number; onSuccess: () => void }> = ({ index, onSuccess }) => {
  const [i, setI] = React.useState(0);
  const [hidden, setHidden] = React.useState(false);
  const candidates = [
    `/intro/spaces/${index}.jpeg`,
    `/intro/spaces/${index}.jpg`,
    `/intro/spaces/${index}.png`,
    `/intro/spaces/${index}.webp`,
  ];
  const src = candidates[i];
  if (hidden) return null;
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card">
      <img
        src={src}
        alt={`espacio ${index}`}
        className="h-40 w-full object-cover md:h-56"
        loading="lazy"
        decoding="async"
        onLoad={onSuccess}
        onError={() => {
          if (i < candidates.length - 1) setI(i + 1);
          else setHidden(true);
        }}
      />
    </div>
  );
};

const EnvironmentShowcase: React.FC = () => {
  const [numberedFound, setNumberedFound] = React.useState(0);
  const [custom, setCustom] = React.useState<Array<{ src: string; label: string }>>([]);

  React.useEffect(() => {
    fetch("/intro/spaces.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setCustom(data);
      })
      .catch(() => {});
  }, []);

  const hasCustom = custom.length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      {numberedFound > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 7 }, (_, k) => k + 1).map((n) => (
            <NumberedTile key={n} index={n} onSuccess={() => setNumberedFound((v) => v + 1)} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {hasCustom
            ? custom.map((c, i) => (
                <div key={i} className="relative overflow-hidden rounded-3xl border bg-card">
                  <img
                    src={c.src}
                    alt={c.label}
                    className="h-40 w-full object-cover md:h-56"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
                    <div className="text-sm md:text-base font-semibold">{c.label}</div>
                  </div>
                </div>
              ))
            : environments.map((env) => (
                <Tile key={env.id} id={env.id} label={env.label} />
              ))}
        </div>
      )}
    </div>
  );
};

export default EnvironmentShowcase;

