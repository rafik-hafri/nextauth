"use server"
import * as z from "zod"
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { getUserByEmail } from "@/data/user"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

export const login = async(values: z.infer<typeof LoginSchema>, callbackUrl?:string) => {
    
    const validatedFieldes = LoginSchema.safeParse(values)
    if (!validatedFieldes.success) {
        return {error: "Invalid fields!"}
    }
    const {email, password, code} = validatedFieldes.data
    
    const existingUser = await getUserByEmail(email)
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error: "Email does not exist!"}
    }
    if(!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {success: "Confirmation email sent!"}
    }
    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if(!twoFactorToken || twoFactorToken.token!== code){
                return {error: "Invalid code!"}
            }
            const hasExpired = new Date(twoFactorToken.expires) < new Date()
            if (hasExpired){
                return {error: "Code expired!"}
            }
            await db.twoFactorToken.delete({
                where:{
                    id:twoFactorToken.id
                }
            })
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                })
            }
            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
        } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email)
        await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token
        )
        return {twoFactor: true}}
    }
    
    try {
        await signIn("credentials", {
            email, password,redirectTo:callbackUrl || DEFAULT_LOGIN_REDIRECT
        })

        
    }catch(error) {
        if(error instanceof AuthError){
            const { type, cause } = error as AuthError;
            switch(error.type){
                case "CredentialsSignin":
                return {error: "Invalid credentials"}
                case "CallbackRouteError":
				return {error:cause?.err?.toString()}
                default:
                return {error:"Something went wrong!"}
            }
        }
        throw error

    }
}