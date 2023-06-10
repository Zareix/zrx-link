import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { notFound, redirect } from "next/navigation";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { cookies, headers } from "next/headers";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    signIn: ({ user }) => {
      return env.ADMIN_EMAILS.includes(user.email ?? "");
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export const getServerSideSession = () => {
  return getServerSession(authOptions);
};

export const getServerActionSession = async () => {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { getHeader() {}, setCookie() {}, setHeader() {} };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
  const session = await getServerSession(req, res, authOptions);
  return session;
};

export const checkUserCanManageLinks = async () => {
  const session = await getServerSideSession();
  if (!session?.user.email) {
    redirect("/api/auth/signin");
  }

  if (!env.ADMIN_EMAILS.includes(session.user.email)) {
    notFound();
  }
};
