/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-undef */
import assert from 'assert';
import fs from 'fs';
import os from 'os';
import CSV from '../../services/CSV/CSV';
import { JsonType, RowType, SitterType } from '../../types/index';

describe('CSV', () => {
  const csv = new CSV();
  const filePath = '';
  describe('getJsonData()', async () => {
    const json: JsonType = await csv.getJsonData(filePath);

    it('should return expected length of sitters', () => {
      const expected: number = 100;
      const actual: number = Object.keys(json).length;
      assert.strictEqual(actual, expected);
    });

    it('should return expected data for a single sitter', () => {
      const expected: SitterType = {
        ratings: [2, 3, 5, 5],
        email: 'user7938@verizon.net',
      };
      const actual: SitterType = json['Aksana B.'];
      assert.strictEqual(actual.ratings.length, expected.ratings.length);
      assert.strictEqual(actual.email, expected.email);
      assert.strictEqual(JSON.stringify(actual.ratings.sort()), JSON.stringify(expected.ratings));
    });
  });

  describe('createRows()', async () => {
    const json: JsonType = await csv.getJsonData(filePath);
    const rows: RowType[] = csv.createRows(json);

    it('should return expected data for a singular row', () => {
      const rowKeys = ['email', 'name', 'profile_score', 'ratings_score', 'search_score'];
      const actual = rowKeys.every((key) => Object.hasOwnProperty.call(rows[0], key))
      && rowKeys.length === Object.keys(rows[0]).length;
      const expected = true;
      assert.strictEqual(actual, expected);
    });
  });

  describe('sortRows()', async () => {
    const json: JsonType = await csv.getJsonData(filePath);
    const rows: RowType[] = csv.sortRows(csv.createRows(json));

    it('should return rows in sorted descending order (by Search score)', () => {
      const expected: number[] = [
        9, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3.5, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 3, 3, 3, 3, 3, 2.8, 2.67, 2.55, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1];
      const actual: number[] = rows.map(({ search_score: score }) => score);

      assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
    });

    it('should return rows in sorted abc order when there\'s a Search score tie', () => {
      const tiedRows: RowType[] = rows.slice(1, 4);
      const expectedNames: string[] = ['Julie W.', 'Nakisa S.', 'Pam L.'];
      const actualNames: string[] = tiedRows.map(({ name }) => name);

      const expectedScores: number[] = [8, 8, 8];
      const actualScores: number[] = tiedRows.map(({ search_score: score }) => score);

      assert.strictEqual(JSON.stringify(actualNames), JSON.stringify(expectedNames));
      assert.strictEqual(JSON.stringify(actualScores), JSON.stringify(expectedScores));
    });
  });

  describe('writeCSV()', () => {
    it('should write the final CSV to the /Downloads/rover-challenge-sitters.csv path', async () => {
      await csv.writeCSV(filePath, true);
      const downloadPath: string = `${os.homedir()}/Downloads/rover-challenge-sitters.csv`;
      const expected: boolean = true;
      const actual: boolean = fs.existsSync(downloadPath);

      assert.strictEqual(actual, expected);
    });
  });
});
