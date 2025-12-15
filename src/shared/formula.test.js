import { expect, test, describe } from 'vitest';
import { parse, infixToTree, types, evaluate, calculate } from './formula';

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
      null, null
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
      { type: types.NUMBER, value: 1 },
      null,
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
  test('calculates pythagorean theorem', () => {
    expect(calculate('a^2+b^2', { a: 3, b: 4 })).toBe(25)
    expect(calculate('(a^2+b^2)^(1/2)', { a: 3, b: 4 })).toBe(5)
    expect(calculate('(3^2+4^2)^0.5', {})).toBe(5)
  });
});
