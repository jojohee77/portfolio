import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
    }
    accessToken?: string
    refreshToken?: string
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    email: string
    name: string
    accessToken?: string
    refreshToken?: string
    provider?: string
    providerAccountId?: string
  }
}

