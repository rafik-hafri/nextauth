import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const fonts = Poppins({
    subsets: ["latin"],
    weight:["600"]
})

interface HeaderProps {
    label:string
}

import React from 'react'

function Header({label}:HeaderProps) {
  return (
    <div className="w-full flex flex-col ga-y-4 items-center justify-center">
        <h1 className={cn("text-3xl font-semibold", fonts.className)}>
        🔐 Auth
        </h1>
        <p className="text-muted-foreground text-sm">
            {label}
        </p>
    </div>

  )
}

export default Header