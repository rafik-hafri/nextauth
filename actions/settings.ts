"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"
import { getUserByEmail, getUserById } from "@/data/user"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { SettingsSchema } from "@/schemas"


export const settings = async(values:z.infer<typeof SettingsSchema>) => {
    const validatedFieldes = SettingsSchema.safeParse(values)
    if (!validatedFieldes.success) {
        return {error: "Invalid fields!"}
    }
    let {name,email, password,newPassword,isTwoFactorEnabled,role} =validatedFieldes.data
    const user = await getCurrentUser()
    if(!user){
        return {error: "Unauthorized"}
    }
    const dbUser = await getUserById((user.id as string))
    if(!dbUser){
        return {error: "Unauthorized"}
    }
    if(user.isOAuth) {
        email = undefined
        password = undefined
        newPassword = undefined
        isTwoFactorEnabled = undefined
    }
    if(password && newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(password, dbUser.password)
        if(!passwordsMatch){
            return {error: "Incorrect password!"}
        }
        const hashedPassword = await bcrypt.hash(newPassword,10)
        password = hashedPassword
        newPassword = undefined
    }

    if(email && email !== user.email) {
        const existingUser =await getUserByEmail(email)
        if (existingUser && existingUser.id !== user.id) {
            return {error: "Email already in use!"}
        }
        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {error: "Confirmation email sent!"}
    }
    try {
        await db.user.update({
            where:{
                id:dbUser.id
            },
            data: {
                name,
                email,
                password,
                emailVerified:undefined,
                role,
                isTwoFactorEnabled
            }
        })
        return {success: "Settings updated"}

    }catch {
        return {error: "Something went wrong!"}
    }
}