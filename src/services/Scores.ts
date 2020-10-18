/* eslint-disable no-plusplus */

export default class Scores {
  calculateProfileScore = (sitterName: string): number => {
    let englishChars: string = '';
    for (let i = 0; i < sitterName.length; i++) {
      const char: string = sitterName[i].toLowerCase();
      const ascii: number = char.charCodeAt(i);
      if (ascii >= 97 && ascii <= 122) englishChars += char;
    }
    const uniqueEnglishChars: number = (new Set(englishChars).size) / 26;
    const profileScore: number = Number((5 * uniqueEnglishChars).toFixed(2));
    return profileScore;
  };

  calculateRatingsScore = (ratings: number[]): number => {
    const average: number = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return Number(average.toFixed(2));
  };

  calculateSearchScore = (profileScore: number, ratingsScore: number, stays: number) => {
    let searchScore: number;
    if (stays === 0) {
      searchScore = profileScore;
    } else if (stays >= 10) {
      searchScore = ratingsScore;
    } else {
      const weightedProfileAndRatings = (stays * profileScore) + (stays * ratingsScore);
      const weightedScore = weightedProfileAndRatings / (profileScore + ratingsScore);
      searchScore = Number(weightedScore.toFixed(2));
    }

    return searchScore;
  };
}
