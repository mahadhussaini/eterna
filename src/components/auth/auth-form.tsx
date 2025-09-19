"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
})

type AuthFormData = z.infer<typeof authSchema>

interface AuthFormProps {
  type: "signin" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      if (type === "signup") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Registration failed")
        }
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/profile/setup")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/profile/setup" })
    } catch (error) {
      // Error is caught but not used - could be logged for debugging
      void error // Explicitly mark as unused
      setError("Google sign-in failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {type === "signup" ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {type === "signup"
            ? "Enter your details to create your account"
            : "Enter your credentials to sign in"}
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {type === "signup" && (
              <div className="grid gap-1">
                <Input
                  {...register("name")}
                  placeholder="Your name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                />
                {errors?.name && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}
            <div className="grid gap-1">
              <Input
                {...register("email")}
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Input
                {...register("password")}
                placeholder="Password"
                type="password"
                autoComplete={type === "signup" ? "new-password" : "current-password"}
                disabled={isLoading}
              />
              {errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && (
              <p className="px-1 text-xs text-red-600">
                {error}
              </p>
            )}
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {type === "signup" ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        {type === "signup" ? (
          <>
            Already have an account?{" "}
            <a
              href="/auth/signin"
              className="hover:text-brand underline underline-offset-4"
            >
              Sign In
            </a>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <a
              href="/auth/signup"
              className="hover:text-brand underline underline-offset-4"
            >
              Sign Up
            </a>
          </>
        )}
      </p>
    </div>
  )
}
