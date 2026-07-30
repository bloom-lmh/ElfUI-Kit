export type VideoPreload = "none" | "metadata" | "auto";
export type VideoCrossOrigin = "" | "anonymous" | "use-credentials";

export interface VideoTrack {
  src: string;
  kind?: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
  srclang?: string;
  label?: string;
  default?: boolean;
}

export interface VideoControlLabels {
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  volume?: string;
  seek: string;
  playbackRate: string;
  pictureInPicture: string;
  fullscreen: string;
}

export interface VideoProps {
  src: string;
  poster: string;
  title: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  preload: VideoPreload;
  crossOrigin: VideoCrossOrigin;
  playsInline: boolean;
  controls: boolean;
  nativeControls: boolean;
  aspectRatio: string | number;
  volume: number;
  playbackRate: number;
  playbackRates: number[];
  tracks: VideoTrack[];
  labels: Partial<VideoControlLabels>;
}

export interface VideoTimeDetail {
  currentTime: number;
  duration: number;
  progress: number;
}

export interface VideoVolumeDetail {
  volume: number;
  muted: boolean;
}

export interface VideoEmits {
  play: [];
  pause: [];
  ended: [];
  error: [detail: MediaError | null];
  "time-update": [detail: VideoTimeDetail];
  "volume-change": [detail: VideoVolumeDetail];
  "rate-change": [detail: number];
  "fullscreen-change": [detail: boolean];
  "picture-in-picture-change": [detail: boolean];
}

export interface VideoExpose {
  playMedia(): Promise<void>;
  pauseMedia(): void;
  togglePlayback(): Promise<void>;
  seekTo(seconds: number): void;
  setVolumeLevel(volume: number): void;
  requestMediaFullscreen(): Promise<void>;
  togglePictureInPicture(): Promise<void>;
  getMediaElement(): HTMLVideoElement | null;
}

export type VideoElement = HTMLElement & VideoProps & VideoExpose;
