"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Github, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // ==============================
  // OAuth Login (Google / GitHub)
  // ==============================
  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  // ==============================
  // Email & Password Login
  // ==============================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      toast({
        title: "Login Failed",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (!data.user.email_confirmed_at) {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email first.",
        variant: "destructive",
      })
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    toast({
      title: "Success",
      description: "Logged in successfully!",
    })

    router.push("/dashboard")
    setLoading(false)
  }

  // ==============================
  // Forgot Password
  // ==============================
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Email Sent",
        description: "Check your inbox for reset link",
      })
      setForgotPassword(false)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">

          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold">
              {forgotPassword ? "Reset Password" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {forgotPassword
                ? "Enter email to receive reset link"
                : "Sign in to your account"}
            </p>
          </div>

          {!forgotPassword ? (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-xs text-primary"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleOAuthLogin("google")}>
                  <Mail className="mr-2 h-4 w-4" /> Google
                </Button>
                <Button variant="outline" onClick={() => handleOAuthLogin("github")}>
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button className="w-full" disabled={loading}>
                Send Reset Link
              </Button>
              <Button variant="ghost" onClick={() => setForgotPassword(false)}>
                Back to Login
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-medium">
              Sign up
            </Link>
          </p>

        </div>
      </Card>
    </div>
  )
}
