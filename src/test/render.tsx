import { render } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import type { ReactElement } from "react"
import en from "../../messages/en.json"
import uk from "../../messages/uk.json"

export const MESSAGES = { en, uk }

export function renderIntl(ui: ReactElement, locale: keyof typeof MESSAGES = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {ui}
    </NextIntlClientProvider>,
  )
}
