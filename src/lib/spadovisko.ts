
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
        [RezimSpadoviska.ZAKAZANE]: [null, 'bg-red-500', null, null],
        [RezimSpadoviska.POMALY]: ['bg-white', null, null, 'bg-white'],
        [RezimSpadoviska.RYCHLEJSIE]: ['bg-white', null, null, null],
        [RezimSpadoviska.SPAT]: [null, 'bg-red-500', null, null, 'text-white'],
        [RezimSpadoviska.PRISUN]: [null, 'bg-red-500', null, null]
    },
    opakovacie: {
        [RezimSpadoviska.ZAKAZANE]: [null, null, 'bg-blue-500', null],
        [RezimSpadoviska.POMALY]: ['bg-white', null, null, 'bg-white'],
        [RezimSpadoviska.RYCHLEJSIE]: ['bg-white', null, null, null],
        [RezimSpadoviska.SPAT]: [null, null, 'bg-blue-500', null, 'text-white'],
        [RezimSpadoviska.PRISUN]: ['bg-white animate-blink', null, null, 'bg-white animate-blink']
    },
    hlavne: {
        [RezimSpadoviska.ZAKAZANE]: [null, 'bg-red-500', null, null],
        [RezimSpadoviska.POMALY]: ['bg-white', null, null, 'bg-white'],
        [RezimSpadoviska.RYCHLEJSIE]: ['bg-white', null, null, null],
        [RezimSpadoviska.SPAT]: [null, 'bg-red-500', null, null, 'text-white z-10'],
        [RezimSpadoviska.PRISUN]: ['bg-white animate-blink', null, null, 'bg-white animate-blink']
    },
    zriadovacie: {
        [RezimSpadoviska.ZAKAZANE]: [null, null, 'bg-blue-500', null],
        [RezimSpadoviska.POMALY]: ['bg-white', null, null, 'bg-white'],
        [RezimSpadoviska.RYCHLEJSIE]: ['bg-white', null, null, null],
        [RezimSpadoviska.SPAT]: [null, null, 'bg-blue-500', null, 'text-white z-10'],
        [RezimSpadoviska.PRISUN]: ['bg-white animate-blink', null, null, 'bg-white animate-blink']
    },
};
