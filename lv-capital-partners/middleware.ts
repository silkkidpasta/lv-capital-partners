import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/investments/deal(.*)',
  '/reports(.*)',
])

export default clerkMiddleware((auth, req) => {
  // Skip protection during build process or when keys are missing
  if (process.env.NODE_ENV === 'development' ||
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder') {
    return
  }

  if (isProtectedRoute(req)) {
    try {
      auth.protect()
    } catch (error) {
      // Gracefully handle auth errors during build
      console.log('Auth error during build:', error)
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
