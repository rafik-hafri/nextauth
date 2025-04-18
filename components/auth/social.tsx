"use client "
import React from 'react'
import { Button } from '../ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { signIn, useSession } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { useSearchParams } from 'next/navigation'

function Social() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const {update} = useSession()
  const handleSocialSignin = (provider: "google" | "github" )=>{
    signIn(provider, {
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
    })
    update()
    
   
  }
  return (
    <div className='flex items-center w-full gap-x-2'>
        <Button className='w-1/2' variant="outline" onClick={()=> {handleSocialSignin("github")}}>
            <FaGithub className='h-5 w-5' />
        </Button>
        <Button className='w-1/2' variant="outline" onClick={()=> {handleSocialSignin("google")}}>
            <FcGoogle className='h-5 w-5'/>
        </Button>
    </div>
  )
}

export default Social