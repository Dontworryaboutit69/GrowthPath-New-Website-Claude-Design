declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const FB_PIXEL_ID = "833336529334824";

type StandardEvent =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "InitiateCheckout"
  | "CompleteRegistration"
  | "Schedule"
  | "Contact"
  | "SubmitApplication";

export function fbqTrack(
  event: StandardEvent,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const id =
    eventId ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  window.fbq("track", event, params, { eventID: id });
}
