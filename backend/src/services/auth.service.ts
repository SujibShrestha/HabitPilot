import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid Google token");
  }
  const { sub, email, name, picture } = payload;

  if (!sub || !email) throw new Error("Google token payload missing id/email");
  let user = await prisma.user.findUnique({
    where: { google_id: sub },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        google_id: sub,
        email,
        name: name || "",
        avatar: picture || "",
      },
    });
  }

  const tokenJWT = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { token: tokenJWT, user };
};
