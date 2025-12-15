export const getParentIndex = (index) => Math.ceil(index / 2) - 1;

/*
 * Returns the parent of the node at index or null if this is root
 * Assumes binary tree structured in level order
 */
export const getParent = (tree, index) => {
  if (index === 0) return null;

  return tree[getParentIndex(index)];
};

export const getLeftChildIndex = (index) => index * 2 + 1;

export const getLeftChild = (tree, index) => {
  const leftChildIndex = getLeftChildIndex(index);

  if (leftChildIndex >= tree.length) {
    return null;
  }

  return tree[leftChildIndex];
};

export const getRightChildIndex = (index) => index * 2 + 2;

export const getRightChild = (tree, index) => {
  const rightChildIndex = getRightChildIndex(index);

  if (rightChildIndex >= tree.length) {
    return null;
  }

  return tree[rightChildIndex];
};

export const isLeftChild = (index) => index % 2 === 1;
export const isRightChild = (index) => index !== 0 && index % 2 === 0;

/**
 * Creates array from a to b, inclusive
 */
const range = (a, b) => Array(b - a + 1).fill().map((_, i) => a + i);

const copyDown = (tree, left, right) => {
  const areAllNull = range(left, right)
    .every((i) => tree[i] === null || i >= tree.length);

  let newTree = tree.concat(); // make copy
  if (!areAllNull) {
    newTree = copyDown(tree, getLeftChildIndex(left), getRightChildIndex(right));
  }

  if (right >= newTree.length) {
    // resize
    newTree = newTree.concat(range(newTree.length, right).fill(null));
  }

  if (left === right) {
    newTree[left] = null;
    return newTree;
  }

  const startParent = getParentIndex(left);
  range(0, Math.floor((right - left) / 2))
    .forEach((i) => {
      newTree[left + i] = newTree[startParent + i] !== undefined ? newTree[startParent + i] : null;
      newTree[startParent + i] = null;
    });

  return newTree;
};

/**
 * returns modified tree such that a parent is inserted at index
 * and node at index becomes the new node's left child and all
 * descendants are updated accordingly
 */
export const insertParent = (tree, index) => copyDown(tree, index, index);

const getLeftSubTreeLength = (length) => {
  if (length === 0) return 0;

  const completeLevels = Math.floor(Math.log2(length + 1));
  const rightTreeLength = 2 ** (completeLevels - 1) - 1;
  const nodesInLastLevel = length - (2 ** completeLevels - 1);

  return length - rightTreeLength - Math.max(0, nodesInLastLevel - 2 ** (completeLevels - 1)) - 1;
};

export const getLeftSubTree = (tree) => new Array(getLeftSubTreeLength(tree.length))
  .fill()
  .map((_, i) => (i === 0
    ? tree[1]
    : tree[i + (1 << Math.floor(Math.log2(i + 1)))]));

const getRightSubTreeLength = (length) => {
  if (length === 0) return 0;
  return length - getLeftSubTreeLength(length) - 1;
};

export const getRightSubTree = (tree) => new Array(getRightSubTreeLength(tree.length))
  .fill()
  .map((_, i) => (i === 0
    ? tree[2]
    : tree[i + (1 << (Math.floor(Math.log2(i + 1)) + 1))]));
