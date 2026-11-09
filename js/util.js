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

export function recallWeight(stat) {
  if (!stat) return 1;
  const wrong = stat.wrong || 0;
  const correct = stat.correct || 0;
  if (correct >= 3 && wrong === 0) return 0.3;
  return 1 + wrong * 3 + Math.max(0, wrong - correct);
}

export function weightedPick(list, weightOf) {
  if (!list.length) return null;
  const weights = list.map((item) => Math.max(0.2, weightOf(item)));
  let total = 0;
  for (const weight of weights) total += weight;
  let roll = Math.random() * total;
  for (let index = 0; index < list.length; index += 1) {
    roll -= weights[index];
    if (roll <= 0) return list[index];
  }
  return list[list.length - 1];
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
