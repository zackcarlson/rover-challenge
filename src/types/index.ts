/* eslint-disable camelcase */
type StayType = {
  rating: string
  sitter: string
  sitter_email: string
};

type SitterType = {
  ratings: number[]
  email: string
};

type JsonType = {
  [key: string]: SitterType
};

type RowType = {
  email: string
  name: string
  profile_score: number
  ratings_score: number
  search_score: number
};

export {
  StayType, JsonType, RowType, SitterType,
};
