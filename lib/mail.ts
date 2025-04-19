import {Resend} from "resend"

const resend = new Resend(process.env.RESENND_API_KEY)
const domain = process.env.NEXT_PUBLIC_APP_URL

const baseTemplate = (title: string, body: string) => `
  <div style="background-color: #f0f8ff; padding: 40px 0; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background-color: #007BFF; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${title}</h1>
      </div>
      <div style="padding: 30px; color: #333333;">
        ${body}
        <p style="margin-top: 40px; font-size: 12px; color: #888888;">If you did not request this, you can ignore this email.</p>
      </div>
      <div style="background-color: #f0f8ff; padding: 15px; text-align: center; font-size: 12px; color: #999999;">
        &copy; ${new Date().getFullYear()} nextauth
      </div>
    </div>
  </div>
`;

export const sendVerificationEmail = async (email:string, token:string)=>{
    const confirmationLink = `${domain}/auth/new-verification?token=${token}`
    const body = `
    <p style="font-size: 16px;">Thank you for signing up! Please confirm your email by clicking the button below:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${confirmationLink}" style="background-color: #007BFF; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none;">Confirm Email</a>
    </p>
  `
    await resend.emails.send({
        from:"auth@rafikhafri.dev",
        to:email,
        subject: "Confim your email",
        html: baseTemplate("Email Confirmation", body),
    })
}


export const sendPasswordResetEmail = async (email:string, token:string)=>{
    const resetLink = `${domain}/auth/new-password?token=${token}`
    const body = `
    <p style="font-size: 16px;">You requested a password reset. Click the button below to proceed:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="background-color: #007BFF; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
    </p>
  `;
    await resend.emails.send({
        from:"auth@rafikhafri.dev",
        to:email,
        subject: "Reset password",
        html: baseTemplate("Password Reset", body),
    })
}

export const sendTwoFactorTokenEmail = async (email:string,
    token:string) => {
        const body = `
        <p style="font-size: 16px;">Here is your 2FA code:</p>
        <p style="font-size: 24px; font-weight: bold; text-align: center; margin: 30px 0;">${token}</p>
      `;
        await resend.emails.send({
            from:"auth@rafikhafri.dev",
            to:email,
            subject: "2FA Code",
            html: baseTemplate("Two-Factor Authentication", body),
        })
    
}