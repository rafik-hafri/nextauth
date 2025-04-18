import NextAuth , {type DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getAccountByUserId } from "./data/account"
 
declare module "next-auth" {
 
  interface Session {
    user: {
      role: UserRole
      isTwoFactorEnabled: boolean
      isOAuth: boolean
     
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn:"/auth/login",
    error:"/auth/error"
  },
  events: {
    async linkAccount({user}) {

      await db.user.update({
        where: {id: user.id},
        data:{emailVerified: new Date()}
      })
    }
  },
  callbacks: {
      
      async jwt({token}){
        if (!token.sub){
          return token
        }
        const existingUser = await getUserById(token.sub)
        if(!existingUser){
          return token
        }
        const existingAccount = await getAccountByUserId(existingUser.id)

        token.isOAuth = !!existingAccount
        token.name = existingUser.name
        token.email= existingUser.email
        token.role = existingUser.role
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
        return token
      },
      async session({token, session}){
        if(token.sub && session.user){
          session.user.id = token.sub
        }
        if ( token.role && session.user){
          session.user.role = token.role as UserRole

        }
        if ( token.isTwoFactorEnabled && session.user){
          session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean

        }
        //Updating Session after modification
        if(session.user){
          session.user.name = token.name
          session.user.email = token.email as string
          session.user.isOAuth = token.isOAuth as boolean

        }
        return session
      },
      async signIn({user, account}) {
        //Alow OAuth without email verification
       if(account?.privider !== "credentials") return true
       const existingUser =user.id && await getUserById(user.id)
      //  Prevent sign in without email verification
       if(existingUser && !existingUser?.emailVerified) return false
       if(existingUser && existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
        if(!twoFactorConfirmation) {
          return false
        }
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        })
       }

        return true
      }
      
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})