import { expect, test } from 'vitest';
import { parse, calculateValue, types } from './formula';

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

test('parses operators +, -, *, /', () => {
  expect(parse('+')).toEqual([{ type: types.OPERATOR, value: '+' }]);
  expect(parse('-')).toEqual([{ type: types.OPERATOR, value: '-' }]);
  expect(parse('*')).toEqual([{ type: types.OPERATOR, value: '*' }]);
  expect(parse('/')).toEqual([{ type: types.OPERATOR, value: '/' }]);
});

test('parses multiple operators', () => {
  expect(parse('++')).toEqual([
    { type: types.OPERATOR, value: '+' },
    { type: types.OPERATOR, value: '+' },
  ]);
  expect(parse('- -   -')).toEqual([
    { type: types.OPERATOR, value: '-' },
    { type: types.OPERATOR, value: '-' },
    { type: types.OPERATOR, value: '-' },
  ]);
  expect(parse('+-*/')).toEqual([
    { type: types.OPERATOR, value: '+' },
    { type: types.OPERATOR, value: '-' },
    { type: types.OPERATOR, value: '*' },
    { type: types.OPERATOR, value: '/' },
  ]);
});

test('parses operators and numbers', () => {
  expect(parse('5+5')).toEqual([
    { type: types.NUMBER, value: 5 },
    { type: types.OPERATOR, value: '+' },
    { type: types.NUMBER, value: 5 },
  ]);
  expect(parse('50+   0.500--5')).toEqual([
    { type: types.NUMBER, value: 50 },
    { type: types.OPERATOR, value: '+' },
    { type: types.NUMBER, value: 0.5 },
    { type: types.OPERATOR, value: '-' },
    { type: types.OPERATOR, value: '-' },
    { type: types.NUMBER, value: 5 },
  ]);
});

test('parses parenthesis', () => {
  expect(parse('(')).toEqual([{ type: types.PARENTHESIS, value: '(' }]);
  expect(parse(')')).toEqual([{ type: types.PARENTHESIS, value: ')' }]);
});

test('parses multiple parentheses', () => {
  expect(parse('()')).toEqual([
    { type: types.PARENTHESIS, value: '(' },
    { type: types.PARENTHESIS, value: ')' },
  ]);
  expect(parse('(()  ()')).toEqual([
    { type: types.PARENTHESIS, value: '(' },
    { type: types.PARENTHESIS, value: '(' },
    { type: types.PARENTHESIS, value: ')' },
    { type: types.PARENTHESIS, value: '(' },
    { type: types.PARENTHESIS, value: ')' },
  ]);
});

test('parses parentheses, operators, and numbers', () => {
  expect(parse('(5+5)')).toEqual([
    { type: types.PARENTHESIS, value: '(' },
    { type: types.NUMBER, value: 5 },
    { type: types.OPERATOR, value: '+' },
    { type: types.NUMBER, value: 5 },
    { type: types.PARENTHESIS, value: ')' },
  ])
});

test('parses identifier', () => {
  expect(parse('var')).toEqual([{ type: types.IDENTIFIER, value: 'var' }]);
  expect(parse('var0')).toEqual([{ type: types.IDENTIFIER, value: 'var0' }]);
});

test('parses multiple identifiers', () => {
  expect(parse('var0 var1')).toEqual([
    { type: types.IDENTIFIER, value: 'var0' },
    { type: types.IDENTIFIER, value: 'var1' },
  ]);
  expect(parse('x y z')).toEqual([
    { type: types.IDENTIFIER, value: 'x' },
    { type: types.IDENTIFIER, value: 'y' },
    { type: types.IDENTIFIER, value: 'z' },
  ]);
});

test('parses identifiers, numbers, operators, and parentheses', () => {
  expect(parse('(var0 + 10)')).toEqual([
    { type: types.PARENTHESIS, value: '(' },
    { type: types.IDENTIFIER, value: 'var0' },
    { type: types.OPERATOR, value: '+' },
    { type: types.NUMBER, value: 10 },
    { type: types.PARENTHESIS, value: ')' },
  ]);
  expect(parse('(var0+10*anotherVar/x)')).toEqual([
    { type: types.PARENTHESIS, value: '(' },
    { type: types.IDENTIFIER, value: 'var0' },
    { type: types.OPERATOR, value: '+' },
    { type: types.NUMBER, value: 10 },
    { type: types.OPERATOR, value: '*' },
    { type: types.IDENTIFIER, value: 'anotherVar' },
    { type: types.OPERATOR, value: '/' },
    { type: types.IDENTIFIER, value: 'x' },
    { type: types.PARENTHESIS, value: ')' },
  ]);
});

test('parses ambiguous formulae', () => {
  expect(parse('5var')).toEqual([
    { type: types.NUMBER, value: 5 },
    { type: types.IDENTIFIER, value: 'var' },
  ]);
  expect(parse('var200.5')).toEqual([
    { type: types.IDENTIFIER, value: 'var200' },
    { type: types.NUMBER, value: 0.5 },
  ]);
});

test('refuses to parse incorrect formulae', () => {
  expect(() => parse('var0.var1')).toThrowError('is not a number');
  expect(() => parse('(+.-)')).toThrowError('is not a number');
});
