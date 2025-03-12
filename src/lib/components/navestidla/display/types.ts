import type { Snippet } from "svelte";

export type NavestidloDisplayParams = {
    poleStyleClass: string;
    label: boolean;
    renderBlank: boolean;
    renderLabel: Snippet;
    renderTopSigns?: Snippet;
    renderBottomSigns?: Snippet;
    renderLights: Snippet;
    renderBlankLights: Snippet;
    labelHeight: number;
};