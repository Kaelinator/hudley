import { expect, test, describe } from 'vitest';
import {
  parse, infixToTree, types, evaluate, calculate, assertValidExpression, ExpressionError,
} from './formula';

describe('parse', () => {
  test('returns nothing', () => {
    expect(parse('')).toEqual([]);
  });

  test('returns single digit number', () => {
    expect(parse('0')).toEqual([{ type: types.NUMBER, value: 0 }]);
    expect(parse('5')).toEqual([{ type: types.NUMBER, value: 5 }]);
    expect(parse('9')).toEqual([{ type: types.NUMBER, value: 9 }]);
  });

  test('returns two digit number', () => {
    expect(parse('10')).toEqual([{ type: types.NUMBER, value: 10 }]);
    expect(parse('90')).toEqual([{ type: types.NUMBER, value: 90 }]);
  });

  test('returns n-digit number', () => {
    expect(parse('100')).toEqual([{ type: types.NUMBER, value: 100 }]);
    expect(parse('1050')).toEqual([{ type: types.NUMBER, value: 1050 }]);
  });

  test('returns number with decimal places', () => {
    expect(parse('1.1')).toEqual([{ type: types.NUMBER, value: 1.1 }]);
    expect(parse('.1')).toEqual([{ type: types.NUMBER, value: 0.1 }]);
    expect(parse('.0')).toEqual([{ type: types.NUMBER, value: 0 }]);
  });

  test('throws with multiple decimal places', () => {
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

  test('handles operators +, -, *, /, ^', () => {
    expect(parse('+')).toEqual([{ type: types.OPERATOR, value: '+' }]);
    expect(parse('-')).toEqual([{ type: types.OPERATOR, value: '-' }]);
    expect(parse('*')).toEqual([{ type: types.OPERATOR, value: '*' }]);
    expect(parse('/')).toEqual([{ type: types.OPERATOR, value: '/' }]);
    expect(parse('^')).toEqual([{ type: types.OPERATOR, value: '^' }]);
  });

  test('handles multiple operators', () => {
    expect(parse('++')).toEqual([
      { type: types.OPERATOR, value: '+' },
      { type: types.OPERATOR, value: '+' },
    ]);
    expect(parse('- -   -')).toEqual([
      { type: types.OPERATOR, value: '-' },
      { type: types.OPERATOR, value: '-' },
      { type: types.OPERATOR, value: '-' },
    ]);
    expect(parse('+-*/^')).toEqual([
      { type: types.OPERATOR, value: '+' },
      { type: types.OPERATOR, value: '-' },
      { type: types.OPERATOR, value: '*' },
      { type: types.OPERATOR, value: '/' },
      { type: types.OPERATOR, value: '^' },
    ]);
  });

  test('handles operators and numbers', () => {
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

  test('handles parenthesis', () => {
    expect(parse('(')).toEqual([{ type: types.PARENTHESIS, value: '(' }]);
    expect(parse(')')).toEqual([{ type: types.PARENTHESIS, value: ')' }]);
  });

  test('handles multiple parentheses', () => {
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

  test('handles parentheses, operators, and numbers', () => {
    expect(parse('(5+5)')).toEqual([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 5 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 5 },
      { type: types.PARENTHESIS, value: ')' },
    ]);
  });

  test('handles identifier', () => {
    expect(parse('var')).toEqual([{ type: types.IDENTIFIER, value: 'var' }]);
    expect(parse('var0')).toEqual([{ type: types.IDENTIFIER, value: 'var0' }]);
  });

  test('handles multiple identifiers', () => {
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

  test('handles identifiers, numbers, operators, and parentheses', () => {
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

  test('handles ambiguous formulae', () => {
    expect(parse('5var')).toEqual([
      { type: types.NUMBER, value: 5 },
      { type: types.IDENTIFIER, value: 'var' },
    ]);
    expect(parse('var200.5')).toEqual([
      { type: types.IDENTIFIER, value: 'var200' },
      { type: types.NUMBER, value: 0.5 },
    ]);
  });

  test('handles to parse incorrect formulae', () => {
    expect(() => parse('var0.var1')).toThrowError('is not a number');
    expect(() => parse('(+.-)')).toThrowError('is not a number');
  });
});

describe('infixToTree', () => {
  test('converts nothing', () => {
    expect(infixToTree([])).toEqual([]);
  });

  test('converts single number or identifier', () => {
    expect(infixToTree([
      { type: types.NUMBER, value: 5 },
    ])).toEqual([
      { type: types.NUMBER, value: 5 },
    ]);
    expect(infixToTree([
      { type: types.IDENTIFIER, value: 'e' },
    ])).toEqual([
      { type: types.IDENTIFIER, value: 'e' },
    ]);
  });

  test('converts single number and single operator', () => {
    expect(infixToTree([
      { type: types.NUMBER, value: 5 },
      { type: types.OPERATOR, value: '*' },
    ])).toEqual([
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 5 },
      null,
    ]);
  });

  test('converts negative identifier', () => {
    expect(infixToTree([
      { type: types.OPERATOR, value: '-' },
      { type: types.IDENTIFIER, value: 'a' },
    ])).toEqual([
      { type: types.OPERATOR, value: '-' },
      { type: types.NOOP },
      { type: types.IDENTIFIER, value: 'a' },
    ]);
  });

  test('converts single simple operation', () => {
    expect(infixToTree([
      { type: types.NUMBER, value: 5 },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 2 },
    ])).toEqual([
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 5 },
      { type: types.NUMBER, value: 2 },
    ]);
  });

  test('converts two operations of same priority', () => {
    expect(infixToTree([
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 3 },
      { type: types.OPERATOR, value: '-' },
      { type: types.NUMBER, value: 4 },
    ])).toEqual([
      { type: types.OPERATOR, value: '-' },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 4 },
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
      null, null,
    ]);

    expect(infixToTree([
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 3 },
      { type: types.OPERATOR, value: '/' },
      { type: types.NUMBER, value: 4 },
    ])).toEqual([
      { type: types.OPERATOR, value: '/' },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 4 },
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
      null, null,
    ]);
  });

  test('converts two operations of different priority', () => {
    expect(infixToTree([
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 3 },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 4 },
    ])).toEqual([
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '*' },
      null, null,
      { type: types.NUMBER, value: 3 },
      { type: types.NUMBER, value: 4 },
    ]);
  });

  test('converts multiple operations of different priority', () => {
    expect(infixToTree([
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 3 },
      { type: types.OPERATOR, value: '/' },
      { type: types.NUMBER, value: 4 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 5 },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 6 },
    ])).toEqual([
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '+' },
      null, null,
      { type: types.OPERATOR, value: '/' },
      { type: types.OPERATOR, value: '*' },
      null, null, null, null,
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 4 },
      { type: types.NUMBER, value: 5 },
      { type: types.NUMBER, value: 6 },
      null, null, null, null, null, null, null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
      null, null, null, null, null, null,
    ]);
  });

  test('converts with operators and parentheses', () => {
    expect(infixToTree([
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '*' },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 3 },
      { type: types.PARENTHESIS, value: ')' },
    ])).toEqual([
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 1 },
      { type: types.PARENTHESIS, value: '(' },
      null, null,
      { type: types.NOOP },
      { type: types.OPERATOR, value: '+' },
      null, null, null, null, null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ]);

    expect(infixToTree([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 2 },
      { type: types.PARENTHESIS, value: ')' },
    ])).toEqual([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NOOP },
      { type: types.OPERATOR, value: '+' },
      null, null,
      { type: types.NUMBER, value: 1 },
      { type: types.NUMBER, value: 2 },
    ]);

    expect(infixToTree([
      { type: types.NUMBER, value: 1 },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 3 },
      { type: types.PARENTHESIS, value: ')' },
    ])).toEqual([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '+' },
      null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ]);

    expect(infixToTree([
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 2 },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 3 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 4 },
      { type: types.PARENTHESIS, value: ')' },
    ])).toEqual([
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 1 },
      { type: types.PARENTHESIS, value: '(' },
      null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      null, null, null, null, null, null,
      { type: types.NUMBER, value: 3 },
      { type: types.NUMBER, value: 4 },
    ]);

    expect(infixToTree([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 3 },
      { type: types.PARENTHESIS, value: ')' },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 2 },
    ])).toEqual([
      { type: types.OPERATOR, value: '*' },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 2 },
      { type: types.NOOP },
      { type: types.OPERATOR, value: '+' },
      null, null, null, null,
      { type: types.NUMBER, value: 1 },
      { type: types.NUMBER, value: 3 },
      null, null, null, null,
    ]);
  });

  test('converts with multiple sets of parentheses', () => {
    expect(infixToTree([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '+' },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 3 },
      { type: types.PARENTHESIS, value: ')' },
      { type: types.PARENTHESIS, value: ')' },
    ])).toEqual([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NOOP },
      { type: types.OPERATOR, value: '+' },
      null, null,
      { type: types.NUMBER, value: 1 },
      { type: types.PARENTHESIS, value: '(' },
      null, null, null, null, null, null,
      { type: types.NOOP },
      { type: types.OPERATOR, value: '+' },
      null, null, null, null, null, null, null, null, null, null, null, null, null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ]);

    expect(infixToTree([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 1 },
      { type: types.PARENTHESIS, value: ')' },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 2 },
      { type: types.PARENTHESIS, value: ')' },
    ])).toEqual([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 2 },
      { type: types.NOOP },
      { type: types.NUMBER, value: 1 },
      null, null,
    ]);
  });

  test('converts with exponents', () => {
    expect(infixToTree([
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 2 },
    ])).toEqual([
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 1 },
      { type: types.NUMBER, value: 2 },
    ]);

    expect(infixToTree([
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 3 },
    ])).toEqual([
      { type: types.OPERATOR, value: '*' },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 3 },
      { type: types.NUMBER, value: 1 },
      { type: types.NUMBER, value: 2 },
      null, null,
    ]);

    expect(infixToTree([
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 3 },
    ])).toEqual([
      { type: types.OPERATOR, value: '^' },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 3 },
      { type: types.NUMBER, value: 1 },
      { type: types.NUMBER, value: 2 },
      null, null,
    ]);

    expect(infixToTree([
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '^' },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 3 },
      { type: types.PARENTHESIS, value: ')' },
    ])).toEqual([
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 1 },
      { type: types.PARENTHESIS, value: '(' },
      null, null,
      { type: types.NOOP },
      { type: types.OPERATOR, value: '+' },
      null, null, null, null, null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ]);

    expect(infixToTree([
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 3 },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 4 },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 2 },
      { type: types.PARENTHESIS, value: ')' },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 0.5 },
    ])).toEqual([
      { type: types.OPERATOR, value: '^' },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 0.5 },
      { type: types.NOOP },
      { type: types.OPERATOR, value: '+' },
      null, null, null, null,
      { type: types.OPERATOR, value: '^' },
      { type: types.OPERATOR, value: '^' },
      null, null, null, null, null, null, null, null,
      { type: types.NUMBER, value: 3 },
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 4 },
      { type: types.NUMBER, value: 2 },
      null, null, null, null, null, null, null, null,
    ]);
  });

  test('converts edge cases', () => {
    expect(infixToTree([
      { type: types.OPERATOR, value: '-' },
      { type: types.IDENTIFIER, value: 'b' },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 2 },
    ])).toEqual([
      { type: types.OPERATOR, value: '+' },
      { type: types.OPERATOR, value: '-' },
      { type: types.NUMBER, value: 2 },
      { type: types.NOOP },
      { type: types.IDENTIFIER, value: 'b' },
      null, null,
    ]);
  });

  test('converts operator weirdness', () => {
    expect(infixToTree([
      { type: types.OPERATOR, value: '*' },
      { type: types.OPERATOR, value: '/' },
      { type: types.OPERATOR, value: '+' },
      { type: types.OPERATOR, value: '-' },
    ])).toEqual([
      { type: types.OPERATOR, value: '-' },
      { type: types.OPERATOR, value: '+' },
      null,
      { type: types.OPERATOR, value: '/' },
      null, null, null,
      { type: types.OPERATOR, value: '*' },
      null, null, null, null, null, null, null,
      { type: types.NOOP },
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
    ]);
  });
});

describe('evaluate', () => {
  test('computes single number', () => {
    const tree = [
      { type: types.NUMBER, value: 5 },
    ];
    expect(evaluate(tree, {})).toBe(5);
  });

  test('computes single identifier', () => {
    const tree = [
      { type: types.IDENTIFIER, value: 'b' },
    ];
    expect(evaluate(tree, { b: 2 })).toBe(2);
  });

  test('computes 1+2', () => {
    const tree = [
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 1 },
      { type: types.NUMBER, value: 2 },
    ];
    expect(evaluate(tree, {})).toBe(3);
  });

  test('computes negative', () => {
    const tree = [
      { type: types.OPERATOR, value: '-' },
      null,
      { type: types.NUMBER, value: 1 },
    ];
    expect(evaluate(tree, {})).toBe(-1);
  });

  test('computes 2+3-4', () => {
    const tree = [
      { type: types.OPERATOR, value: '-' },
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 4 },
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ];
    expect(evaluate(tree, {})).toBe(1);
  });

  test('computes 2*3/4', () => {
    const tree = [
      { type: types.OPERATOR, value: '/' },
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 4 },
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ];
    expect(evaluate(tree, {})).toBe(1.5);
  });

  test('computes 2+3*4', () => {
    const tree = [
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '*' },
      null, null,
      { type: types.NUMBER, value: 3 },
      { type: types.NUMBER, value: 4 },
    ];
    expect(evaluate(tree, {})).toBe(14);
  });

  test('computes 1+2*3/4+5*6', () => {
    const tree = [
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 1 },
      { type: types.OPERATOR, value: '+' },
      null, null,
      { type: types.OPERATOR, value: '/' },
      { type: types.OPERATOR, value: '*' },
      null, null, null, null,
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 4 },
      { type: types.NUMBER, value: 5 },
      { type: types.NUMBER, value: 6 },
      null, null, null, null, null, null, null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ];
    expect(evaluate(tree, {})).toBe(32.5);
  });

  test('computes 5*(2+3)', () => {
    const tree = [
      { type: types.OPERATOR, value: '*' },
      { type: types.NUMBER, value: 5 },
      { type: types.PARENTHESIS, value: '(' },
      null, null, null,
      { type: types.OPERATOR, value: '+' },
      null, null, null, null, null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ];
    expect(evaluate(tree, {})).toBe(25);
  });

  test('computes (1+2)', () => {
    const tree = [
      { type: types.PARENTHESIS, value: '(' },
      null,
      { type: types.OPERATOR, value: '+' },
      null, null,
      { type: types.NUMBER, value: 1 },
      { type: types.NUMBER, value: 2 },
    ];
    expect(evaluate(tree, {})).toBe(3);
  });

  test('computes 5(2+3)', () => {
    const tree = [
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 5 },
      { type: types.OPERATOR, value: '+' },
      null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ];
    expect(evaluate(tree, {})).toBe(25);
  });

  test('computes 1+2(3+4)', () => {
    const tree = [
      { type: types.OPERATOR, value: '+' },
      { type: types.NUMBER, value: 1 },
      { type: types.PARENTHESIS, value: '(' },
      null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.OPERATOR, value: '+' },
      null, null, null, null, null, null,
      { type: types.NUMBER, value: 3 },
      { type: types.NUMBER, value: 4 },
    ];
    expect(evaluate(tree, {})).toBe(15);
  });

  test('computes (3)(2)', () => {
    const tree = [
      { type: types.PARENTHESIS, value: '(' },
      { type: types.PARENTHESIS, value: '(' },
      { type: types.NUMBER, value: 2 },
      null,
      { type: types.NUMBER, value: 3 },
    ];
    expect(evaluate(tree, {})).toBe(6);
  });

  test('computes 5^2*3', () => {
    const tree = [
      { type: types.OPERATOR, value: '*' },
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 3 },
      { type: types.NUMBER, value: 5 },
      { type: types.NUMBER, value: 2 },
    ];
    expect(evaluate(tree, {})).toBe(75);
  });

  test('computes 5^(2+3)', () => {
    const tree = [
      { type: types.OPERATOR, value: '^' },
      { type: types.NUMBER, value: 5 },
      { type: types.PARENTHESIS, value: '(' },
      null, null, null,
      { type: types.OPERATOR, value: '+' },
      null, null, null, null, null, null,
      { type: types.NUMBER, value: 2 },
      { type: types.NUMBER, value: 3 },
    ];
    expect(evaluate(tree, {})).toBe(3125);
  });

  test('computes -5+2', () => {
    const tree = [
      { type: types.OPERATOR, value: '+' },
      { type: types.OPERATOR, value: '-' },
      { type: types.NUMBER, value: 2 },
      null,
      { type: types.NUMBER, value: 5 },
    ];
    expect(evaluate(tree, {})).toBe(-3);
  });
});

describe('calculate', () => {
  test('calculates simple expressions', () => {
    expect(calculate('a', { a: 3 })).toBeCloseTo(3);
    expect(calculate('-a', { a: 3 })).toBeCloseTo(-3);
  });

  test('calculates tricky expressions', () => {
    expect(calculate('((((-a))))', { a: 3 })).toBeCloseTo(-3);
    expect(calculate('a(b+c)', { a: 3, b: 4, c: 5 })).toBeCloseTo(27);
    expect(calculate('(a+b)(b+c)', { a: 3, b: 4, c: 5 })).toBeCloseTo(63);
    expect(calculate('(a+b)(b+c', { a: 3, b: 4, c: 5 })).toBeCloseTo(63);
    expect(calculate('a(b(c+a', { a: 3, b: 4, c: 5 })).toBeCloseTo(96);
  });

  test('calculates pythagorean theorem', () => {
    expect(calculate('(a^2+b^2)^(1/2)', { a: 3, b: 4 })).toBeCloseTo(5);
  });

  test('calculates quadratic formula', () => {
    expect(calculate('(-b+(b^2-4*a*c)^(1/2))/(2*a)', { a: 5, b: 13, c: 7 })).toBeCloseTo(-0.76148, 4);
    expect(calculate('(-b-(b^2-4*a*c)^(1/2))/(2*a)', { a: 5, b: 13, c: 7 })).toBeCloseTo(-1.83851, 4);
  });

  test('calculates gravitational pull', () => {
    // Earth
    expect(calculate('G * m0 * m1 / (r^2)', {
      G: 6.6743E-11, m0: 5.972E24, m1: 1, r: 6.371E6,
    })).toBeCloseTo(9.81997, 4);
    // Saturn
    expect(calculate('G * m0 * m1 / (r^2)', {
      G: 6.6743E-11, m0: 5.6834E26, m1: 1, r: 5.8232E7,
    })).toBeCloseTo(11.18640, 4);
  });
});

describe('assertValidExpression', () => {
  test('throws for missing identifiers', () => {
    expect(() => assertValidExpression('a', {})).toThrowError(new ExpressionError('Unknown identifier: \'a\''));
    expect(() => assertValidExpression('a+b', { a: 10 })).toThrowError(new ExpressionError('Unknown identifier: \'b\''));
  });

  test('throws for invalid decimal points', () => {
    expect(() => assertValidExpression('1.1.', {})).toThrowError(new ExpressionError('Couldn\'t parse token: \'1.1.\' is not a number'));
    expect(() => assertValidExpression('.1.', {})).toThrowError(new ExpressionError('Couldn\'t parse token: \'.1.\' is not a number'));
    expect(() => assertValidExpression('..1', {})).toThrowError(new ExpressionError('Couldn\'t parse token: \'..1\' is not a number'));
    expect(() => assertValidExpression('..', {})).toThrowError(new ExpressionError('Couldn\'t parse token: \'..\' is not a number'));
    expect(() => assertValidExpression('.', {})).toThrowError(new ExpressionError('Couldn\'t parse token: \'.\' is not a number'));
  });

  test('throws for invalid operators', () => {
    expect(() => assertValidExpression('*', {})).toThrowError(new ExpressionError('Operator \'*\' has no left operand'));
    expect(() => assertValidExpression('**', {})).toThrowError(new ExpressionError('Operator \'*\' has no right operand'));
    expect(() => assertValidExpression('^*/+-', {})).toThrowError(new ExpressionError('Operator \'-\' has no right operand'));
    expect(() => assertValidExpression('-+/*^', {})).toThrowError(new ExpressionError('Operator \'-\' has no right operand'));
    expect(() => assertValidExpression('^*/+', {})).toThrowError(new ExpressionError('Operator \'+\' has no right operand'));
    expect(() => assertValidExpression('+/*^', {})).toThrowError(new ExpressionError('Operator \'+\' has no left operand'));
    expect(() => assertValidExpression('1*', {})).toThrowError(new ExpressionError('Operator \'*\' has no right operand'));
    expect(() => assertValidExpression('1*(^*/+-)', {})).toThrowError(new ExpressionError('Operator \'-\' has no right operand'));
    expect(() => assertValidExpression('1-', {})).toThrowError(new ExpressionError('Operator \'-\' has no right operand'));
  });

  test('doesn\'t throw when expression is valid', () => {
    expect(() => assertValidExpression('a', { a: 3 })).not.toThrowError();
    expect(() => assertValidExpression('-a', { a: 3 })).not.toThrowError();
    expect(() => assertValidExpression('((((-a))))', { a: 3 })).not.toThrowError();
    expect(() => assertValidExpression('a(b+c)', { a: 3, b: 4, c: 5 })).not.toThrowError();
    expect(() => assertValidExpression('(a+b)(b+c)', { a: 3, b: 4, c: 5 })).not.toThrowError();
    expect(() => assertValidExpression('(a+b)(b+c', { a: 3, b: 4, c: 5 })).not.toThrowError();
    expect(() => assertValidExpression('a(b(c+a', { a: 3, b: 4, c: 5 })).not.toThrowError();
    expect(() => assertValidExpression('(a^2+b^2)^(1/2)', { a: 3, b: 4 })).not.toThrowError();
    expect(() => assertValidExpression('(-b+(b^2-4*a*c)^(1/2))/(2*a)', { a: 5, b: 13, c: 7 })).not.toThrowError();
    expect(() => assertValidExpression('G * m0 * m1 / (r^2)', {
      G: 0, m0: 0, m1: 0, r: 1,
    })).not.toThrowError();
  });
});
