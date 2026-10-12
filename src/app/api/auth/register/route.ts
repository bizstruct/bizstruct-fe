import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { register } from "@/lib/server/bff"
import { BackendConfigError } from "@/lib/server/backend"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string; fullName?: string } | null
  if (!body?.email || !body.password) return NextResponse.json({ detail: "email and password are required" }, { status: 422 })
  try {
    const response = await register({ email: body.email, password: body.password, fullName: body.fullName }, await cookies())
    return new NextResponse(response.body, { status: response.status === 201 ? 200 : response.status, headers: { "content-type": response.contentType } })
  } catch (error) {
    if (error instanceof BackendConfigError) return NextResponse.json({ detail: error.message }, { status: 500 })
    return NextResponse.json({ detail: "The backend is unreachable" }, { status: 502 })
  }
}
