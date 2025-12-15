import {
  getParent, getParentIndex, insertParent, getRightChildIndex, getLeftSubTree, getRightSubTree,
} from './tree';

/*
 *  Allowed characters: a-z, A-Z, 0-9, +, -, /, *, ^, (, )
 */
export const types = {
  IDENTIFIER: Symbol.for('identifier'),
  NUMBER: Symbol.for('number'),
  OPERATOR: Symbol.for('operator'),
  PARENTHESIS: Symbol.for('parenthesis'),
  NOOP: Symbol.for('noop'),
};

const {
  IDENTIFIER, NUMBER, OPERATOR, PARENTHESIS, NOOP,
} = types;

const isAlpha = (charCode) => (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
const isDigit = (charCode) => charCode >= 48 && charCode <= 57;
const isDecimal = (charCode) => charCode === 46;
const isWhitespace = (charCode) => charCode === 9 || charCode === 32;
const isOperator = (charCode) => charCode === 42 || charCode === 43 || charCode === 45 || charCode === 47 || charCode === 94;
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
  '^': 1,
  '*': 2,
  '/': 2,
  '+': 3,
  '-': 3,
};

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
    return infixToTree(tokens.slice(1), tree, getParentIndex(index));
  }

  if (parent && PRIORITY[token.value] >= PRIORITY[parent.value] && parent.type !== PARENTHESIS) {
    index = getParentIndex(index);
  }

  // edge case for open parenthesis
  if (tree[index] === null || index >= tree.length) {
    tree[index] = { type: NOOP };
  }

  const newTree = insertParent(tree, index);
  newTree[index] = token;

  return infixToTree(tokens.slice(1), newTree, getRightChildIndex(index));
};

export const evaluate = (tree, values) => {
  if (tree.length <= 0) return 0; // not an exit condition

  const node = tree[0];
  if (node === null) {
    return null;
  }

  if (node.type === NUMBER) {
    return node.value;
  }

  if (node.type === IDENTIFIER) {
    return values[node.value];
  }

  if (node.type === OPERATOR) {
    const left = evaluate(getLeftSubTree(tree), values);
    const right = evaluate(getRightSubTree(tree), values);
    switch (node.value) {
      case '+':
        return left + right;

      case '-':
        if (right === null) return -left;
        return left - right;

      case '*':
        return left * right;

      case '/':
        return left / right;

      case '^':
        return left ** right;

      default: throw new Error(`Invalid operator: ${node.value}`);
    }
  }

  if (node.type === PARENTHESIS) {
    const left = evaluate(getLeftSubTree(tree), values);
    const right = evaluate(getRightSubTree(tree), values);
    if (left === null) return right;
    return left * right;
  }

  if (node.type === NOOP) {
    return null;
  }

  throw new Error(`Invalid node type: ${node.type}`);
};

export const calculate = (expression, values) => evaluate(infixToTree(parse(expression)), values);
