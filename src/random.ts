
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max))
}

export function getRandomBool(): boolean {
  return Math.random() > 0.5
}

export function getRandomBetween(from: number, to: number): number {
  return from + getRandomInt(from - to)
}