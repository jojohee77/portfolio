// 카카오 프로바이더
export function KakaoProvider(options: {
  clientId: string
  clientSecret: string
}) {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth" as const,
    authorization: {
      url: "https://kauth.kakao.com/oauth/authorize",
      params: {
        scope: "profile_nickname profile_image account_email",
        response_type: "code",
      },
    },
    token: "https://kauth.kakao.com/oauth/token",
    userinfo: "https://kapi.kakao.com/v2/user/me",
    profile(profile: any) {
      return {
        id: profile.id.toString(),
        name: profile.kakao_account?.profile?.nickname || profile.id.toString(),
        email: profile.kakao_account?.email,
        image: profile.kakao_account?.profile?.profile_image_url,
      }
    },
    ...options,
  }
}

// 네이버 프로바이더
export function NaverProvider(options: {
  clientId: string
  clientSecret: string
}) {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth" as const,
    authorization: {
      url: "https://nid.naver.com/oauth2.0/authorize",
      params: {
        response_type: "code",
      },
    },
    token: "https://nid.naver.com/oauth2.0/token",
    userinfo: "https://openapi.naver.com/v1/nid/me",
    profile(profile: any) {
      return {
        id: profile.response.id,
        name: profile.response.name,
        email: profile.response.email,
        image: profile.response.profile_image,
      }
    },
    ...options,
  }
}

