import { FIBONACCI } from "../constants";

const getFibIndex = (value: number): number => {
  return FIBONACCI.indexOf(value);
};

const findClosestFib = (value: number): number => {
  return FIBONACCI.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
};


export const getScoreFromVote = (vote: number, average: number): number => {
  const avgRounded = findClosestFib(average);
  const voteIndex = getFibIndex(vote);
  const avgIndex = getFibIndex(avgRounded);

  if (voteIndex === -1 || avgIndex === -1) {
    console.warn("Vote or average not in Fibonacci scale:", vote, avgRounded);
    return 0;
  }

  const distance = Math.abs(voteIndex - avgIndex);

  if (distance === 0) return 5;
  if (distance === 1) return 3;
  if (distance === 2) return 2;
  return 0;
};

