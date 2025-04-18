"use client"
import * as z from "zod"
import CardWrapper from './card-wrapper'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "../ui/input"
import { ResetSchema } from '@/schemas'
import { Button } from '../ui/button'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { useState, useTransition } from 'react'
import { reset } from "@/actions/reset"
function ResetForm() {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues:{
      email:"",
    }
  })
  const [isPending, startTranstition] = useTransition()
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    console.log("submitted")
    setError("")
    setSuccess("")
    startTranstition(()=>{
      reset(values).then((data) =>{
        setError(data?.error)
        setSuccess(data?.success)
      })
    })
    

  }

  return (
    <CardWrapper headerlabel='Forgot your password?' backButtonLabel='Back to login' backButtonHref='/auth/login'>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <FormField control={form.control} name="email" render={({field})=>(
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='jhon.doe@example.com' type="email" disabled={isPending}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button type='submit' className='w-full' disabled={isPending}>Send reset email</Button>

        </form>

      </Form>
    </CardWrapper>
  )
}

export default ResetForm