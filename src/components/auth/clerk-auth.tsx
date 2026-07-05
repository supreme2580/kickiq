"use client"

import { ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs"
import type { ReactNode } from "react"

const HAS_CLERK =
  typeof window !== "undefined" &&
  typeof process !== "undefined" &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  if (!HAS_CLERK) return <>{children}</>

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {children}
    </ClerkProvider>
  )
}

export function AuthButtons() {
  if (!HAS_CLERK) return null

  return (
    <>
      <SignInButton mode="modal" />
      <UserButton />
    </>
  )
}
