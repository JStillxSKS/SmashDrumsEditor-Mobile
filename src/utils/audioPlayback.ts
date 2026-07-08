import { editorAudioContext } from "./editorAudioContext";
import { editorAudioPlayer } from "./editorAudioPlayer";
import { clampPlaybackSpeed, PLAYBACK_SPEED_MAX, PLAYBACK_SPEED_MIN } from "./playbackSpeed";

export { PLAYBACK_SPEED_MIN, PLAYBACK_SPEED_MAX, clampPlaybackSpeed };

export async function resumeEditorAudio(): Promise<void> {
  if (editorAudioContext.state === "suspended") {
    await editorAudioContext.resume();
  }
}

export function syncAudioPlaybackRate(_audio: HTMLAudioElement | null, speed: number): void {
  editorAudioPlayer.setRate(speed);
}

export function syncAudioVolume(_audio: HTMLAudioElement | null, volume: number): void {
  editorAudioPlayer.setVolume(volume);
}

/** Stop in-flight playback work (call on pause). */
export function cancelPendingAudioPlayback(): void {
  editorAudioPlayer.cancelPending();
}

export function playEditorAudioAt(audioTime: number): void {
  void resumeEditorAudio().then(() => {
    editorAudioPlayer.play(audioTime);
  });
}