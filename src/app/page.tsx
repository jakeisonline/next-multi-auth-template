/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/button"
import Link from "@/components/ui/link"
import Image from "next/image"

export default function AppPage() {
  return (
    <>
      <div className="absolute -z-10 flex-shrink-0">
        <Image
          src="/images/header-bg.png"
          width="1398"
          height="555"
          alt="A decorative background image"
          className="w-full"
          priority
        />
      </div>
      <header className="lg:top-0 w-full max-w-screen-2xl px-3 md:px-4 2xl:px-0">
        <div className="flex h-14 items-center">
          <div>
            <span>next-multi-auth-template</span>
          </div>
          <div className="justify-end flex flex-1 gap-2">
            <Button variant="outline" asChild>
              <Link
                href="https://jakeisonline.com/playground/tools/next-multi-auth-template"
                target="_blank"
              >
                <span className="sr-only">Documentation</span>
                <div className="not-sr-only">
                  Doc<span className="lg:hidden">s</span>
                  <span className="hidden lg:inline">umentation</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="w-full flex flex-col items-center justify-center max-w-screen-2xl px-2 md:px-4 2xl:px-0">
        <section className="mt-20 w-5/6 lg:w-full flex flex-col gap-2 text-center items-center">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tighter">
            Easy multi-tenant sign up and auth
          </h1>
          <p className="text-lg font-light w-5/6 lg:w-full">
            With database-backed sessions, user management, social sign in, and magic links.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-3 mt-4 justify-center w-full sm:w-auto">
            <Button
              size="xl"
              variant="outline"
              className="lg:bg-background"
              asChild
            >
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button size="xl" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="mt-auto grid w-full mb-6 pt-10 lg:text-sm text-xs max-w-screen-2xl px-2 md:px-4 2xl:px-0">
        <div className="text-lg text-center">
          <Link href="https://www.jakeisonline.com">👋 a template by Jake</Link>
        </div>
      </footer>
    </>
  )
}
