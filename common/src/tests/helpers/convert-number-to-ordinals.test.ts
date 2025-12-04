import { convertNumberToOrdinals } from '../../helpers/convert-number-to-ordinals';

describe("convertNumberToOrdinals", () => {
  describe('Correct', () => {
    const outcomes = new Map([
      [1, '1st'],
      [2, '2nd'],
      [3, '3rd'],
      [4, '4th'],
      [10, '10th'],
      [11, '11th'],
      [18, '18th'],
      [21, '21st'],
      [42, '42nd'],
      [103, '103rd'],
    ])

    for (const [num, ordinal] of outcomes) {
      it(`Should convert ${num} to ${ordinal}`, () => {
        expect(convertNumberToOrdinals(num)).toEqual(ordinal)
      })
    }
  })
});
