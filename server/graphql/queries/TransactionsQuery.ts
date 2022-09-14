/* eslint-disable import/named */
import { Account, Category, Transaction } from "@prisma/client";
import { gql } from "graphql-tag";
import { Ref } from "@nuxtjs/composition-api";

const TransactionsQueryGQL = gql`
  query TransactionsQuery($transactionsId: String) {
    transactions(id: $transactionsId) {
      id
      reference
      amount
      currency
      date
      category {
        id
        name
        color
      }
      account {
        id
        name
        bank
      }
    }
  }
`;

export default TransactionsQueryGQL;

export type TransactionsQuery = {
  transactions: (Transaction & { category?: Category; account: Account })[];
};

export type TransactionsQueryVariables = {
  transactionId: Ref<string>;
};
