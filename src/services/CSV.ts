import { createObjectCsvWriter } from 'csv-writer';
import os from 'os';
import Scores from './Scores';
import {
  StayType, JsonType, RowType, SitterType,
} from '../types/index';
import reviews from '../models/reviews.js';

export default class CSV {
  getJsonData = (): JsonType => {
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

  writeCSV = async () => {
    try {
      const jsonData: JsonType = this.getJsonData();
      const rows: RowType[] = this.sortRows(this.createRows(jsonData));
      const downloadPath: string = `${os.homedir()}/Downloads/sitters.csv`;
      const csvWriter = createObjectCsvWriter({
        path: downloadPath,
        header: [
          { id: 'name', title: 'Sitter name' },
          { id: 'email', title: 'Sitter email' },
          { id: 'profile_score', title: 'Profile score' },
          { id: 'ratings_score', title: 'Ratings score' },
          { id: 'search_score', title: 'Search Score' },
        ],
      });

      await csvWriter.writeRecords(rows);
      console.log(`Successfully exported file to your ${downloadPath}`);
      return;
    } catch (err) {
      console.log('Error generating output CSV', err);
    }
  };
}
