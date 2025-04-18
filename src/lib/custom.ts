import { colors, blinking } from "./consts/styles";
import type { Navest } from "./types/navestidlo";
import { povolenaPrivolavacia, povoleneOpakovanie } from "./consts/navestidlo";

export enum CustomLightColor {
    BLUE = "blue",
    RED = "red",
    GREEN = "green",
    YELLOW = "yellow",
    WHITE = "white"
}

export const customColorClasses = {
    [CustomLightColor.BLUE]: colors.blue,
    [CustomLightColor.RED]: colors.red,
    [CustomLightColor.GREEN]: colors.green,
    [CustomLightColor.YELLOW]: colors.yellow,
    [CustomLightColor.WHITE]: colors.white
};

export const maxLightCounts = {
    [CustomLightColor.RED]: 1,
    [CustomLightColor.GREEN]: 1,
    [CustomLightColor.YELLOW]: 1,
    [CustomLightColor.WHITE]: 1,
    [CustomLightColor.BLUE]: 1
};

export enum Mode {
    BUILD = "build",
    MANUAL = "manual",
    SIGNAL = "signal"
}

export const modeNames = {
    [Mode.BUILD]: "Zostavovanie",
    [Mode.MANUAL]: "Manuálne nastavenie",
    [Mode.SIGNAL]: "Podľa návesti"
};

export type LightMode = true | false | keyof typeof blinking;

export function generatePattern(lights: CustomLightColor[], signal: Navest): LightMode[] | false {
    const out: LightMode[] = lights.map(() => false);

    if(signal === 'stoj') {
        const redIndex = lights.indexOf(CustomLightColor.RED);
        if(redIndex === -1) return false;
        out[redIndex] = true;
    }

    if(signal === 'p_zakazany') {
        const blueIndex = lights.indexOf(CustomLightColor.BLUE);
        if(blueIndex === -1) return false;
        out[blueIndex] = true;
    }

    if(signal === 'p_dovoleny' || signal === 'odchod_dovoluje') {
        const whiteIndex = lights.indexOf(CustomLightColor.WHITE);
        if(whiteIndex === -1) return false;
        out[whiteIndex] = true;
    }

    if(['volno', 80, 100].includes(signal)) {
        const greeinIndex = lights.indexOf(CustomLightColor.GREEN);
        if(greeinIndex === -1) return false;
        out[greeinIndex] = true;
    } else if(['vystraha', 40, 60].includes(signal)) {
        const yellowIndex = lights.indexOf(CustomLightColor.YELLOW);
        if(yellowIndex === -1) return false;
        out[yellowIndex] = true;
    }

    // Types match, but TS doesn't realize it
    if([40, 80, 'odchod_dovoluje'].includes(signal as never)) out[out.indexOf(true)] = blinking.slow as never;
    if([60, 100].includes(signal as never)) out[out.indexOf(true)] = blinking.fast as never;

    return out;
}

export function availableSignals(lights: CustomLightColor[]): Navest[] {
    let available: Navest[] = [];
    if(lights.includes(CustomLightColor.RED)) available.push('stoj');
    if(lights.includes(CustomLightColor.GREEN)) available = available.concat(['volno', 80, 100]);
    if(lights.includes(CustomLightColor.YELLOW)) available = available.concat(['vystraha', 40, 60]);
    if(lights.includes(CustomLightColor.WHITE)) available.push('p_dovoleny', 'odchod_dovoluje');
    if(lights.includes(CustomLightColor.BLUE)) available.push('p_zakazany');
    return available;
}

export function canRepeat(lights: CustomLightColor[], signal: Navest|null): boolean {
    return lights.includes(CustomLightColor.WHITE) && povoleneOpakovanie.includes(signal);
}

export function canPrivolavacia(lights: CustomLightColor[], signal: Navest|null): boolean {
    return lights.includes(CustomLightColor.WHITE) && povolenaPrivolavacia.includes(signal);
}