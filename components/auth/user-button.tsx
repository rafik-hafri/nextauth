"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { Avatar } from "../ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { FaUser } from "react-icons/fa"
import { useCurrentUser } from "@/hooks/use-current-user"
import LogoutButton from "./logout-button"
import { LogOut } from "lucide-react"



function UserButton() {
    const user = useCurrentUser()
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage src={user?.image || ""} className="w-full h-full object-cover" />
                <AvatarFallback className="bg-sky-500">
                    <FaUser className="text-white size-full object-cover"/>
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
            <LogoutButton>
                <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2"/>
                    Logout
                </DropdownMenuItem>
            </LogoutButton>
        </DropdownMenuContent>
        
    </DropdownMenu>

)
}

export default UserButton