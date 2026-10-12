import { ProjectScreen } from "@/components/project/project-screen"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProjectScreen id={id} />
}
