import { query as q } from "faunadb";

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],

  secret: process.env.JWT_SECRET,

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const userEmail = user.email;

      try {
        await fauna.query(
          q.Create(
            // Onde Collection são as 'tabelas'
            q.Collection("users"),
            // Objeto que contém os dados que nós queremos inserir
            { data: { userEmail } }
          )
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
