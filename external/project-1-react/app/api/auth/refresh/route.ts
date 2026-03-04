import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { generateTokens, saveTokens } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token이 필요합니다." },
        { status: 400 }
      )
    }

    // Refresh token 검증
    let decoded: any
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)
    } catch (error) {
      return NextResponse.json(
        { error: "유효하지 않은 refresh token입니다." },
        { status: 401 }
      )
    }

    // 데이터베이스에서 토큰 확인
    const tokenRecord = await prisma.token.findFirst({
      where: {
        userId: decoded.userId,
        tokenType: "refresh",
        token: refreshToken,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "유효하지 않은 refresh token입니다." },
        { status: 401 }
      )
    }

    // 사용자 확인
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 새 토큰 생성 및 저장
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id)
    await saveTokens(user.id, accessToken, newRefreshToken)

    return NextResponse.json({
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    return NextResponse.json(
      { error: "토큰 갱신 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

