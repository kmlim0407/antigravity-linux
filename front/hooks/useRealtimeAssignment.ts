"use client";

import { useEffect, useRef } from "react";
import { getChannelName } from "@/lib/realtime";

type MessageHandler = (data: unknown) => void;

export function useRealtimeAssignment(
  assignmentId: string | null,
  onAnnotation?: MessageHandler,
  onCorrection?: MessageHandler
) {
  const onAnnotationRef = useRef(onAnnotation);
  const onCorrectionRef = useRef(onCorrection);
  onAnnotationRef.current = onAnnotation;
  onCorrectionRef.current = onCorrection;

  useEffect(() => {
    if (!assignmentId) return;
    const key = process.env.NEXT_PUBLIC_ABLY_API_KEY;
    if (!key) return;

    let client: { close: () => void } | null = null;

    import("ably").then(({ default: Ably }) => {
      const c = new Ably.Realtime({ key });
      client = c;
      const channel = c.channels.get(getChannelName(assignmentId));

      if (onAnnotationRef.current) {
        channel.subscribe("annotation", (msg) => {
          onAnnotationRef.current?.(msg.data);
        });
      }
      if (onCorrectionRef.current) {
        channel.subscribe("correction", (msg) => {
          onCorrectionRef.current?.(msg.data);
        });
      }
    }).catch(() => {});

    return () => {
      if (client) (client as { close: () => void }).close();
    };
  }, [assignmentId]);
}
