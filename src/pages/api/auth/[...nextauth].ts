import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();


export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_ID!,
            clientSecret: process.env.DISCORD_SECRET!
        })
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.sub;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                await prisma.user.upsert({
                    where: {
                        nextAuthAccountId: user.id
                    },
                    update: {},
                    create: {
                        nextAuthAccountId: user.id,
                        name: user.name || "unknown",
                        email: user.email || "unknown",
                        avatar: user.image || "unknown",
                    }
                });

                token.sub = token.sub || user.id;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt",
    }


} as AuthOptions;

export default NextAuth(authOptions);