import { calculateSpaces, formatReadableDate } from "./utils/utils.mjs";

test("returns revision dates as one week, one month, three months, six months and one year from the given date", () => {
  const givenDate = "2026-07-19";

  const expectedResult = [
    "26th July 2026",
    "19th August 2026",
    "19th October 2026",
    "19th January 2027",
    "19th July 2027",
  ];
  const calculatedResults = calculateSpaces(givenDate).map((date) =>
    formatReadableDate(date),
  );

  expect(calculatedResults).toEqual(expectedResult);
});
