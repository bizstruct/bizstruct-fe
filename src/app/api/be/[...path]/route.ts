import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { forward } from "@/lib/server/bff"
import { BackendConfigError } from "@/lib/server/backend"

type Context = { params: Promise<{ path: string[] }> }

async function handle(request: Request, { params }: Context) {
  const { path } = await params
  const search = new URL(request.url).search
  const json = request.method === "POST" ? await request.json().catch(() => undefined) : undefined
  try {
    const response = await forward({ method: request.method, path: `/api/${path.join("/")}${search}`, json, jar: await cookies() })
    if (response.status === 204) return new NextResponse(null, { status: 204 })
    return new NextResponse(response.body, { status: response.status, headers: { "content-type": response.contentType } })
  } catch (error) {
    if (error instanceof BackendConfigError) return NextResponse.json({ detail: error.message }, { status: 500 })
    const timeout = error instanceof DOMException && error.name === "TimeoutError"
    return NextResponse.json({ detail: timeout ? "The backend timed out" : "The backend is unreachable" }, { status: timeout ? 504 : 502 })
  }
}

export const GET = handle
export const POST = handle
export const DELETE = handle
