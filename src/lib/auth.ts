import NextAuth, { Session } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { usersTable } from "@/db/schema/users"
import { usersAuthsTable } from "@/db/schema/users_auths"
import { sessionsTable } from "@/db/schema/sessions"
import { verificationTokensTable } from "@/db/schema/verification_tokens"
import Resend from "next-auth/providers/resend"
import { NextRequest } from "next/server"
import { fetchUserAccounts } from "@/actions/user/fetch-user-accounts"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      image: string
      accountId: string
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: usersTable,
    accountsTable: usersAuthsTable,
    sessionsTable: sessionsTable,
    verificationTokensTable: verificationTokensTable,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_MAGIC_LINK_EMAIL_FROM,
    }),
  ],
  callbacks: {
    authorized: async ({
      auth: userSession,
      request,
    }: {
      auth: Session | null
      request: NextRequest
    }) => {
      const requestedPath = request.nextUrl.pathname

      // Anyone can visit the root path
      if (requestedPath === "/") return true

      if (!userSession || !userSession.user) {
        const nonSessionAllowedPaths = ["/signin", "/signup", "/verify"]

        if (nonSessionAllowedPaths.some((m) => requestedPath.includes(m))) {
          return true
        }

        return false
      }

      if (userSession.user) {
        const userAccounts = await fetchUserAccounts(userSession.user.id)

        if (userAccounts.length === 0 && requestedPath.includes("/welcome")) {
          return true
        }

        const sessionBlockedPaths = [
          "/signin",
          "/signup",
          "/verify",
          "/welcome",
        ]

        if (sessionBlockedPaths.some((m) => requestedPath.includes(m))) {
          return Response.redirect(new URL("/app", request.nextUrl))
        }

        if (userAccounts.length === 0) {
          return Response.redirect(new URL("/welcome", request.nextUrl))
        }
      }

      return true
    },
    session: async ({ session, user }) => {
      const userAccounts = await fetchUserAccounts(user.id)

      session.user.accountId = userAccounts[0].accountId ?? ""
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
})
