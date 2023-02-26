import { getSessionAndUser } from "@/helpers/server-side.helper";
import { ApiResponse } from "@/models/api-response.interface";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

let prisma = new PrismaClient();


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<unknown>>
) {

    try {
        const { user } = await getSessionAndUser(req, res);
        const { saldoId, entryId } = req.query;

        const saldo = await prisma.saldo.findFirstOrThrow({
            where: {
                id: saldoId as string,
                userId: user.id
            },
            include: {
                saldoEntry: true
            }
        });

        const entry = await prisma.saldoEntry.findFirstOrThrow({
            where: {
                id: entryId as string,
                saldoId: saldoId as string
            }
        });


        switch (req.method) {
            case "GET":
                res.status(200).json({
                    data: entry
                });
                break;
            case "DELETE":
                res.status(200).json({
                    data: await prisma.saldoEntry.delete({
                        where: {
                            id: entryId as string
                        }
                    })
                });
                break;
            case "PUT":
                res.status(200).json({
                    data: await prisma.saldoEntry.update({
                        where: {
                            id: entryId as string
                        },
                        data: req.body.saldoEntry
                    })
                });
                break;
            default:
                res.status(405).json({
                    message: "Method not allowed"
                })
                break;
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        res.status(500).json({
            message
        })
    }

}
