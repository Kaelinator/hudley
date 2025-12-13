
import { getParent, getParentIndex, insertParent, getRightChildIndex } from './tree';

/*
 *  Allowed characters: a-z, A-Z, 0-9, +, -, /, *, (, )
 */
export const types = {
  IDENTIFIER: Symbol.for('identifier'),
  NUMBER: Symbol.for('number'),
  OPERATOR: Symbol.for('operator'),
  PARENTHESIS: Symbol.for('parenthesis'),
};

const { IDENTIFIER, NUMBER, OPERATOR, PARENTHESIS } = types;

export const calculateValue = (point, index, formula) => 10 + index;

const isAlpha = (charCode) => (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
const isDigit = (charCode) => charCode >= 48 && charCode <= 57;
const isDecimal = (charCode) => charCode === 46;
const isWhitespace = (charCode) => charCode === 9 || charCode === 32;
const isOperator = (charCode) => charCode === 42 || charCode === 43 || charCode === 45 || charCode == 47;
const isParenthesis = (charCode) => charCode === 40 || charCode === 41;
export const parse = (formula) => {
  if (formula.length === 0) {
    return [];
  }

  let i = 0;
  let token = '';
  let type;
  for (i; i < formula.length; i += 1) {
    const char = formula[i];
    const charCode = formula.charCodeAt(i);
    if (!type && (isDigit(charCode) || isDecimal(charCode))) {
      type = NUMBER;
      token += char;
      continue;
    }

    if (type === NUMBER && (isDigit(charCode) || isDecimal(charCode))) {
      token += char;
      continue;
    }

    if (!type && isAlpha(charCode)) {
      type = IDENTIFIER;
      token += char;
      continue;
    }

    if (type === IDENTIFIER && (isAlpha(charCode) || isDigit(charCode))) {
      token += char;
      continue;
    }

    if (!type && isOperator(charCode)) {
      type = OPERATOR;
      token += char;
      continue;
    }

    if (!type && isParenthesis(charCode)) {
      type = PARENTHESIS;
      token += char;
      continue;
    }

    if (isWhitespace(charCode) && type) {
      break;
    }

    if (isWhitespace(charCode)) {
      continue;
    }

    break;
  }

  if (!token.length) {
    return [];
  }

  const value = type === NUMBER
    ? +token
    : token;

  if (type === NUMBER && Number.isNaN(value)) {
    throw Error(`Error parsing token: '${token}' is not a number`);
  }

  return [
    { type, value },
    ...parse(formula.slice(i)),
  ];
};


const PRIORITY = {
  '(': 0,
  ')': 0,
  '*': 1,
  '/': 1,
  '+': 2,
  '-': 2,
}

/*
 * If number:
 * - fill current node
 * If operator:
 *  - If operator has lower priority than or equal priority to current node's parent, then move to parent
 * - make current node child of new operator parent, then move to right child
 *
 * or something like that
 *
 * Returns binary tree structured in level order
 * e.g.
 *        a
 *       / \
 *      /   \
 *     b     c
 *    /     / \
 *   d     f   g
 *  = [a, b, c, d, null, f, g]
 */
export const infixToTree = (tokens, tree = [], index = 0) => {
  if (tokens.length <= 0) {
    return tree;
  }
  const token = tokens[0];

  if (token.type === NUMBER || token.type === IDENTIFIER) {
    tree[index] = token;
    return infixToTree(tokens.slice(1), tree, index);
  }

  const parent = getParent(tree, index);

  if (token.type === PARENTHESIS && token.value === ')') {
    if (parent && parent.type !== PARENTHESIS) {
      return infixToTree(tokens, tree, getParentIndex(index));
    }
    return infixToTree(tokens.slice(1), tree, index);
  }

  if (parent && PRIORITY[token.value] >= PRIORITY[parent.value] && parent.type !== PARENTHESIS) {
    index = getParentIndex(index);
  }

  const newTree = insertParent(tree, index);
  newTree[index] = token;

  return infixToTree(tokens.slice(1), newTree, getRightChildIndex(index));
};

// export const evaluate = (expression) => typeof expression[0]
