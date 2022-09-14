import { UseMutationReturn } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

const DeleteCategoryGQL = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export default DeleteCategoryGQL;

export type DeleteCategoryMutation = UseMutationReturn<
  {
    deleteCategory: {
      id: string;
    };
  },
  {
    id: string;
  }
>;
