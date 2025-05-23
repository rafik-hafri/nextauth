
import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight:["600"]
})
export default function Home() {
  return (
  <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
    <div className="space-y-6 text-center">
      <h1 className={cn("text-6xl font-semibold text-white frop-shadow-md",font.className)}>
       🔐 Auth
      </h1>
      <p className="text-white text-lg">
        A simple authentication service
      </p>
      <div>
          <LoginButton mode="modal" asChild>
            <Button variant="secondary" size="lg">Sign in</Button>
          </LoginButton>
      </div>
    </div>

  </main>
  );
}
