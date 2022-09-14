/* eslint-disable import/named */
import { Category } from "@prisma/client";
import { gql } from "graphql-tag";

const CategoriesQueryGQL = gql`
  query CategoriesQuery {
    categories {
      id
      name
      color
    }
  }
`;

export default CategoriesQueryGQL;

export type CategoriesQuery = {
  categories: Category[];
};
