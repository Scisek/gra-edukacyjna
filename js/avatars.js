export const AVATARS = [
  { id: "kot", label: "Kot", collection: "kot", collects: "Koty", src: "assets/avatars/kot.svg" },
  { id: "pies", label: "Pies", collection: "pies", collects: "Psy", src: "assets/avatars/pies.svg" },
  { id: "dinozaur", label: "Dinozaur", collection: "dino", collects: "Dinozaury", src: "assets/avatars/dinozaur.svg" },
  { id: "komputer", label: "Komputer", collection: "komputer", collects: "Komputery", src: "assets/avatars/komputer.svg" },
  { id: "gora", label: "Góra", collection: "gory", collects: "Szczyty", src: "assets/avatars/gora.svg" },
  { id: "genealog", label: "Drzewo", collection: "genealog", collects: "Genealogia", src: "assets/avatars/genealog.svg" },
  { id: "panda", label: "Panda", collection: "kot", collects: "Koty", src: "assets/avatars/panda.svg" },
  { id: "lis", label: "Lis", collection: "pies", collects: "Psy", src: "assets/avatars/lis.svg" },
  { id: "sowa", label: "Sowa", collection: "dino", collects: "Dinozaury", src: "assets/avatars/sowa.svg" },
  { id: "zajac", label: "Zając", collection: "gory", collects: "Szczyty", src: "assets/avatars/zajac.svg" },
  { id: "jelen", label: "Jeleń", collection: "gory", collects: "Szczyty", src: "assets/avatars/jelen.svg" },
  { id: "niedzwiedz", label: "Niedźwiedź", collection: "pies", collects: "Psy", src: "assets/avatars/niedzwiedz.svg" },
  { id: "wieloryb", label: "Wieloryb", collection: "dino", collects: "Dinozaury", src: "assets/avatars/wieloryb.svg" },
];

export function avatarById(id) {
  if (id === "rodzic") return { id: "rodzic", label: "Rodzic", collection: "kot", collects: "Koty", src: "assets/avatars/rodzic.svg" };
  return AVATARS.find((item) => item.id === id) || AVATARS[0];
}

export function collectionForAvatar(id) {
  const avatar = avatarById(id);
  return avatar.collection || "kot";
}
