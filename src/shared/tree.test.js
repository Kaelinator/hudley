import { expect, test, describe } from 'vitest';
import { getParentIndex, getLeftChildIndex, getRightChildIndex, insertParent, getLeftSubTree, getRightSubTree } from './tree';

describe('getParentIndex', () => {
  test('returns negative if root', () => {
    expect(getParentIndex(0)).toBeLessThan(0);
  });

  test('returns index of parent', () => {
    expect(getParentIndex(1)).toBe(0);
    expect(getParentIndex(2)).toBe(0);

    expect(getParentIndex(3)).toBe(1);
    expect(getParentIndex(4)).toBe(1);
    expect(getParentIndex(5)).toBe(2);
    expect(getParentIndex(6)).toBe(2);

    expect(getParentIndex(7)).toBe(3);
    expect(getParentIndex(8)).toBe(3);
    expect(getParentIndex(9)).toBe(4);
    expect(getParentIndex(10)).toBe(4);
    expect(getParentIndex(11)).toBe(5);
    expect(getParentIndex(12)).toBe(5);
    expect(getParentIndex(13)).toBe(6);
    expect(getParentIndex(14)).toBe(6);
  });
});

describe('getLeftChildIndex', () => {
  test('returns index of left child', () => {
    expect(getLeftChildIndex(0)).toBe(1);

    expect(getLeftChildIndex(1)).toBe(3);
    expect(getLeftChildIndex(2)).toBe(5);

    expect(getLeftChildIndex(3)).toBe(7);
    expect(getLeftChildIndex(4)).toBe(9);
    expect(getLeftChildIndex(5)).toBe(11);
    expect(getLeftChildIndex(6)).toBe(13);
  });
});

describe('getRightChildIndex', () => {
  test('returns index of right child', () => {
    expect(getRightChildIndex(0)).toBe(2);

    expect(getRightChildIndex(1)).toBe(4);
    expect(getRightChildIndex(2)).toBe(6);

    expect(getRightChildIndex(3)).toBe(8);
    expect(getRightChildIndex(4)).toBe(10);
    expect(getRightChildIndex(5)).toBe(12);
    expect(getRightChildIndex(6)).toBe(14);
  });
});

describe('insertParent', () => {
  test('inserts at empty tree', () => {
    expect(insertParent([], 0)).toEqual([null]);
  });

  test('inserts at root node', () => {
    expect(insertParent([0], 0)).toEqual([null, 0, null]);
    expect(insertParent([0, 1], 0)).toEqual([null, 0, null, 1, null, null, null]);
    expect(insertParent([0, null, 1], 0)).toEqual([null, 0, null, null, 1, null, null]);
    expect(insertParent([0, 1, 2], 0)).toEqual([null, 0, null, 1, 2, null, null]);
  });

  test('inserts at left node', () => {
    expect(insertParent([0, 1], 1)).toEqual([0, null, null, 1, null]);
    expect(insertParent([0, 1, 2, 3], 3)).toEqual([0, 1, 2, null, null, null, null, 3, null]);
  });

  test('inserts at right node', () => {
    expect(insertParent([0, 1, 2], 2)).toEqual([0, 1, null, null, null, 2, null]);
    expect(insertParent([0, 1, 2, 3, 4, 5, 6], 6)).toEqual([0, 1, 2, 3, 4, 5, null, null, null, null, null, null, null, 6, null]);
  });

  test('inserts at nested node', () => {
    expect(insertParent([0, 1, 2, 3, 4, 5, 6], 1)).toEqual([0, null, 2, 1, null, 5, 6, 3, 4, null, null]);
    expect(insertParent([0, 1, 2, 3, 4, 5, 6], 2)).toEqual([0, 1, null, 3, 4, 2, null, null, null, null, null, 5, 6, null, null]);
  });

  test('inserts and moves descendants', () => {
    expect(insertParent([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 2))
      .toEqual([0, 1, null, 3, 4, 2, null, 7, 8, 9, 10, 5, 6, null, null, null, null, null, null, null, null, null, null, 11, 12, 13, 14, null, null, null, null])
  });

  test('inserts at nonexistent node', () => {
    expect(insertParent([0, 1], 2)).toEqual([0, 1, null]);
    expect(insertParent([0, 1, null], 2)).toEqual([0, 1, null]);
  });
});

describe('getLeftSubTree', () => {
  test('works for simple tree', () => {
    expect(getLeftSubTree([])).toEqual([]);
    expect(getLeftSubTree([0])).toEqual([]);
    expect(getLeftSubTree([0, 1])).toEqual([1]);
    expect(getLeftSubTree([0, 1, 2])).toEqual([1]);
  });
  test('works for many levels', () => {
    expect(getLeftSubTree([0, 1, 2, 3, 4, 5, 6])).toEqual([1, 3, 4]);
    expect(getLeftSubTree([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).toEqual([1, 3, 4, 7, 8, 9, 10]);
    expect(getLeftSubTree([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])).toEqual([1, 3, 4, 7, 8, 9, 10]);
  });
});

describe('getRightSubTree', () => {
  test('works for simple tree', () => {
    expect(getRightSubTree([])).toEqual([]);
    expect(getRightSubTree([0])).toEqual([]);
    expect(getRightSubTree([0, 1])).toEqual([]);
    expect(getRightSubTree([0, 1, 2])).toEqual([2]);
  });
  test('works for many levels', () => {
    expect(getRightSubTree([0, 1, 2, 3, 4, 5, 6])).toEqual([2, 5, 6]);
    expect(getRightSubTree([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).toEqual([2, 5, 6, 11]);
    expect(getRightSubTree([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])).toEqual([2, 5, 6, 11, 12, 13, 14]);
  });
});
