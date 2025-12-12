import { expect, test, describe } from 'vitest';
import { getParentIndex, getLeftChildIndex, getRightChildIndex, insertParent } from './tree';

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
  test('inserts at root node', () => {
    expect(insertParent([0], 0)).toEqual([null, 0, null]);
    expect(insertParent([0, 1], 0)).toEqual([null, 0, null, 1, null]);
    expect(insertParent([0, 1, 2], 0)).toEqual([null, 0, null, 1, 2]);
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
    expect(insertParent([0, 1, 2, 3, 4, 5, 6], 1)).toEqual([0, null, 2, 1, null, 5, 6, 3, 4]);
    expect(insertParent([0, 1, 2, 3, 4, 5, 6], 2)).toEqual([0, 1, null, 3, 4, 2, null, null, null, null, null, 5, 6]);
  });
});
