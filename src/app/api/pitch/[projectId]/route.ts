import { NextRequest, NextResponse } from "next/server"
import { getMockPitchData } from "@/mocks/data/pitch"
import type { Locale } from "@/constants/i18n"

export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get("locale") ?? "en") as Locale
  return NextResponse.json(getMockPitchData(locale))
}
