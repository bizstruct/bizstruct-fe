import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * false in the server HTML and until the client has taken over, true afterwards. Forms use it to keep their
 * submit button disabled until their onSubmit exists: a native submit before that would send the fields
 * (a password included) to the server as a query string.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
