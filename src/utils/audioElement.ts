import { useEditorStore } from "../store/useEditorStore";
import { getActiveDuration } from "./audioSource";
import { chartToAudioTime, getSongOffset, isInSilentLeadIn } from "./offset";
import { RESOLUTION } from "./resolution";
import { beatToTime, timeToBeat } from "./timing";

export function getAudioElement(): HTMLAudioElement | null {
  return document.getElementById("editor-audio") as HTMLAudioElement | null;
}

function clampChartTime(chartTime: number): number {
  const state = useEditorStore.getState();
  const t = Math.max(0, chartTime);
  const offset = getSongOffset(state.meta);
  const activeDuration = getActiveDuration(state);
  const maxChart = activeDuration > 0 ? activeDuration + offset : t;
  return Math.min(t, maxChart);
}

function syncAudioToChartTime(chartTime: number): void {
  const state = useEditorStore.getState();
  const offset = getSongOffset(state.meta);
  const duration = getActiveDuration(state);
  const audio = getAudioElement();
  if (!audio) return;

  const silent = isInSilentLeadIn(chartTime, offset);
  audio.muted = silent;
  if (silent) {
    audio.currentTime = 0;
  } else {
    const audioTime = Math.min(chartToAudioTime(chartTime, offset), duration || Infinity);
    audio.currentTime = Math.max(0, audioTime);
  }
}

function commitSeek(chartTime: number, scrollTick: number): void {
  const state = useEditorStore.getState();
  state.setCurrentTime(chartTime);
  state.setScrollTick(scrollTick);
}

/** Seek by chart time (seconds); scroll follows the timing map */
export function seekChartTime(chartTime: number): void {
  const state = useEditorStore.getState();
  const t = clampChartTime(chartTime);
  syncAudioToChartTime(t);
  const beat = timeToBeat(t, state.meta.SongTiming);
  commitSeek(t, beat * RESOLUTION);
}

/** Seek by scroll tick — keeps the strike bar aligned to the wheel position */
export function seekScrollTick(scrollTick: number): void {
  const state = useEditorStore.getState();
  const tick = Math.max(0, scrollTick);
  const t = clampChartTime(beatToTime(tick / RESOLUTION, state.meta.SongTiming));
  syncAudioToChartTime(t);
  commitSeek(t, tick);
}

/** Sync playback position to whatever tick is at the strike bar */
export function seekToStrikeBar(): void {
  seekScrollTick(useEditorStore.getState().scrollTick);
}