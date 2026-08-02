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
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { VideoControlLabels, VideoEmits, VideoExpose, VideoProps, VideoTrack } from "./types";

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
  VideoVolumeDetail,
} from "./types";

const DEFAULT_LABELS: VideoControlLabels = {
  play: "Play",
  pause: "Pause",
  mute: "Mute",
  unmute: "Unmute",
  volume: "Volume",
  seek: "Seek",
  playbackRate: "Playback rate",
  pictureInPicture: "Picture in picture",
  fullscreen: "Fullscreen",
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
  labels: { type: Object, default: () => ({}) },
});

const emit = defineEmits<VideoEmits>();
const host = useHost();
const playing = useRef(false);
const currentTime = useRef(0);
const duration = useRef(0);
const muted = useRef(false);
const volume = useRef(1);
const playbackRate = useRef(1);
const volumeMenuOpen = useRef(false);
const rateMenuOpen = useRef(false);

const media = (): HTMLVideoElement | null =>
  host.shadowRoot?.querySelector<HTMLVideoElement>("video") ?? null;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));

const label = (key: keyof VideoControlLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;

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
    progress: duration.value > 0 ? currentTime.value / duration.value : 0,
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

const setVolumeFromInput = (event: Event): void => {
  setVolumeLevel(Number((event.currentTarget as HTMLInputElement).value));
};

const toggleVolumeMenu = (): void => {
  volumeMenuOpen.set(!volumeMenuOpen.value);
  rateMenuOpen.set(false);
};

const toggleRateMenu = (): void => {
  rateMenuOpen.set(!rateMenuOpen.value);
  volumeMenuOpen.set(false);
};

const selectPlaybackRate = (event: Event): void => {
  const video = media();
  if (!video) return;
  video.playbackRate = clamp(Number((event.currentTarget as HTMLElement).dataset.rate), 0.25, 4);
  playbackRate.set(video.playbackRate);
  emit("rate-change", video.playbackRate);
  rateMenuOpen.set(false);
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
  const key = event.key.toLowerCase();
  if (key === "escape") {
    volumeMenuOpen.set(false);
    rateMenuOpen.set(false);
    return;
  } else if (key === " " || key === "k") {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)
      return;
    event.preventDefault();
    void togglePlayback();
  } else if (key === "arrowleft" || key === "arrowright") {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)
      return;
    event.preventDefault();
    seekTo(currentTime.peek() + (key === "arrowleft" ? -5 : 5));
  } else if (key === "m") {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)
      return;
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
const isVolumeMenuOpen = (): boolean => volumeMenuOpen.value;
const isRateMenuOpen = (): boolean => rateMenuOpen.value;
const isPlaying = (): boolean => playing.value;
const showCenterAction = (): boolean => props.controls && !isPlaying();
const timelineMaximum = (): number => Math.max(duration.value, 0);
const timelineValue = (): number => currentTime.value;
const selectedPlaybackRate = (): number => playbackRate.value;
const volumeValue = (): number => volume.value;
const volumePercent = (): number => Math.round(volume.value * 100);
const volumeSegments = [0.2, 0.4, 0.6, 0.8, 1];
const isVolumeSegmentActive = (level: number): boolean =>
  !muted.value && volume.value > 0 && volume.value >= level - 0.001;
const timelineProgress = (): string =>
  `${Math.round((duration.value > 0 ? currentTime.value / duration.value : 0) * 100)}%`;
const volumeProgress = (): string => `${volumePercent()}%`;
const pipSupported = (): boolean =>
  typeof document !== "undefined" && "pictureInPictureEnabled" in document;

useHostCssVar("--_video-ratio", () => String(props.aspectRatio || "16 / 9"));
useHostCssVar("--_video-progress", timelineProgress);
useHostCssVar("--_video-volume", volumeProgress);

const syncConfiguredMedia = (): void => {
  const video = media();
  if (!video) return;
  video.volume = clamp(props.volume, 0, 1);
  video.muted = Boolean(props.muted);
  video.playbackRate = clamp(props.playbackRate, 0.25, 4);
  syncVolume();
  playbackRate.set(video.playbackRate);
};

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
  const onDocumentPointerDown = (event: PointerEvent): void => {
    if (
      event.target === host ||
      host.contains(event.target as Node) ||
      event.composedPath().includes(host)
    )
      return;
    volumeMenuOpen.set(false);
    rateMenuOpen.set(false);
  };

  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("pointerdown", onDocumentPointerDown);
  video.addEventListener("enterpictureinpicture", onPipEnter);
  video.addEventListener("leavepictureinpicture", onPipLeave);
  syncConfiguredMedia();
  syncTime();

  return () => {
    document.removeEventListener("fullscreenchange", onFullscreenChange);
    document.removeEventListener("pointerdown", onDocumentPointerDown);
    video.removeEventListener("enterpictureinpicture", onPipEnter);
    video.removeEventListener("leavepictureinpicture", onPipLeave);
  };
});

useEffect(() => {
  syncConfiguredMedia();
});

defineExpose<VideoExpose>({
  playMedia,
  pauseMedia,
  togglePlayback,
  seekTo,
  setVolumeLevel,
  requestMediaFullscreen,
  togglePictureInPicture,
  getMediaElement: media,
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
      <div class="volume-menu">
        <button class="control volume-control" type="button" :aria-label=${muteLabel()} :aria-expanded=${isVolumeMenuOpen()} @click=${toggleVolumeMenu}>
          <span class="volume-icon" :class="{ muted: isMuted() }" aria-hidden="true">
            <i
              v-for="level in volumeSegments"
              :class="{ active: isVolumeSegmentActive(level) }"
            ></i>
          </span>
        </button>
        <div v-if=${isVolumeMenuOpen()} class="volume-popover" role="dialog" :aria-label=${label("volume")}>
          <div class="volume-meter" aria-hidden="true">
            <i
              v-for="level in volumeSegments"
              :class="{ active: isVolumeSegmentActive(level) }"
            ></i>
          </div>
          <input
            class="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value=${volumeValue()}
            :aria-label=${label("volume")}
            @input=${setVolumeFromInput}
          />
          <output>${volumePercent()}%</output>
        </div>
      </div>
      <div class="rate-menu">
        <button class="rate" type="button" :aria-label=${label("playbackRate")} :aria-expanded=${isRateMenuOpen()} @click=${toggleRateMenu}>
          ${selectedPlaybackRate()}x <span class="rate-chevron" aria-hidden="true"></span>
        </button>
        <div v-if=${isRateMenuOpen()} class="rate-popover" role="listbox" :aria-label=${label("playbackRate")}>
          <button
            v-for="rate in rateItems()"
            class="rate-option"
            :class="{ active: rate === selectedPlaybackRate() }"
            type="button"
            role="option"
            :data-rate="rate"
            :aria-selected="rate === selectedPlaybackRate()"
            @click=${selectPlaybackRate}
          >{{ rate }}x</button>
        </div>
      </div>
      <button
        v-if=${pipSupported()}
        class="control pip-control"
        type="button"
        :aria-label=${label("pictureInPicture")}
        @click=${togglePictureInPicture}
      ><span class="pip-icon" aria-hidden="true"></span></button>
      <button
        class="control fullscreen-control"
        type="button"
        :aria-label=${label("fullscreen")}
        @click=${requestMediaFullscreen}
      ><span class="fullscreen-icon" aria-hidden="true"></span></button>
    </div>
  </div>
`);

export { Video };
