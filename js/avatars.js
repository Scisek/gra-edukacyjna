export const AVATARS = [
  { id: "kot", label: "Kot", collection: "kot", collects: "Koty", src: "assets/avatars/kot.svg" },
  { id: "pies", label: "Pies", collection: "pies", collects: "Psy", src: "assets/avatars/pies.svg" },
  { id: "niedzwiedz", label: "Niedźwiedź", collection: "niedzwiedz", collects: "Niedźwiedzie", src: "assets/avatars/niedzwiedz.svg" },
  { id: "dinozaur", label: "Dinozaur", collection: "dino", collects: "Dinozaury", src: "assets/avatars/dinozaur.svg" },
  { id: "komputer", label: "Komputer", collection: "komputer", collects: "Komputery", src: "assets/avatars/komputer.svg" },
  { id: "gora", label: "Góra", collection: "gory", collects: "Szczyty", src: "assets/avatars/gora.svg" },
  { id: "genealog", label: "Drzewo", collection: "genealog", collects: "Genealogia", src: "assets/avatars/genealog.svg" },
  { id: "kwiat", label: "Kwiat", collection: "kwiat", collects: "Kwiaty", src: "assets/avatars/kwiat.svg" },
  { id: "owoc", label: "Owoc", collection: "owoc", collects: "Owoce", src: "assets/avatars/owoc.svg" },
];

export function avatarById(id) {
  if (id === "rodzic") return { id: "rodzic", label: "Rodzic", collection: "kot", collects: "Koty", src: "assets/avatars/rodzic.svg" };
  return AVATARS.find((item) => item.id === id) || {
    id: id || "brak",
    label: "Obrazek",
    collection: null,
    collects: "",
    src: "assets/avatars/kot.svg",
  };
}

export function collectionForAvatar(id) {
  if (id === "rodzic") return "kot";
  return AVATARS.find((item) => item.id === id)?.collection || null;
}

export function avatarNeedsChoice(id) {
  return id !== "rodzic" && !AVATARS.some((item) => item.id === id);
}
