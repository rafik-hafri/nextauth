"use client"

import { logout } from "@/actions/logout"

interface LogoutButtonProps {
    children?:React.ReactNode
}
function LogoutButton({children}:LogoutButtonProps) {
    const handleSignout = () => {
        logout()
    }
  return (
    <span onClick={handleSignout} className="cursor-pointer">
        {children}
    </span>
  )
}

export default LogoutButton