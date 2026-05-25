import { NextResponse } from "next/server"
import { mockActiveProjects } from "@/mocks/data/projects"

export async function GET() {
  return NextResponse.json(mockActiveProjects)
}
