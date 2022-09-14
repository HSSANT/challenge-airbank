/* eslint-disable import/named */
import { Prisma, Transaction } from "@prisma/client";
import dayjs from "dayjs";
import { GraphQLScalarType, Kind } from "graphql";
import { GqlContext } from "./context";

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),

  Query: {
    accounts: async (_parent: any, _args: any, ctx: GqlContext) => {
      const { prisma } = ctx;
      return await prisma.account.findMany();
    },

    categories: async (_parent: any, _args: any, ctx: GqlContext) => {
      const { prisma } = ctx;
      return await prisma.category.findMany();
    },

    transactions: async (
      _parent: any,
      args: { id: string },
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      const { ...whereArguments } = args;

      const filteredWhere = (
        Object.keys(whereArguments) as (keyof typeof whereArguments)[]
      ).reduce((acc, key) => {
        if (whereArguments[key]) acc[key] = whereArguments[key];
        return acc;
      }, {} as Partial<typeof whereArguments>);

      return await prisma.transaction.findMany({
        include: { account: true, category: true },
        take: 20,
        orderBy: { date: "desc" },
        where: {
          ...filteredWhere,
        },
      });
    },

    paginatedTransactions: async (
      _parent: any,
      args: {
        page?: number;
        perPage?: number;
        query?: string;
        accountName?: string;
        bankName?: string;
        since?: string;
        until?: string;
        sortBy?: {
          key:
            | "account"
            | "bank"
            | "reference"
            | "category"
            | "date"
            | "amount";
          order: "asc" | "desc";
        };
      },
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      const page = Math.max(1, args.page || 1);
      const perPage = Math.max(1, args.perPage || 20);
      const { query, accountName, bankName, since, until } = args;
      const sortBy = args.sortBy || { key: "Date", order: "desc" };
      sortBy.key = sortBy.key || "date";
      sortBy.order = sortBy.order || "desc";

      const orderBy: Prisma.TransactionOrderByWithRelationInput =
        sortBy.key === "account"
          ? { account: { name: sortBy.order } }
          : sortBy.key === "bank"
          ? { account: { bank: sortBy.order } }
          : sortBy.key === "category"
          ? { category: { name: sortBy.order } }
          : { [sortBy.key]: sortBy.order };

      const queryWhere: Prisma.TransactionWhereInput = query
        ? {
            OR: [
              {
                account: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
              {
                account: {
                  bank: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
              {
                reference: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                currency: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {};
      const accountWhere: Prisma.TransactionWhereInput =
        bankName || accountName
          ? {
              account: {
                bank: bankName ? { equals: bankName } : undefined,
                name: accountName ? { equals: accountName } : undefined,
              },
            }
          : {};

      const dateWhere: Prisma.TransactionWhereInput =
        since || until
          ? {
              date: {
                gte: since ? dayjs(since).startOf("month").toDate() : undefined,
                lte: until ? dayjs(until).endOf("month").toDate() : undefined,
              },
            }
          : {};

      const where = { ...queryWhere, ...accountWhere, ...dateWhere };
      const transactions = await prisma.transaction.findMany({
        include: { account: true, category: true },
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: [
          orderBy,
          {
            date: "desc",
          },
        ],
        where,
      });

      const total = await prisma.transaction.count({ where });
      const totalPages = Math.ceil(total / perPage);

      return {
        transactions,
        perPage,
        total,
        totalPages,
        page,
      };
    },
  },

  Mutation: {
    upsertCategory: async (
      _parent: any,
      args: { id?: string; name: string; color: string },
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      const { name, color, id } = args;
      const category = await prisma.category.upsert({
        where: { id: id || "1234" },
        update: { name, color: color.replace("#", "") },
        create: { name, color: color.replace("#", "") },
      });
      return category;
    },

    deleteCategory: async (
      _parent: any,
      args: { id: string },
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      const { id } = args;
      const category = await prisma.category.delete({ where: { id } });
      return category;
    },

    updateTransaction: async (
      _parent: any,
      args: { transaction: Partial<Transaction> & { id: string } },
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      const { id, ...rest } = args.transaction;
      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          ...rest,
        },
        include: { account: !!rest.accountId, category: !!rest.categoryId },
      });
      return transaction;
    },
  },

  Account: {
    transactions: async (
      parent: { id: string },
      _args: any,
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      return await prisma.transaction.findMany({
        where: {
          accountId: parent.id,
        },
      });
    },
  },

  Category: {
    transactions: async (
      parent: { id: string },
      _args: any,
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      return await prisma.transaction.findMany({
        where: {
          accountId: parent.id,
        },
      });
    },
  },

  Transaction: {
    account: async (
      parent: { accountId: string },
      _args: any,
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      return await prisma.account.findUnique({
        where: {
          id: parent.accountId,
        },
      });
    },
    category: async (
      parent: { categoryId: string },
      _args: any,
      ctx: GqlContext,
    ) => {
      const { prisma } = ctx;
      if (!parent.categoryId) return null;
      return await prisma.category.findUnique({
        where: {
          id: parent.categoryId,
        },
      });
    },
  },
};
