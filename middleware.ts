import NextAuth from "next-auth"
import authConfig from "./auth.config.edge"; 
export const { auth } = NextAuth(authConfig)
import {DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes} from "@/routes"
export default auth((req) => {
    const {nextUrl} = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    if (isApiAuthRoute) {
        return 
    }
    if (isAuthRoute) {
        if(isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return 
    }
    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if(nextUrl.search) {
            callbackUrl += nextUrl.search
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)
        return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))

    }
    return 

})
export const config = {
    matcher: [
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      '/(api|trpc)(.*)',
    ],
  }