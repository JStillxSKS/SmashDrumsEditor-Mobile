import type { MetaJson } from "../types/meta";
import { sortTimingAnchors } from "./timing";

export const OFFSET_NUDGE_FINE_MS = 10;
export const OFFSET_NUDGE_COARSE_MS = 100;

/**
 * Silent lead-in before beat 0 hits — may live in SongTiming[0].timer (Indies/meta)
 * or [Song].Offset (Clone Hero .chart). Use the larger value when both are present.
 */
export function getSongOffset(meta: Pick<MetaJson, "SongOffsetSeconds" | "SongTiming">): number {
  const sorted = sortTimingAnchors(meta.SongTiming);
  const first = sorted[0];
  const timingOffset = first?.beat === 0 ? first.timer : 0;
  return Math.max(timingOffset, meta.SongOffsetSeconds);
}

export function offsetToMs(seconds: number): number {
  return Math.round(seconds * 1000);
}

export function offsetFromMs(ms: number): number {
  return ms / 1000;
}

/** Chart time is in the silent lead-in before audio begins */
export function isInSilentLeadIn(chartTime: number, offsetSeconds: number): boolean {
  return chartTime < offsetSeconds;
}

/** Chart timeline → audio element position (0 during silent lead-in) */
export function chartToAudioTime(chartTime: number, offsetSeconds: number): number {
  if (chartTime < offsetSeconds) return 0;
  return chartTime - offsetSeconds;
}

/** Audio file position → chart timeline */
export function audioToChartTime(audioTime: number, offsetSeconds: number): number {
  return audioTime + offsetSeconds;
}