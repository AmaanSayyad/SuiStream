// pages/api/user.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { deriveUserSalt } from "../../lib/salt";
import { jwtToAddress } from "@mysten/zklogin";
import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: any, res: any) {
  try {
    const session = await getServerSession(
      req as unknown as NextApiRequest,
      {
        ...res,
        getHeader: (name: string) => res.headers?.get(name),
        setHeader: (name: string, value: string) =>
          res.headers?.set(name, value),
      } as unknown as NextApiResponse,
      authOptions
    );
    console.log(session);

    let address = null;
    if (session !== null && session.user) {
      const email = session.user.email; // Removed type assertion

      // get the user from the database
      const user = await prisma.user.findUnique({
        where: {
          //@ts-ignore
          email,
        },
      });

      // get the account from the database
      const account = await prisma.account.findFirst({
        where: {
          userId: user?.id,
        },
      });

      // get the id_token from the account
      const id_token = account?.id_token;

      // get the salt from the id_token
      //@ts-ignore
      const salt = deriveUserSalt(id_token);

      // get the address from the id_token and salt
      //@ts-ignore
      address = jwtToAddress(id_token, salt);
    }

    console.log("SEssion : ", session);

    res.status(200).json({ session, address });
  } catch (error) {
    console.error("Error in API/user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
