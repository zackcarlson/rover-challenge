/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { createObjectCsvWriter } from 'csv-writer';
import os from 'os';
import fs from 'fs';
import csvtojson from 'csvtojson';
import Scores from '../Scores/Scores';
import {
  StayType, JsonType, RowType, SitterType,
} from '../../types/index';
import defaultCsv from '../../models/reviews';

export default class CSV {
  getJsonData = async (csvFilePath: string): Promise<JsonType> => {
    const reviews = csvFilePath.length > 0 ? await csvtojson().fromFile(csvFilePath) : defaultCsv;
    const json = reviews.reduce((res: JsonType, currStayInfo: StayType) => {
      const { rating, sitter, sitter_email: email } = currStayInfo;
      if (Object.prototype.hasOwnProperty.call(res, sitter)) {
        res[sitter].ratings.push(Number(rating));
      } else {
        res[sitter] = { email, ratings: [Number(rating)] };
      }
      return res;
    }, {});
    return json;
  };

  createRows = (sitters: JsonType): RowType[] => {
    const rows: RowType[] = [];
    const Score = new Scores();
    Object.entries(sitters).forEach((entry) => {
      const sitter: string = entry[0];
      const { ratings, email }: SitterType = entry[1];
      const profileScore: number = Score.calculateProfileScore(sitter);
      const ratingsScore: number = Score.calculateRatingsScore(ratings);
      const searchScore: number = Score.calculateSearchScore(
        profileScore, ratingsScore, ratings.length,
      );
      const rowData: RowType = {
        email,
        name: sitter,
        profile_score: profileScore,
        ratings_score: ratingsScore,
        search_score: searchScore,
      };
      rows.push(rowData);
    });
    return rows;
  };

  sortRows = (rows: RowType[]) => {
    const sorted: RowType[] = rows.sort((a, b) => {
      if (b.search_score === a.search_score) {
        const x: string = a.name.toLowerCase();
        const y: string = b.name.toLowerCase();
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
      }
      return b.search_score - a.search_score;
    });
    return sorted;
  };

  writeCSV = async (csvFilePath: string, hasWritePermission: boolean): Promise<any> => {
    try {
      const jsonData: JsonType = await this.getJsonData(csvFilePath);
      const rows: RowType[] = this.sortRows(this.createRows(jsonData));
      const downloadPath: string = `${os.homedir()}/Downloads/rover-challenge-sitters.csv`;
      const header = [
        { id: 'name', title: 'Sitter name' },
        { id: 'email', title: 'Sitter email' },
        { id: 'profile_score', title: 'Profile score' },
        { id: 'ratings_score', title: 'Ratings score' },
        { id: 'search_score', title: 'Search Score' },
      ];

      if (hasWritePermission) {
        const csvWriter = createObjectCsvWriter({
          path: downloadPath,
          header,
        });
        if (fs.existsSync(downloadPath)) {
          fs.unlinkSync(downloadPath);
        }
        await csvWriter.writeRecords(rows);
        return `Successfully calculated and exported Rover sitter search rankings to your ${downloadPath}!`;
      }

      return rows;
    } catch (err) {
      return 'Error calculating and exporting Rover sitter search rankings.';
    }
  };
}
