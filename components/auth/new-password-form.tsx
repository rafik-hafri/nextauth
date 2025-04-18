"use client"
import * as z from "zod"
import CardWrapper from './card-wrapper'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "../ui/input"
import { NewPasswordSchema } from '@/schemas'
import { Button } from '../ui/button'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { useState, useTransition } from 'react'
import { newPassword } from "@/actions/new-password"
import { useSearchParams } from "next/navigation"
function NewPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues:{
        password:"",
        confirmPassword:""
        }
    })
    const [isPending, startTranstition] = useTransition()
    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        console.log("submitted")
        setError("")
        setSuccess("")
        startTranstition(()=>{
        newPassword(values, token).then((data) =>{
            setError(data?.error)
            setSuccess(data?.success)
        })
        })
        

    }

    return (
        <CardWrapper headerlabel='Enter a new password ' backButtonLabel='Back to login' backButtonHref='/auth/login'>
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4'>
                <FormField control={form.control} name="password" render={({field})=>(
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                    <Input {...field} placeholder='******' type="password" disabled={isPending}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
                )}/>
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder='******' type="password" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormError message={error}/>
            <FormSuccess message={success}/>
            <Button type='submit' className='w-full' disabled={isPending}>Reset password</Button>

            </form>

        </Form>
        </CardWrapper>
    )
    }

    export default NewPasswordForm