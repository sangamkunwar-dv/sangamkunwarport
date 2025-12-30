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
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // ⭐ GOOGLE SIGNUP / LOGIN
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      toast({
        title: "Google Sign Up Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // ⭐ GITHUB SIGNUP / LOGIN
  const handleGithubSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      toast({
        title: "GitHub Sign Up Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // ⭐ EMAIL + PASSWORD SIGNUP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else if (data.user) {
        toast({
          title: "Success",
          description: "Account created! Check your email to verify your account.",
        })
        router.push("/auth/verify-email")
      }
    } catch (err) {
      console.error("[Signup Error]:", err)
      toast({
        title: "Error",
        description: "An error occurred during signup",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join to send me messages</p>
          </div>

          {/* ⭐ EMAIL SIGNUP FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* ⭐ DIVIDER */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          {/* ⭐ GOOGLE BUTTON */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleSignup}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </Button>

          {/* ⭐ GITHUB BUTTON */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 mt-2"
            onClick={handleGithubSignup}
          >
            <img
              src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Continue with GitHub
          </Button>

          <div className="text-center text-sm pt-2">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
