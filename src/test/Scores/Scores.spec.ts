/* eslint-disable no-undef */
import assert from 'assert';
import Scores from '../../services/Scores/Scores.ts';

describe('CSV', () => {
  const scores = new Scores();

  describe('calculateProfileScore()', () => {
    it('should return expected Profile score', () => {
      const test: string = 'Zackary Carlson';
      const expected: number = 1.92;
      const actual: number = scores.calculateProfileScore(test);
      assert.strictEqual(actual, expected);
    });
  });

  describe('calculateRatingsScore()', () => {
    it('should return expected Ratings score', () => {
      const test: number[] = [5, 4, 3, 5, 2];
      const expected: number = 3.8;
      const actual: number = scores.calculateRatingsScore(test);
      assert.strictEqual(actual, expected);
    });
  });

  describe('calculateSearchScore()', () => {
    it('should return expected Search score', () => {
      const stays: number = 5;
      const profileScore: number = 1.92;
      const ratingScore: number = 3.8;
      const expected: number = 5;
      const actual: number = scores.calculateSearchScore(profileScore, ratingScore, stays);
      assert.strictEqual(actual, expected);
    });
  });
});
