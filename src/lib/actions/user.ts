'use server'

import { redirect } from "next/navigation"

export async function register(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log(email, password)

    redirect('/login')
}