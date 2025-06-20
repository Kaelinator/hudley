import { expect, test } from 'vitest';
import { parse, calculateValue, types } from './formula';

// test('returns literal number for formula with only literal number', () => {
//   expect(calculateValue({}, 1, '5')).toEqual(5);
// });

test('parse returns single digit number', () => {
  expect(parse('0')).toEqual([{ type: types.NUMBER, value: 0 }]);
  expect(parse('5')).toEqual([{ type: types.NUMBER, value: 5 }]);
  expect(parse('9')).toEqual([{ type: types.NUMBER, value: 9 }]);
});

test('parse returns two digit number', () => {
  expect(parse('10')).toEqual([{ type: types.NUMBER, value: 10 }]);
  expect(parse('90')).toEqual([{ type: types.NUMBER, value: 90 }]);
});

test('parse returns n-digit number', () => {
  expect(parse('100')).toEqual([{ type: types.NUMBER, value: 100 }]);
  expect(parse('1050')).toEqual([{ type: types.NUMBER, value: 1050 }]);
});

test('parse returns number with decimal places', () => {
  expect(parse('1.1')).toEqual([{ type: types.NUMBER, value: 1.1 }]);
  expect(parse('.1')).toEqual([{ type: types.NUMBER, value: 0.1 }]);
  expect(parse('.0')).toEqual([{ type: types.NUMBER, value: 0 }]);
});

test('parse throws with multiple decimal places', () => {
  expect(() => parse('1.1.')).toThrowError();
  expect(() => parse('.1.')).toThrowError();
  expect(() => parse('..1')).toThrowError();
  expect(() => parse('..')).toThrowError();
  expect(() => parse('.')).toThrowError();
});

test('handles whitespace before and after', () => {
  expect(parse(' .0')).toEqual([{ type: types.NUMBER, value: 0 }]);
  expect(parse('.0 ')).toEqual([{ type: types.NUMBER, value: 0 }]);
  expect(parse('  .0   ')).toEqual([{ type: types.NUMBER, value: 0 }]);
});

test('returns two numbers', () => {
  expect(parse('0 1')).toEqual([
    { type: types.NUMBER, value: 0 },
    { type: types.NUMBER, value: 1 },
  ]);
  expect(parse('10.01 5.55')).toEqual([
    { type: types.NUMBER, value: 10.01 },
    { type: types.NUMBER, value: 5.55 },
  ]);
  expect(parse('  10.01 5.55  ')).toEqual([
    { type: types.NUMBER, value: 10.01 },
    { type: types.NUMBER, value: 5.55 },
  ]);
});

test('returns n numbers', () => {
  expect(parse('  0 1 232 3.14  ')).toEqual([
    { type: types.NUMBER, value: 0 },
    { type: types.NUMBER, value: 1 },
    { type: types.NUMBER, value: 232 },
    { type: types.NUMBER, value: 3.14 },
  ]);
});
