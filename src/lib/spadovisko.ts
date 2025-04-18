import { colors, blinking } from "./consts/styles";
const { red: RED, white: WHITE, blue: BLUE } = colors;
const BLINK = WHITE + ' ' + blinking.slow;

export enum RezimSpadoviska {
    ZAKAZANE = "Tlačiť zakázané",
    POMALY = "Tlačiť pomaly",
    RYCHLEJSIE = "Tlačiť rýchlejšie",
    SPAT = "Späť",
    PRISUN = "Prísun súpravy vozidiel k spádovisku"
}

export type TypSpadNavestidla = 'kmenove' | 'opakovacie' | 'hlavne' | 'zriadovacie';

export const spadNavestneZnaky: { [key in TypSpadNavestidla]: { [key in RezimSpadoviska]: (string|null)[] } } = {
    kmenove: {
        [RezimSpadoviska.ZAKAZANE]:   [null,  RED,  null],
        [RezimSpadoviska.POMALY]:     [WHITE, null, WHITE],
        [RezimSpadoviska.RYCHLEJSIE]: [WHITE, null, null],
        [RezimSpadoviska.SPAT]:       [null,  RED,  null],
        [RezimSpadoviska.PRISUN]:     [null,  RED,  null],
    },
    opakovacie: {
        [RezimSpadoviska.ZAKAZANE]:   [null, BLUE, null],
        [RezimSpadoviska.POMALY]:     [WHITE, null, WHITE],
        [RezimSpadoviska.RYCHLEJSIE]: [WHITE, null, null],
        [RezimSpadoviska.SPAT]:       [null, BLUE,  null],
        [RezimSpadoviska.PRISUN]:     [BLINK, null, BLINK]
    },
    hlavne: {
        [RezimSpadoviska.ZAKAZANE]:   [null,  RED,  null],
        [RezimSpadoviska.POMALY]:     [WHITE, null, WHITE],
        [RezimSpadoviska.RYCHLEJSIE]: [WHITE, null, null],
        [RezimSpadoviska.SPAT]:       [null,  RED,  null],
        [RezimSpadoviska.PRISUN]:     [BLINK, null, BLINK]
    },
    zriadovacie: {
        [RezimSpadoviska.ZAKAZANE]:   [null, BLUE, null],
        [RezimSpadoviska.POMALY]:     [WHITE, null, WHITE],
        [RezimSpadoviska.RYCHLEJSIE]: [WHITE, null, null],
        [RezimSpadoviska.SPAT]:       [null, BLUE,  null],
        [RezimSpadoviska.PRISUN]:     [BLINK, null, BLINK]
    },
};