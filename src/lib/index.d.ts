import { SvelteComponent } from 'svelte';

export interface TabPlayerProps {
  src?: string;
  autoPlay?: boolean;
}

export default class TabPlayer extends SvelteComponent<TabPlayerProps> {
  play(): void;
  pause(): void;
}