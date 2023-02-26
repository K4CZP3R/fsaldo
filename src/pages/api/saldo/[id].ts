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
        const { user } = await getSessionAndUser(req, res)

        const { id } = req.query


        // Fetch it with userId as well, so we can check if the user is allowed to access it
        const saldo = await prisma.saldo.findFirstOrThrow({
            where: {
                id: id as string,
                userId: user.id
            },
            include: {
                saldoEntry: true
            }
        })

        switch (req.method) {
            case "GET":
                res.status(200).json({
                    data: saldo
                })
                break;
            case "PUT":
                res.status(200).json({
                    data: await prisma.saldo.update({
                        where: {
                            id: id as string,
                        },
                        data: {
                            saldoEntry: {
                                create: [
                                    req.body.saldoEntry
                                ]
                            }
                        }
                    })
                })
                break;
            default:
                res.status(405).json({
                    message: "Method not allowed"
                })
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        res.status(500).json({
            message
        })
    }
}