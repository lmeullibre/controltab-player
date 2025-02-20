// types/alphatab.d.ts
declare interface Window {
  alphaTab: {
    AlphaTabApi: new (
      container: HTMLElement,
      settings: AlphaTabSettings
    ) => AlphaTabApi;
    synth: {
      PlayerState: {
        Playing: number;
        Paused: number;
        Stopped: number;
      };
    };
  };
}

interface AlphaTabSettings {
  file?: string;
  core?: {
    engine?: string;
  };
  display?: {
    layoutMode?: number;
    barsPerRow?: number;
  };
  notation?: {
    elements?: Map<string, boolean>;
  };
  player?: {
    enablePlayer?: boolean;
    soundFont?: string;
    scrollElement?: HTMLElement;
  };
}

interface AlphaTabEvent<T> {
  on: (handler: (e: T) => void) => void;
  off: (handler: (e: T) => void) => void;
}

interface PlayerStateChangedEvent {
  state: number;
}

interface AlphaTabApi {
  scoreLoaded: AlphaTabEvent<Score>;
  postRenderFinished: AlphaTabEvent<void>;
  playerStateChanged: AlphaTabEvent<PlayerStateChangedEvent>;
  playerReady: AlphaTabEvent<void>;
  renderTracks: (tracks: Track[]) => void;
  print: (
    element?: undefined,
    settings?: { display: { barsPerRow: number } }
  ) => void;
  destroy: () => void;
  load: (data: ArrayBuffer) => void;
  play: () => void;
  pause: () => void;
  playPause: () => void;
}

interface Score {
  tracks: Track[];
}

interface Track {
  name?: string;
  shortName?: string;
}