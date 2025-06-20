/*
 *  Allowed characters: a-z, A-Z, 0-9, +, -, /, *, (, )
 */
export const types = {
  IDENTIFIER: Symbol.for('identifier'),
  NUMBER: Symbol.for('number'),
  OPERATOR: Symbol.for('operator'),
  PARENTHESIS: Symbol.for('parenthesis'),
};

export const calculateValue = (point, index, formula) => 10 + index;

const isAlpha = (charCode) => (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
const isDigit = (charCode) => charCode >= 48 && charCode <= 57;
const isDecimal = (charCode) => charCode === 46;
const isWhitespace = (charCode) => charCode === 9 || charCode === 32;
const isOperator = (charCode) => charCode === 42 || charCode === 43 || charCode === 45 || charCode == 47;
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
      type = types.NUMBER;
      token += char;
      continue;
    }

    if (isDigit(charCode) || isDecimal(charCode)) {
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

  const value = type === types.NUMBER
    ? +token
    : token;

  if (type === types.NUMBER && isNaN(value)) {
    throw Error(`Error parsing token: '${token}' is not a number`);
  }

  return [
    { type, value },
    ...parse(formula.slice(i)),
  ];
};

// export const evaluate = (expression) => typeof expression[0]
