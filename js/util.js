export function shuffle(list) {
  const copy = list.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function numericOptions(correct, count, ceiling) {
  const values = [correct];
  const seen = new Set([correct]);
  const deltas = [1, -1, 2, -2, 10, -10, 3, -3, 5, -5, 4, -4, 20, -20, 100, -100, 6, -6, 7, 8, 9];
  for (const delta of deltas) {
    if (values.length >= count) break;
    const next = correct + delta;
    if (next >= 0 && next <= ceiling && !seen.has(next)) {
      seen.add(next);
      values.push(next);
    }
  }
  let step = 1;
  while (values.length < count && step < 400) {
    const next = Math.max(0, correct + (step % 2 === 0 ? step : -step));
    if (!seen.has(next)) {
      seen.add(next);
      values.push(next);
    }
    step += 1;
  }
  return shuffle(values).map((value) => ({ id: String(value), label: String(value) }));
}
