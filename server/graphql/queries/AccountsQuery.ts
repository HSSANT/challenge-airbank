/* eslint-disable import/named */
import { Account } from "@prisma/client";
import { gql } from "graphql-tag";

const AccountsQueryGQL = gql`
  query AccountsQuery {
    accounts {
      id
      name
      bank
    }
  }
`;

export default AccountsQueryGQL;

export type AccountsQuery = {
  accounts: Account[];
};
