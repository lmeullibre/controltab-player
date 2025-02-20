<script lang="ts">
    let { src = null, autoPlay = false } = $props<{
        src?: string | null;
        autoPlay?: boolean;
    }>();

    let player: AlphaTabApi | null = null;
    let containerElement: HTMLElement;

    $effect(() => {
        if (typeof window !== "undefined" && window.alphaTab) {
            const { AlphaTabApi } = window.alphaTab;

            try {
                const settings: AlphaTabSettings = {
                    notation: {
                        elements: new Map([["guitarTuning", false]]),
                    },
                };
                player = new AlphaTabApi(containerElement, settings);

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
                }
            }
        } catch (error) {
            console.error("Error loading tab:", error);
        }
    }

    function togglePlay() {
        if (player) {
            player.playPause();
        }
    }

    function play() {
        if (player) player.play();
    }

    function pause() {
        if (player) player.pause();
    }
</script>

<div bind:this={containerElement}></div>

<button on:click={togglePlay}>Toggle Play/Pause</button>
