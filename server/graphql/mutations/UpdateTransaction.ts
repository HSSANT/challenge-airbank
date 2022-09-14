/* eslint-disable import/named */
import { Transaction } from "@prisma/client";
import { UseMutationReturn } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

const UpdateTransactionGQL = gql`
  mutation UpdateTransaction($transaction: TransactionInput) {
    updateTransaction(transaction: $transaction) {
      id
      accountId
      categoryId
      reference
      amount
      currency
      date
    }
  }
`;

export default UpdateTransactionGQL;

export type UpdateTransactionMutation = UseMutationReturn<
  {
    updateTransaction: Transaction;
  },
  {
    transaction: {
      id: string;
      accountId?: string;
      categoryId?: string | null;
      reference?: string | null;
      amount?: number;
      currency?: string;
      date?: Date;
    };
  }
>;
