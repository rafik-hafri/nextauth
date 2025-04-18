"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import LoginForm from './login-form'
interface LoginButtonProps {
    children:React.ReactNode
    mode?:"modal" | "redirect"
    asChild?:boolean
}

function LoginButton({children, mode = "redirect", asChild }: LoginButtonProps) {
    const router = useRouter()
    const onClick = () => {
        router.push("auth/login")
        }
    if(mode === "modal"){
        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className='p-0 w-auto bg-transparent border-none'>
                    <DialogTitle className="sr-only">Login</DialogTitle>
                    <LoginForm/>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <span onClick={onClick} className="cursor-ponter">
            {children}
        </span>
    )
}


export default LoginButton