import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const handler = NextAuth({
  providers : [

    GoogleProvider({
      clientId : process.env.Client_ID ??"",
      clientSecret: process.env.see ?? ""
    })
  ]
})
