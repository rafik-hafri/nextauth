"use server"
import * as z from "zod"
import { RegisterSchema } from '@/schemas'
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import bcrypt from "bcryptjs"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"


export const register = async(values: z.infer<typeof RegisterSchema>) => {
    const validatedFieldes = RegisterSchema.safeParse(values)
    if (!validatedFieldes.success) {
        return {error: "Invalid fields!"}
    }
    const {email, password, name} = validatedFieldes.data
    const existinguser = await getUserByEmail(email.toLowerCase().trim())
    if (existinguser) {
        return {error: "Email already in use!"}
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    })
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
  
    return {success: "Confirmation email sent!"}
   

}