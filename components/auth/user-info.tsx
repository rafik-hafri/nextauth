import { ExtendedUser } from "@/lib/types";

interface userInfoProps {
user?:ExtendedUser,
label:string
}

import React from 'react'
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

function UserInfo({user, label}:userInfoProps) {
  return (
    <Card className="w-[400px] shadow-md ">
        <CardHeader >
            <p className="text-2xl font-semibold text-center">
                {label}
            </p>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className="text-sm font-medium">
                    ID
                </p>
                <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                    {user?.id}
                </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className="text-sm font-medium">
                    Name
                </p>
                <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                    {user?.name}
                </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className="text-sm font-medium">
                    Email
                </p>
                <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                    {user?.email}
                </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className="text-sm font-medium">
                    Role
                </p>
                <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                    {user?.role}
                </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className="text-sm font-medium">
                    Two Factor Authentication
                </p>
                <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
                {user?.isTwoFactorEnabled? "ON" : "OFF"}
                </Badge>    
            </div>

        </CardContent>
    </Card>
  )
}

export default UserInfo