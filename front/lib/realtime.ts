/**
 * Real-time pub/sub for assignment annotations and corrections.
 * Uses Ably when NEXT_PUBLIC_ABLY_API_KEY is set; otherwise no-op.
 * Publish/subscribe run client-side.
 */

const CHANNEL_PREFIX = "prints:assignment:";

export function getChannelName(assignmentId: string): string {
  return `${CHANNEL_PREFIX}${assignmentId}`;
}

export function publishAnnotation(
  assignmentId: string,
  data: unknown
): void {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_ABLY_API_KEY;
  if (!key) return;
  import("ably").then(({ default: Ably }) => {
    const client = new Ably.Realtime({ key });
    const channel = client.channels.get(getChannelName(assignmentId));
    channel.publish("annotation", data, (err) => {
      if (err) console.warn("Ably publish annotation:", err);
      client.close();
    });
  }).catch((e) => console.warn("Ably publish annotation:", e));
}

export function publishCorrection(
  assignmentId: string,
  data: unknown
): void {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_ABLY_API_KEY;
  if (!key) return;
  import("ably").then(({ default: Ably }) => {
    const client = new Ably.Realtime({ key });
    const channel = client.channels.get(getChannelName(assignmentId));
    channel.publish("correction", data, (err) => {
      if (err) console.warn("Ably publish correction:", err);
      client.close();
    });
  }).catch((e) => console.warn("Ably publish correction:", e));
}
