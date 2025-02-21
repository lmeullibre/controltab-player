<script lang="ts">
    let { src = null, autoPlay = false } = $props<{
        src?: string | null;
        autoPlay?: boolean;
    }>();

    interface Track {
        index: number;
        name: string;
        shortName?: string;
        color?: {
            raw: number;
            rgba: string;
        };
        defaultSystemLayout?: number;
        systemLayout?: number[];
    }

    let player: AlphaTabApi | null = null;
    let containerElement: HTMLElement;
    let isPlaying = $state<boolean>(false);
    let tracks = $state<Track[]>([]);
    let selectedTrackIndex = $state<number | null>(null);
    let currentScore: any = null;

    $effect(() => {
        if (!containerElement) return;

        if (typeof window !== "undefined" && window.alphaTab) {
            const { AlphaTabApi } = window.alphaTab;

            try {
                const settings: AlphaTabSettings = {
                    notation: {
                        elements: new Map([["guitarTuning", false]]),
                    },
                    player: {
                        enablePlayer: true,
                        soundFont:
                            "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
                    },
                };
                player = new AlphaTabApi(containerElement, settings);

                player.scoreLoaded.on((score) => {
                    console.log("Score loaded:", score);
                    currentScore = score;

                    const newTracks = Array.from(score.tracks).map(
                        (track: any) => ({
                            index: track.index as number,
                            name:
                                track.name ||
                                track.shortName ||
                                `Track ${track.index + 1}`,
                        }),
                    );

                    // Assign to tracks to trigger reactivity
                    tracks = newTracks;
                    console.log("Tracks array updated:", tracks);

                    // Select first track by default
                    if (tracks.length > 0) {
                        selectTrack(0);
                    }
                });

                if (src) {
                    loadTab(src);
                }

                return () => {
                    if (player) {
                        player.destroy();
                    }
                };
            } catch (error) {
                console.error("Error initializing AlphaTab:", error);
            }
        }
    });

    async function loadTab(tabSrc: string) {
        try {
            const response = await fetch(tabSrc);
            const data = await response.arrayBuffer();

            if (player) {
                player.load(data);

                if (autoPlay) {
                    player.play();
                    isPlaying = true;
                }
            }
        } catch (error) {
            console.error("Error loading tab:", error);
        }
    }

    function selectTrack(index: number) {
        selectedTrackIndex = index;
        if (player && currentScore) {
            const track = currentScore.tracks[index];
            if (track) {
                player.renderTracks([track]);
            }
        }
    }

    function togglePlay() {
        if (player) {
            player.playPause();
            isPlaying = !isPlaying;
        }
    }
</script>

<div class="tab-content">
    <div bind:this={containerElement}></div>
</div>

<div class="control-banner">
    <div class="control-container">
        <button class="play-button" onclick={togglePlay}>
            {#if isPlaying}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="icon"
                >
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                </svg>
                <span>Pause</span>
            {:else}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="icon"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clip-rule="evenodd"
                    />
                </svg>
                <span>Play</span>
            {/if}
        </button>

        <!-- Track Selector -->
        <select
            class="track-selector"
            value={selectedTrackIndex}
            onchange={(e) => selectTrack(parseInt(e.currentTarget.value))}
        >
            {#each tracks as track, i (track.index)}
                <option value={i}>
                    {track.name}
                </option>
            {/each}
        </select>

        <span>Tracks: {tracks.length}</span>
    </div>
</div>

<style>
    .control-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e5e5e5;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        z-index: 9999;
    }

    .control-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 12px 16px;
        display: flex;
        gap: 16px;
        align-items: center;
    }

    .play-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 24px;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .play-button:hover {
        background-color: #2563eb;
    }

    .track-selector {
        padding: 8px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background-color: white;
        color: #4b5563;
        font-size: 14px;
        cursor: pointer;
        min-width: 200px;
    }

    .track-selector:focus {
        outline: none;
        border-color: #3b82f6;
        ring: 2px solid rgba(59, 130, 246, 0.5);
    }

    .icon {
        width: 20px;
        height: 20px;
    }

    :global(.at-cursor-beat) {
        background: rgba(64, 64, 255, 0.75);
        width: 3px;
    }
</style>
