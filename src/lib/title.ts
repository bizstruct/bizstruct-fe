const MAX_LENGTH = 48

/** A short project name taken from the idea: its first sentence, cut at a word boundary. */
export function titleFromIdea(idea: string): string {
  const text = idea.trim().replace(/\s+/g, " ")
  const sentence = text.split(/(?<=[.!?…])\s/)[0].replace(/[.!?…\s]+$/, "")
  if (sentence.length <= MAX_LENGTH) return sentence
  const cut = sentence.slice(0, MAX_LENGTH + 1)
  const boundary = cut.lastIndexOf(" ")
  return `${cut.slice(0, boundary > MAX_LENGTH / 2 ? boundary : MAX_LENGTH).replace(/[,;:\s]+$/, "")}…`
}
