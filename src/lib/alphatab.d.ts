// types/alphatab.d.ts
declare interface Window {
  alphaTab: {
    AlphaTabApi: new (
      container: HTMLElement,
      settings: AlphaTabSettings
    ) => AlphaTabApi;
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
}

interface AlphaTabApi {
  scoreLoaded: {
    on: (callback: (score: Score) => void) => void;
  };
  postRenderFinished: {
    on: (callback: () => void) => void;
  };
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
  settings: AlphaTabSettings;
}

interface Score {
  tracks: Track[];
}

interface Track {
  name?: string;
  shortName?: string;
}