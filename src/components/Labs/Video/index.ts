import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useEffect,
  useHost,
  useHostCssVar,
  useRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  VideoControlLabels,
  VideoEmits,
  VideoExpose,
  VideoProps,
  VideoTrack
} from "./types";

export type {
  VideoControlLabels,
  VideoCrossOrigin,
  VideoElement,
  VideoEmits,
  VideoExpose,
  VideoProps,
  VideoPreload,
  VideoTimeDetail,
  VideoTrack,
  VideoVolumeDetail
} from "./types";

const DEFAULT_LABELS: VideoControlLabels = {
  play: "Play",
  pause: "Pause",
  mute: "Mute",
  unmute: "Unmute",
  seek: "Seek",
  playbackRate: "Playback rate",
  pictureInPicture: "Picture in picture",
  fullscreen: "Fullscreen"
};

const props = defineProps<VideoProps>({
  src: { type: String, default: "" },
  poster: { type: String, default: "" },
  title: { type: String, default: "Video player" },
  autoplay: { type: Boolean, default: false },
  muted: { type: Boolean, default: false },
  loop: { type: Boolean, default: false },
  preload: { type: String, default: "metadata" },
  crossOrigin: { type: String, default: "" },
  playsInline: { type: Boolean, default: true },
  controls: { type: Boolean, default: true },
  nativeControls: { type: Boolean, default: false },
  aspectRatio: { type: null, default: "16 / 9" },
  volume: { type: Number, default: 1 },
  playbackRate: { type: Number, default: 1 },
  playbackRates: { type: Array, default: () => [0.75, 1, 1.25, 1.5, 2] },
  tracks: { type: Array, default: () => [] },
  labels: { type: Object, default: () => ({}) }
});

const emit = defineEmits<VideoEmits>();
const host = useHost();
const playing = useRef(false);
const currentTime = useRef(0);
const duration = useRef(0);
const muted = useRef(false);
const volume = useRef(1);
const playbackRate = useRef(1);

const media = (): HTMLVideoElement | null =>
  host.shadowRoot?.querySelector<HTMLVideoElement>("video") ?? null;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));

const label = (key: keyof VideoControlLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key];

const trackItems = (): VideoTrack[] => props.tracks;
const rateItems = (): number[] => props.playbackRates;

const syncTime = (): void => {
  const video = media();
  if (!video) return;
  currentTime.set(video.currentTime || 0);
  duration.set(Number.isFinite(video.duration) ? video.duration : 0);
  emit("time-update", {
    currentTime: currentTime.value,
    duration: duration.value,
    progress: duration.value > 0 ? currentTime.value / duration.value : 0
  });
};

const syncVolume = (): void => {
  const video = media();
  if (!video) return;
  muted.set(video.muted);
  volume.set(video.volume);
  emit("volume-change", { muted: video.muted, volume: video.volume });
};

const playMedia = async (): Promise<void> => {
  await media()?.play();
};

const pauseMedia = (): void => media()?.pause();

const togglePlayback = async (): Promise<void> => {
  if (media()?.paused ?? true) await playMedia();
  else pauseMedia();
};

const seekTo = (seconds: number): void => {
  const video = media();
  if (!video) return;
  const maximum = Number.isFinite(video.duration) ? video.duration : Math.max(0, seconds);
  video.currentTime = clamp(seconds, 0, maximum);
  syncTime();
};

const setVolumeLevel = (nextVolume: number): void => {
  const video = media();
  if (!video) return;
  video.volume = clamp(nextVolume, 0, 1);
  video.muted = video.volume === 0;
  syncVolume();
};

const toggleMuted = (): void => {
  const video = media();
  if (!video) return;
  video.muted = !video.muted;
  syncVolume();
};

const setPlaybackRate = (event: Event): void => {
  const video = media();
  if (!video) return;
  video.playbackRate = clamp(Number((event.currentTarget as HTMLSelectElement).value), 0.25, 4);
  playbackRate.set(video.playbackRate);
  emit("rate-change", video.playbackRate);
};

const onSeekInput = (event: Event): void =>
  seekTo(Number((event.currentTarget as HTMLInputElement).value));

const onMediaPlay = (): void => {
  playing.set(true);
  emit("play");
};

const onMediaPause = (): void => {
  playing.set(false);
  emit("pause");
};

const onMediaEnded = (): void => {
  playing.set(false);
  emit("ended");
};

const onMediaError = (): void => {
  emit("error", media()?.error ?? null);
};

const requestMediaFullscreen = async (): Promise<void> => {
  await host.shadowRoot?.querySelector<HTMLElement>(".video-shell")?.requestFullscreen?.();
};

type PictureInPictureDocument = Document & {
  pictureInPictureElement?: Element | null;
  exitPictureInPicture?: () => Promise<void>;
};

type PictureInPictureVideo = HTMLVideoElement & {
  requestPictureInPicture?: () => Promise<unknown>;
};

const togglePictureInPicture = async (): Promise<void> => {
  const video = media() as PictureInPictureVideo | null;
  const pipDocument = document as PictureInPictureDocument;
  if (!video) return;
  if (pipDocument.pictureInPictureElement && pipDocument.exitPictureInPicture) {
    await pipDocument.exitPictureInPicture();
  } else {
    await video.requestPictureInPicture?.();
  }
};

const onKeydown = (event: KeyboardEvent): void => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
  const key = event.key.toLowerCase();
  if (key === " " || key === "k") {
    event.preventDefault();
    void togglePlayback();
  } else if (key === "arrowleft" || key === "arrowright") {
    event.preventDefault();
    seekTo(currentTime.peek() + (key === "arrowleft" ? -5 : 5));
  } else if (key === "m") {
    toggleMuted();
  } else if (key === "f") {
    void requestMediaFullscreen();
  }
};

const formatTime = (value: number): string => {
  const safe = Math.max(0, Number.isFinite(value) ? value : 0);
  return `${Math.floor(safe / 60)}:${String(Math.floor(safe % 60)).padStart(2, "0")}`;
};

const timeLabel = (): string => `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`;
const playbackLabel = (): string => label(playing.value ? "pause" : "play");
const muteLabel = (): string => label(muted.value || volume.value === 0 ? "unmute" : "mute");
const isMuted = (): boolean => muted.value;
const isPlaying = (): boolean => playing.value;
const showCenterAction = (): boolean => props.controls && !isPlaying();
const timelineMaximum = (): number => Math.max(duration.value, 0);
const timelineValue = (): number => currentTime.value;
const volumeSymbol = (): string => muted.value || volume.value === 0 ? "Off" : "Vol";
const selectedPlaybackRate = (): number => playbackRate.value;
const pipSupported = (): boolean =>
  typeof document !== "undefined" && "pictureInPictureEnabled" in document;

useHostCssVar("--_video-ratio", () => String(props.aspectRatio || "16 / 9"));

onMounted(() => {
  const video = media();
  if (!video) return;
  const onFullscreenChange = (): void => {
    emit("fullscreen-change", Boolean(document.fullscreenElement));
  };
  const onPipEnter = (): void => {
    emit("picture-in-picture-change", true);
  };
  const onPipLeave = (): void => {
    emit("picture-in-picture-change", false);
  };

  document.addEventListener("fullscreenchange", onFullscreenChange);
  video.addEventListener("enterpictureinpicture", onPipEnter);
  video.addEventListener("leavepictureinpicture", onPipLeave);
  syncTime();

  return () => {
    document.removeEventListener("fullscreenchange", onFullscreenChange);
    video.removeEventListener("enterpictureinpicture", onPipEnter);
    video.removeEventListener("leavepictureinpicture", onPipLeave);
  };
});

useEffect(() => {
  const video = media();
  if (!video) return;
  video.volume = clamp(props.volume, 0, 1);
  video.muted = Boolean(props.muted);
  video.playbackRate = clamp(props.playbackRate, 0.25, 4);
  syncVolume();
  playbackRate.set(video.playbackRate);
});

defineExpose<VideoExpose>({
  playMedia,
  pauseMedia,
  togglePlayback,
  seekTo,
  setVolumeLevel,
  requestMediaFullscreen,
  togglePictureInPicture,
  getMediaElement: media
});

defineStyle(styles);

const Video = defineHtml(`
  <div class="video-shell" tabindex="0" role="group" :aria-label=${props.title} @keydown=${onKeydown}>
    <video
      :src=${props.src}
      :poster=${props.poster || null}
      :autoplay=${props.autoplay}
      :muted=${isMuted()}
      :loop=${props.loop}
      :preload=${props.preload}
      :crossorigin=${props.crossOrigin || null}
      :playsinline=${props.playsInline}
      :controls=${props.nativeControls}
      @play=${onMediaPlay}
      @pause=${onMediaPause}
      @ended=${onMediaEnded}
      @error=${onMediaError}
      @timeupdate=${syncTime}
      @loadedmetadata=${syncTime}
      @volumechange=${syncVolume}
    >
      <track
        v-for="track in trackItems()"
        :src="track.src"
        :kind="track.kind || 'subtitles'"
        :srclang="track.srclang || null"
        :label="track.label || null"
        :default="Boolean(track.default)"
      />
    </video>

    <button
      v-if=${showCenterAction()}
      class="center-action"
      type="button"
      :aria-label=${playbackLabel()}
      @click=${togglePlayback}
    >
      <span class="center-icon" aria-hidden="true"></span>
    </button>

    <div v-if=${props.controls} class="controls">
      <button class="control" type="button" :aria-label=${playbackLabel()} @click=${togglePlayback}>
        <span v-if=${isPlaying()} class="control-icon pause" aria-hidden="true"></span>
        <span v-else class="control-icon play" aria-hidden="true"></span>
      </button>
      <input
        class="timeline"
        type="range"
        min="0"
        :max=${timelineMaximum()}
        step="0.1"
        :value=${timelineValue()}
        :aria-label=${label("seek")}
        @input=${onSeekInput}
      />
      <span class="time">${timeLabel()}</span>
      <button class="control" type="button" :aria-label=${muteLabel()} @click=${toggleMuted}>
        <span aria-hidden="true">${volumeSymbol()}</span>
      </button>
      <select
        class="rate"
        :value=${selectedPlaybackRate()}
        :aria-label=${label("playbackRate")}
        @change=${setPlaybackRate}
      >
        <option v-for="rate in rateItems()" :value="rate">{{ rate }}x</option>
      </select>
      <button
        v-if=${pipSupported()}
        class="control"
        type="button"
        :aria-label=${label("pictureInPicture")}
        @click=${togglePictureInPicture}
      >PiP</button>
      <button
        class="control"
        type="button"
        :aria-label=${label("fullscreen")}
        @click=${requestMediaFullscreen}
      >[ ]</button>
    </div>
  </div>
`);

export { Video };
