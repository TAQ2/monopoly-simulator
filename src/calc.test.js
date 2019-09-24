import { goBackThree } from "./calc";

test("goes back three", () => {
  expect(goBackThree(3, 3)).toBe(0);
});

test("goes back three back round the board", () => {
  expect(goBackThree(2, 3)).toBe(2);
});
