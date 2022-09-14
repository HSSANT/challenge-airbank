/* eslint-disable import/named */
import { Account, Category, Transaction } from "@prisma/client";
import { gql } from "graphql-tag";
import { Ref } from "@nuxtjs/composition-api";

const PaginatedTransactionsQueryGQL = gql`
  query PaginatedTransactions(
    $perPage: Int
    $page: Int
    $query: String
    $accountName: String
    $bankName: String
    $since: String
    $until: String
    $sortBy: Sortby
  ) {
    paginatedTransactions(
      perPage: $perPage
      page: $page
      query: $query
      accountName: $accountName
      bankName: $bankName
      since: $since
      until: $until
      sortBy: $sortBy
    ) {
      transactions {
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
          name
          bank
          id
        }
      }
      total
      totalPages
      page
      perPage
    }
  }
`;

export default PaginatedTransactionsQueryGQL;

export type PaginatedTransactionsQuery = {
  paginatedTransactions: {
    transactions: (Transaction & {
      category?: Category;
      account: Account;
    })[];
    total: number;
    totalPages: number;
    page: number;
    perPage: number;
  };
};

export type PaginatedTransactionsQueryVariables = {
  perPage: Ref<number>;
  page: Ref<number>;
  query: Ref<string>;
  accountName: Ref<string>;
  bankName: Ref<string>;
  since: Ref<string>;
  until: Ref<string>;
  sortBy: {
    key: string;
    order: "asc" | "desc" | "";
  };
};
