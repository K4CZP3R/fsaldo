// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApiResponse } from "@/models/api-response.interface";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSessionAndUser } from "@/helpers/server-side.helper";
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  try {
    const { user } = await getSessionAndUser(req, res);

    switch (req.method) {
      case "GET":
        res.status(200).json({
          data: await prisma.saldo.findMany({
            where: {
              userId: user.id,
            },
            include: {
              saldoEntry: true,
            },
          }),
        });
        break;
      case "POST":
        res.status(200).json({
          data: await prisma.saldo.create({
            data: {
              userId: user.id,
              name: req.body.name,
              debitLimit: req.body.debitLimit,
            },
          }),
        });
        break;
      default:
        res.status(405).json({
          message: "Method not allowed",
        });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message,
    });
  }
}
