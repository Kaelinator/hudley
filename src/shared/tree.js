export const getParentIndex = (index) =>  Math.ceil(index / 2) - 1;

/*
 * Returns the parent of the node at index or null if this is root
 * Assumes binary tree structured in level order
 */
export const getParent = (tree, index) => {
  if (index === 0)
    return null;

  return tree[getParentIndex(index)];
};

export const getLeftChildIndex = (index) => index * 2 + 1;

export const getLeftChild = (tree, index) => {
  const leftChildIndex = getLeftChildIndex(index);

  if (leftChildIndex >= tree.length) {
    return null;
  }

  return tree[leftChildIndex];
}

export const getRightChildIndex = (index) => index * 2 + 2;

export const getRightChild = (tree, index) => {
  const rightChildIndex = getRightChildIndex(index);

  if (rightChildIndex >= tree.length) {
    return null;
  }

  return tree[rightChildIndex];
}

export const isLeftChild = (index) => index % 2 === 1;
export const isRightChild = (index) => index !== 0 && index % 2 === 0;

/**
 * returns modified tree such that a parent is inserted at index
 * and node at index becomes the new node's left child and all
 * descendants are updated accordingly
 */
export const insertParent = (tree, index) => {
  const leftChild = getLeftChild(tree, index);
  if (leftChild !== null) {
    const leftChildIndex = getLeftChildIndex(index);
    const newTree = insertParent(tree, leftChildIndex);

    newTree[leftChildIndex] = tree[index];
    newTree[getLeftChildIndex(leftChildIndex)] = leftChild;

    const rightChild = getRightChild(tree, index);
    newTree[getRightChildIndex(index)] = null;
    newTree[getRightChildIndex(leftChildIndex)] = rightChild;

    newTree[index] = null;
    return newTree;
  }

  const rightChildIndex = getRightChildIndex(index);
  const newTree = [
    ...tree,
    ...((rightChildIndex >= tree.length) ? Array(rightChildIndex - tree.length + 1).fill(null) : [])
  ];

  newTree[getLeftChildIndex(index)] = tree[index] === undefined ? null : tree[index];
  newTree[index] = null;

  return newTree;
};
