"use client"
import * as z from "zod"
import CardWrapper from './card-wrapper'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "../ui/input"
import { LoginSchema } from '@/schemas'
import { Button } from '../ui/button'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { login } from '@/actions/login'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { useSession } from "next-auth/react"
function LoginForm() {
  const {update} = useSession()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const searchParams = useSearchParams()
  const urlError  = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : ""
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues:{
      email:"",
      password:"",
      code:""
    }
  })
  const [isPending, startTranstition] = useTransition()
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setSuccess("")
    startTranstition(()=>{
      login(values, callbackUrl || undefined).then(async(data) =>{
        
        if(data?.error) {
          form.reset()
          setError(data?.error)
        }
        if(data?.twoFactor) {
          setShowTwoFactor(true)
        } 
        update()
      })
    })
    

  }

  return (
    <CardWrapper headerlabel='Welcome back' backButtonLabel='Dont have an account?' backButtonHref='/auth/register' showSocial>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div key={showTwoFactor ? "twoFactor" : "login"} className='space-y-4'>
            {!showTwoFactor ? (
              <>
            <FormField control={form.control} name="email" render={({field})=>(
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='jhon.doe@example.com' type="email" disabled={isPending}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={form.control} name="password" render={({field})=>(
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='*******' type="password" disabled={isPending}/>
                </FormControl>
                <FormMessage/>
                <Button size="sm" variant="link" asChild className="px-0 font-normal">
                  <Link href="/auth/reset">Forgot password?</Link>
                </Button>
              </FormItem>
            )}/>
          </>
          ): (
          <FormField control={form.control} name="code" render={({field})=>(
            <FormItem>
              <FormLabel>Two Factor Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder='123456' disabled={isPending}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          )}

          </div>
          <FormError message={error || urlError}/>
          <FormSuccess message={success}/>
          <Button type='submit' className='w-full' disabled={isPending}>{showTwoFactor ? "Confirm" : "Login"}</Button>

        </form>

      </Form>
    </CardWrapper>
  )
}

export default LoginForm