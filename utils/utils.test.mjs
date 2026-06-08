import { calculateSpaces } from "./utils.mjs";

it("returns spaces from given date", () => {
  const givenDate = "2026-07-19";
  const spaces = calculateSpaces(givenDate);

  const expectedSpaces = [
    "2026-07-26",
    "2026-08-19",
    "2026-10-19",
    "2027-01-19",
    "2027-07-19",
  ];

  expect(expectedSpaces).toEqual(spaces);
  expect(spaces).toHaveLength(5);
});
