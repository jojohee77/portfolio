import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      )
    }

    // 사용자의 모든 토큰 무효화
    await prisma.token.updateMany({
      where: {
        userId: session.user.id,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    })

    // 세션 삭제
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      message: "로그아웃되었습니다.",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "로그아웃 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

