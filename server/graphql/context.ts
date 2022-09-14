import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "../prisma";

export type GqlContext = {
  prisma: PrismaClient;
};

export const createGqlContext = (_req: Request, _res: Response) => {
  return {
    prisma: getPrismaClient(),
  };
};
