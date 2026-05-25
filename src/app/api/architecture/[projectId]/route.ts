import { NextRequest, NextResponse } from "next/server"
import { getMockArchitectureData } from "@/mocks/data/architecture"
import type { Locale } from "@/constants/i18n"

export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get("locale") ?? "en") as Locale
  return NextResponse.json(getMockArchitectureData(locale))
}
