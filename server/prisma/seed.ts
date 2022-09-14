/* eslint-disable import/named */
/* eslint-disable no-console */
import fs from "fs";
import { parse } from "csv-parse/sync";
import { Account, Category, Transaction } from "@prisma/client";
import { getPrismaClient } from ".";
const client = getPrismaClient();

const readCsv = <T = Record<string, any>>(
  path: string,
): Record<keyof T, string>[] => {
  const data = fs.readFileSync(path, "utf8");
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
    relaxQuotes: true,
  });
  const response = records.map((r: Record<string, string>) =>
    Object.fromEntries(
      Object.entries(r).map(([key, value]) => [
        key.replace(/"/g, "").trim(),
        value || value === "0" ? value : null,
      ]),
    ),
  );
  return response;
};

(async () => {
  const accountsData = readCsv<Account>("data/accounts.csv");
  console.time("Accounts Inserted");
  await client.account.createMany({ data: accountsData, skipDuplicates: true });
  console.timeEnd("Accounts Inserted");
  console.time("Categories Inserted");
  const categoriesData = readCsv<Category>("data/categories.csv");
  await Promise.all(
    categoriesData.map(async cat => {
      await client.category.upsert({
        where: { id: cat.id },
        create: cat,
        update: {},
      });
    }),
  );
  console.timeEnd("Categories Inserted");
  console.time("Transactions Inserted");
  const transactionsData = readCsv<Transaction>("data/transactions.csv");
  await client.transaction.createMany({
    data: transactionsData.map(t => ({
      ...t,
      date: new Date(
        t.date
          .replace("2022-09-31", "2022-10-01")
          .replace("2022-11-31", "2022-12-01"),
      ),
      amount: parseFloat(t.amount),
    })),
    skipDuplicates: true,
  });
  console.timeEnd("Transactions Inserted");
})();
