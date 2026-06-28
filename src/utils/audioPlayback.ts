const SEEK_TIMEOUT_MS = 300;

export const PLAYBACK_SPEED_MIN = 0.25;
export const PLAYBACK_SPEED_MAX = 2;

export function clampPlaybackSpeed(speed: number): number {
  return Math.max(PLAYBACK_SPEED_MIN, Math.min(PLAYBACK_SPEED_MAX, speed));
}

export function syncAudioPlaybackRate(
  audio: HTMLAudioElement | null,
  speed: number
): void {
  if (!audio) return;
  audio.playbackRate = clampPlaybackSpeed(speed);
  audio.preservesPitch = true;
}

export function syncAudioVolume(
  audio: HTMLAudioElement | null,
  volume: number
): void {
  if (!audio) return;
  audio.volume = Math.max(0, Math.min(1, volume));
}

/** Wait until the media element has seeked (Electron often starts play before seek lands). */
export function waitForAudioSeek(
  audio: HTMLAudioElement,
  time: number
): Promise<void> {
  const target = Math.max(0, time);
  if (Math.abs(audio.currentTime - target) < 0.002) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      audio.removeEventListener("seeked", onSeeked);
      resolve();
    };
    const onSeeked = () => finish();
    audio.addEventListener("seeked", onSeeked);
    audio.currentTime = target;
    window.setTimeout(finish, SEEK_TIMEOUT_MS);
  });
}

export async function playEditorAudioAt(
  audio: HTMLAudioElement,
  audioTime: number
): Promise<void> {
  await waitForAudioSeek(audio, audioTime);
  try {
    await audio.play();
  } catch {
    await new Promise((r) => window.setTimeout(r, 50));
    try {
      await audio.play();
    } catch {
      // Autoplay blocked — chart clock still advances through silent lead-in.
    }
  }
}