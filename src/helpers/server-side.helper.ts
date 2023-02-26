import { ApiResponse } from "@/models/api-response.interface";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

let prisma = new PrismaClient();

export async function getSessionAndUser(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);


    if (!session || !session.user) {
        throw new Error("Unauthorized!")
    }

    const user = await prisma.user.findUnique({
        where: {
            // @ts-ignore
            nextAuthAccountId: session.user.id
        }
    })

    if (!user) {
        throw new Error("Unauthorized!")
    }

    return { session, user }
}

