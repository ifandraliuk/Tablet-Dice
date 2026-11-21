const originColors = {
  Algor: "#cc4749",
  Beltamor: "#308fe8",
  Ethelion: "#2b9348",
  Medorien: "#cb6327",
  Thamor: "#c9a7ff",
  Thornheim: "#95ecff",
  Welles: "rgb(245, 235, 130)",
};

const originAccentColors = {
  Algor: {
    border: "rgba(204, 71, 73, 0.45)",
    subtle: "rgba(204, 71, 73, 0.08)",
    hover: "rgba(204, 71, 73, 0.14)",
  },
  Beltamor: {
    border: "rgba(48, 143, 232, 0.45)",
    subtle: "rgba(48, 143, 232, 0.08)",
    hover: "rgba(48, 143, 232, 0.14)",
  },
  Ethelion: {
    border: "rgba(43, 147, 72, 0.45)",
    subtle: "rgba(43, 147, 72, 0.08)",
    hover: "rgba(43, 147, 72, 0.14)",
  },
  Medorien: {
    border: "rgba(203, 99, 39, 0.45)",
    subtle: "rgba(203, 99, 39, 0.08)",
    hover: "rgba(203, 99, 39, 0.14)",
  },
  Thamor: {
    border: "rgba(201, 167, 255, 0.45)",
    subtle: "rgba(201, 167, 255, 0.08)",
    hover: "rgba(201, 167, 255, 0.14)",
  },
  Thornheim: {
    border: "rgba(149, 236, 255, 0.45)",
    subtle: "rgba(149, 236, 255, 0.08)",
    hover: "rgba(149, 236, 255, 0.14)",
  },
  Welles: {
    border: "rgba(245, 235, 130, 0.45)",
    subtle: "rgba(245, 235, 130, 0.08)",
    hover: "rgba(245, 235, 130, 0.14)",
  },
};

export const getOriginAccentStyle = (origin) => {
  const originName = origin?.trim().split(/\s+/).pop();
  const color = originColors[originName] || "rgb(249, 199, 79)";
  const accent = originAccentColors[originName] || {
    border: "rgba(249, 199, 79, 0.45)",
    subtle: "rgba(249, 199, 79, 0.08)",
    hover: "rgba(249, 199, 79, 0.14)",
  };

  return {
    "--diary-origin-color": color,
    "--diary-origin-border": accent.border,
    "--diary-origin-subtle": accent.subtle,
    "--diary-origin-hover": accent.hover,
  };
};

export default originColors;
