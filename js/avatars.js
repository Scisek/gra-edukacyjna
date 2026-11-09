export const AVATARS = [
  { id: "lis", label: "Lis", src: "assets/avatars/lis.svg" },
  { id: "sowa", label: "Sowa", src: "assets/avatars/sowa.svg" },
  { id: "niedzwiedz", label: "Niedźwiedź", src: "assets/avatars/niedzwiedz.svg" },
  { id: "kot", label: "Kot", src: "assets/avatars/kot.svg" },
  { id: "jelen", label: "Jeleń", src: "assets/avatars/jelen.svg" },
  { id: "wieloryb", label: "Wieloryb", src: "assets/avatars/wieloryb.svg" },
  { id: "panda", label: "Panda", src: "assets/avatars/panda.svg" },
  { id: "zajac", label: "Zając", src: "assets/avatars/zajac.svg" },
];

export function avatarById(id) {
  if (id === "rodzic") return { id: "rodzic", label: "Rodzic", src: "assets/avatars/rodzic.svg" };
  return AVATARS.find((item) => item.id === id) || AVATARS[0];
}
