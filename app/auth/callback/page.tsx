"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const zoomCode = urlParams.get("code") // Zoom OAuth code if present

      if (zoomCode) {
        // ✅ Handle Zoom OAuth callback
        try {
          const clientId = "nvShuiEERBmNPdznFhjyqg" // hardcoded Zoom Client ID
          const clientSecret = "yhaV2iMr30JD5L45nL6wJytPwMdEeUQ1" // replace with your Zoom Secret
          const redirectUri = `${window.location.origin}/callback` // this page

          const tokenResponse = await fetch(
            `https://zoom.us/oauth/token?grant_type=authorization_code&code=${zoomCode}&redirect_uri=${redirectUri}`,
            {
              method: "POST",
              headers: {
                Authorization:
                  "Basic " +
                  btoa(`${clientId}:${clientSecret}`), // encode base64
              },
            }
          )

          const data = await tokenResponse.json()
          console.log("Zoom Access Token:", data.access_token)

          // ✅ Save token in localStorage or redirect with it
          localStorage.setItem("zoom_access_token", data.access_token)
          router.push("/dashboard") // redirect to dashboard
          return
        } catch (err) {
          console.error("[Zoom Callback Error]:", err)
          router.push("/auth/login?error=zoom_callback_failed")
          return
        }
      }

      // ✅ Handle Supabase auth callback
      try {
        console.log("[v0] Handling Supabase auth callback...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("[v0] Auth callback error:", error)
          router.push("/auth/login?error=callback_failed")
          return
        }

        if (session) {
          console.log("[v0] Session established for:", session.user.email)
          if (session.user.email === "sangamkunwar48@gmail.com") {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        } else {
          router.push("/")
        }
      } catch (err) {
        console.error("[v0] Callback Exception:", err)
        router.push("/auth/login?error=callback_failed")
      }
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
