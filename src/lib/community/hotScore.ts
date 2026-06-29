export function hotScore(score: number, createdAt: string): number {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3_600_000
  return Math.log(Math.max(score, 1)) - ageHours / 45
}
