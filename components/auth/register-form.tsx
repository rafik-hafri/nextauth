"use client"
import CardWrapper from './card-wrapper'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "../ui/input"
import * as z from "zod"
import { RegisterSchema } from '@/schemas'
import { Button } from '../ui/button'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { register } from '@/actions/register'
import { useState, useTransition } from 'react'
function RegisterForm() {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues:{
      email:"",
      password:"",
      name:""
    }
  })
  const [isPending, startTranstition] = useTransition()
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    console.log("submitted")
    setError("")
    setSuccess("")
    startTranstition(()=>{
      register(values).then((data) =>{
        setError(data.error)
        setSuccess(data.success)
        form.reset()
      })
    })
    

  }

  return (
    <CardWrapper headerlabel='Create an account' backButtonLabel='Already have an account?' backButtonHref='/auth/login' showSocial>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4'>
          <FormField control={form.control} name="name" render={({field})=>(
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='jhon doe' type="text" disabled={isPending}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
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
              </FormItem>
            )}/>
            

            

          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button type='submit' className='w-full' disabled={isPending}>Create an account</Button>

        </form>

      </Form>
    </CardWrapper>
  )
}

export default RegisterForm