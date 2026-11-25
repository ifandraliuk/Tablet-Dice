export const getProfessionImageSrc = (id, sex) => {
  const folder = sex === "männlich" ? "m/" : sex === "weiblich" ? "w/" : "";
  return `/classes_img/${folder}${id}.svg`;
};

export const handleProfessionImageError = (event, id) => {
  const image = event.currentTarget;
  const fallback = `/classes_img/${id}.svg`;
  console.warn("Professionsbild nicht gefunden:", image.getAttribute("src"));
  if (image.getAttribute("src") !== fallback) {
    image.src = fallback;
    return false;
  }
  return true;
};
