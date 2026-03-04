import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { KakaoProvider, NaverProvider } from "./auth-providers"
import { prisma } from "./prisma"

// JWT 토큰 생성 함수
export function generateTokens(userId: string) {
  const accessToken = jwt.sign(
    { userId, type: "access" },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  )

  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  )

  return { accessToken, refreshToken }
}

// 토큰을 데이터베이스에 저장
export async function saveTokens(
  userId: string,
  accessToken: string,
  refreshToken: string
) {
  const accessExpires = new Date(Date.now() + 15 * 60 * 1000) // 15분
  const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7일

  // 기존 토큰 무효화
  await prisma.token.updateMany({
    where: {
      userId,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
    },
  })

  // 새 토큰 저장
  await prisma.token.createMany({
    data: [
      {
        userId,
        tokenType: "access",
        token: accessToken,
        expiresAt: accessExpires,
      },
      {
        userId,
        tokenType: "refresh",
        token: refreshToken,
        expiresAt: refreshExpires,
      },
    ],
  })
}

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // NextAuth v4에서는 타입 호환성 문제로 주석 처리
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7일
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    // 자체 회원가입 (이메일/비밀번호)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          throw new Error("존재하지 않는 사용자입니다.")
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isValid) {
          throw new Error("비밀번호가 일치하지 않습니다.")
        }

        // 마지막 로그인 시간 업데이트
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        }
      },
    }),
    // 구글 SSO
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 카카오 SSO
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    // 네이버 SSO
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 초기 로그인 시
      if (user) {
        token.userId = user.id
        token.email = user.email
        token.name = user.name

        // JWT 토큰 생성 및 저장
        const { accessToken, refreshToken } = generateTokens(user.id)
        await saveTokens(user.id, accessToken, refreshToken)

        token.accessToken = accessToken
        token.refreshToken = refreshToken
      }

      // SSO 로그인 시 계정 정보 저장
      if (account) {
        token.provider = account.provider
        token.providerAccountId = account.providerAccountId
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
  events: {
    async signIn({ user, account }) {
      // SSO 로그인 시 마지막 로그인 시간 업데이트
      if (account && account.provider !== "credentials") {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
      }
    },
  },
}

