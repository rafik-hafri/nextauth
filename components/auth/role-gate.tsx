"use client"

import {useCurrentRole} from "@/hooks/use-current-role"
import { UserRole } from "@prisma/client"
import FormError from "../form-error"

interface RoleGateProps { 
    children: React.ReactNode
    allowedRole: UserRole
}
function RoleGate({children, allowedRole}:RoleGateProps) {
    const role = useCurrentRole()
    if(role !== allowedRole) {
        return (
            <FormError message="You dont have permission to view this content "/>
        )
    }
  return (
        <>
         {children}
        </>
)
}

export default RoleGate