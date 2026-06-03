import { NextRequest, NextResponse } from "next/server"
import { getMockScenarioData } from "@/mocks/data/scenario"
import type { Locale } from "@/constants/i18n"

export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get("locale") ?? "en") as Locale
  return NextResponse.json(getMockScenarioData(locale))
}

export async function PUT() {
  return NextResponse.json({ ok: true })
}
