/* eslint-disable import/named */
import { Category } from "@prisma/client";
import { UseMutationReturn } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

const UpsertCategoryGQL = gql`
  mutation UpsertCategory($id: String, $name: String!, $color: String!) {
    upsertCategory(id: $id, name: $name, color: $color) {
      id
      color
      name
    }
  }
`;

export default UpsertCategoryGQL;

export type UpsertCategoryMutation = UseMutationReturn<
  { upsertCategory: Category },
  Omit<Category, "id"> & { id?: string }
>;
