import { db } from "@/lib/db"

export const getVerificationTokenByEmail = async (email:string) => {
    try {
        const verificattionToken = await db.verificationToken.findFirst({
            where: {
                email
            }
        })
        return verificattionToken
    }catch {
        return null
    }
}

export const getVerificationTokenByToken = async (token:string) => {
    try {
        const verificattionToken = await db.verificationToken.findUnique({
            where: {
                token
            }
        })
        return verificattionToken
    }catch {
        return null
    }
}