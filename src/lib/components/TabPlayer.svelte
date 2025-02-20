<script lang="ts">
    let { src = null, autoPlay = false } = $props<{
        src?: string | null;
        autoPlay?: boolean;
    }>();

    let player: AlphaTabApi | null = null;
    let containerElement: HTMLElement;
    let isPlaying = false;

    $effect(() => {
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
                        scrollElement: containerElement,
                    },
                };
                player = new AlphaTabApi(containerElement, settings);

                // Add player state change listener
                player.playerStateChanged.on((e) => {
                    isPlaying =
                        e.state === window.alphaTab.synth.PlayerState.Playing;
                });

                // Add player ready listener
                player.playerReady.on(() => {
                    console.log("Player is ready!");
                });

                if (src) {
                    loadTab(src);
                }
            } catch (error) {
                console.error("Error initializing AlphaTab:", error);
            }

            return () => {
                if (player) {
                    player.destroy();
                }
            };
        } else {
            console.error(
                "AlphaTab is not loaded. Please include the AlphaTab script and CSS in your HTML.",
            );
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

    function togglePlay() {
        if (player) {
            player.playPause();
            isPlaying = !isPlaying;
        }
    }

    function play() {
        if (player) {
            player.play();
            isPlaying = true;
        }
    }

    function pause() {
        if (player) {
            player.pause();
            isPlaying = false;
        }
    }
</script>

<div class="tab-content">
    <div bind:this={containerElement}></div>
</div>

<div class="control-banner">
    <div class="control-container">
        <button class="play-button" on:click={togglePlay}>
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
    </div>
</div>

<style>
    .tab-content {
        padding-bottom: 80px;
        position: relative; /* Add this */
        z-index: 1; /* Add this */
    }

    .control-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e5e5e5;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        z-index: 9999; /* Add this high z-index */
    }

    .control-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 12px 16px;
        display: flex;
        justify-content: center;
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

    .icon {
        width: 20px;
        height: 20px;
    }
</style>
