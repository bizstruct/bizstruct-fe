import { NextRequest, NextResponse } from "next/server"
import { getMockEmpathyData } from "@/mocks/data/empathy-map"
import type { Locale } from "@/constants/i18n"

export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get("locale") ?? "en") as Locale
  return NextResponse.json(getMockEmpathyData(locale))
}
