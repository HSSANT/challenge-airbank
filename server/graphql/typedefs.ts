/* eslint-disable import/named */
import { Account, Category, Transaction } from "@prisma/client";
import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Date

  type Account {
    id: String
    name: String
    bank: String

    transactions: [Transaction]
  }

  type Category {
    id: String
    name: String
    color: String

    transactions: [Transaction]
  }

  type Transaction {
    id: String
    accountId: String
    categoryId: String
    reference: String
    amount: Float
    currency: String
    date: Date

    account: Account
    category: Category
  }

  type PaginatedTransactions {
    transactions: [Transaction]
    perPage: Int
    total: Int
    totalPages: Int
    page: Int
  }

  input Sortby {
    key: String
    order: String
  }

  type Query {
    accounts: [Account]
    categories: [Category]
    transactions(id: String): [Transaction]
    paginatedTransactions(
      page: Int
      perPage: Int
      query: String
      accountName: String
      bankName: String
      since: String
      until: String
      sortBy: Sortby
    ): PaginatedTransactions
  }

  input TransactionInput {
    id: String!
    accountId: String
    categoryId: String
    reference: String
    amount: Float
    currency: String
    date: Date
  }

  type Mutation {
    upsertCategory(id: String, name: String!, color: String!): Category
    deleteCategory(id: String!): Category
    updateTransaction(transaction: TransactionInput): Transaction
  }
`;

export type PaginatedTransactions = {
  transactions: (Transaction & {
    category: Category;
    account: Account;
  })[];
  perPage: number;
  total: number;
  totalPages: number;
  page: number;
};
