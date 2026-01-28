'use server'

import { signIn } from "@/auth"
import { AuthError } from 'next-auth'

export async function handleSignIn(email: string, password: string) {
    try {
        return await signIn('credentials', { email, password, redirect: true, redirectTo: '/' });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid email or password' }
                default:
                    return { error: 'Something went wrong' }
            }
        }
        throw error
    }
}