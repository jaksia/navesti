import {colors, blinking} from './consts';
const {green: GREEN, yellow: YELLOW, red: RED, blue: BLUE, white: WHITE} = colors;
const BLINK = ` ${blinking.slow}`, BLINK_FAST = ` ${blinking.fast}`;


export enum TypNavestidla {
    HLAVNE = 'Hlavné návestidlo',
    HLAVNE_IBA_JAZDA = 'Hlavné návestidlo (platné iba pre jazdu vlaku)',
    VLOZENE = 'Vložené návestidlo',
    AUTOBLOK = 'Návestidlo automatického bloku',
    // SPADOVISKO = 'Spádoviskové návestidlo', // handled separately
    ZRIADOVACIE = 'Zriaďovacie návestidlo',
    PREDZVEST = 'Samostatná predzvesť'
}

export type Additional = 'skupinove' | 'skratena_vzd';

export type Rychlost = 40 | 60 | 80 | 100;

export type PosunDovoleny = 'p_dovoleny';
export type PosunZakazany = 'p_zakazany';

export type Stoj = 'stoj';
export type Volno = 'volno';
export type Vystraha = 'vystraha';

export type OdchodoveNavestidloDovolujeJazdu = 'odchod_dovoluje';

export type Predzvest = Vystraha | Rychlost;
export type HlavnaNavest = Volno | Stoj | Predzvest;

export type VlozenaNavest = Stoj | OdchodoveNavestidloDovolujeJazdu | PosunDovoleny | PosunZakazany;
export type AutoblokNavest = Volno | Stoj | Vystraha;
export type ZriadovaciaNavest = PosunDovoleny | PosunZakazany;

export type Navest = HlavnaNavest | ZriadovaciaNavest | OdchodoveNavestidloDovolujeJazdu;

type NavestnyZnak = (string | null)[];

export type AllowedSignals = {
    [TypNavestidla.HLAVNE]: HlavnaNavest | PosunDovoleny;
    [TypNavestidla.HLAVNE_IBA_JAZDA]: HlavnaNavest;
    [TypNavestidla.VLOZENE]: VlozenaNavest;
    [TypNavestidla.AUTOBLOK]: AutoblokNavest | Rychlost;
    [TypNavestidla.ZRIADOVACIE]: ZriadovaciaNavest;
    [TypNavestidla.PREDZVEST]: Volno | Predzvest;
}

type TypeOptions = {
    speedIndication: boolean;
    labelExample: string[];

    allowedAdditional: Additional[];
    allowedSignals: Navest[];

    repeating: boolean;
    privolavanie: boolean;
}

export const typeOptions: { [key in TypNavestidla]: TypeOptions } = {
    [TypNavestidla.HLAVNE]: {
        speedIndication: true,
        labelExample: ['1L', 'KL', 'L5', 'S2-6'],
        allowedAdditional: ['skupinove', 'skratena_vzd'],
        allowedSignals: ['volno', 'stoj', 'vystraha', 40, 60, 80, 100, 'p_dovoleny'],
        repeating: true,
        privolavanie: true,
    },
    [TypNavestidla.HLAVNE_IBA_JAZDA]: {
        speedIndication: true,
        labelExample: ['2S', '1MS', 'S3-7', 'L4'],
        allowedAdditional: ['skupinove', 'skratena_vzd'],
        allowedSignals: ['volno', 'stoj', 'vystraha', 40, 60, 80, 100],
        repeating: true,
        privolavanie: true,
    },
    [TypNavestidla.VLOZENE]: {
        speedIndication: false,
        labelExample: ['VL5', 'VS2-6'],
        allowedAdditional: [],
        allowedSignals: ['stoj', 'odchod_dovoluje', 'p_dovoleny', 'p_zakazany'],
        repeating: false,
        privolavanie: false,
    },
    [TypNavestidla.AUTOBLOK]: {
        speedIndication: false,
        labelExample: ['1-487', '2-358'],
        allowedAdditional: [],
        allowedSignals: ['volno', 'stoj', 'vystraha', 40, 60, 80, 100],
        repeating: false,
        privolavanie: false,
    },
    [TypNavestidla.ZRIADOVACIE]: {
        speedIndication: false,
        labelExample: ['Se1', 'Se24'],
        allowedAdditional: [],
        allowedSignals: ['p_dovoleny', 'p_zakazany'],
        repeating: false,
        privolavanie: false,
    },
    [TypNavestidla.PREDZVEST]: {
        speedIndication: false,
        labelExample: ['Pr1L', 'Pr2KS'],
        allowedAdditional: ['skratena_vzd'],
        allowedSignals: ['volno', 'vystraha', 40, 60, 80, 100],
        repeating: true,
        privolavanie: false,
    }
}

export const additionalNames: { [key in Additional]: string } = {
    'skupinove': 'Skupinové odchodové návestidlo',
    'skratena_vzd': 'Skrátená vzdialenosť'
}

export const nazvyNavesti: { [key in Navest]: string } = {
    'volno': 'Voľno',
    'stoj': 'Stoj',
    'vystraha': 'Výstraha',
    40: 'Očakávaj 40 km/h',
    60: 'Očakávaj 60 km/h',
    80: 'Očakávaj 80 km/h',
    100: 'Očakávaj 100 km/h',
    'p_dovoleny': 'Posun dovolený',
    'p_zakazany': 'Posun zakázaný',
    'odchod_dovoluje': 'Odchodové návestidlo dovoľuje jazdu'
}

export const navestneZnaky: { [key in Navest]: (NavestnyZnak|Partial<{ [key in TypNavestidla]: NavestnyZnak }>) } = {
    'volno': [null, GREEN, null, null],
    'stoj': {
        [TypNavestidla.HLAVNE]: [null, null, RED, null],
        [TypNavestidla.VLOZENE]: [RED, null, BLUE],
    },
    'vystraha': [YELLOW, null, null, null],
    40: [YELLOW + BLINK, null, null, null],
    60: [YELLOW + BLINK_FAST, null, null, null],
    80: [null, GREEN + BLINK, null, null],
    100: [null, GREEN + BLINK_FAST, null, null],
    'p_dovoleny': {
        [TypNavestidla.HLAVNE]: [null, null, null, WHITE],
        [TypNavestidla.VLOZENE]: [null, WHITE, null],
        [TypNavestidla.ZRIADOVACIE]: [WHITE, null],
    },
    'p_zakazany': {
        [TypNavestidla.VLOZENE]: [null, null, BLUE],
        [TypNavestidla.ZRIADOVACIE]: [null, BLUE],
    },
    'odchod_dovoluje': [null, WHITE + BLINK, null]
}

export const vsetkyNavesti: Navest[] = ['volno', 'stoj', 'vystraha', 40, 60, 80, 100, 'p_dovoleny', 'p_zakazany', 'odchod_dovoluje'];

export const privolavaciaNavest = [null, null, null, WHITE + BLINK];
export const opakovanieNavesti = [null, null, null, WHITE];

export const povolenaPrivolavacia: (Navest|null)[] = [null, 'stoj'];
export const povoleneOpakovanie: (Volno|Navest|null)[] = ['volno', 'vystraha', 40, 60, 80, 100];

export function getNavestneZnaky(navest: Navest|null, typ: TypNavestidla): NavestnyZnak {
    if (navest === null) return [null, null, null, null];
    const znaky = navestneZnaky[navest];
    if (Array.isArray(znaky)) return znaky;
    return znaky[typ] ?? znaky[TypNavestidla.HLAVNE] ?? [null, null, null, null];
}

export function isSpeed(navest: Navest): navest is Rychlost {
    return typeof navest === 'number';
}

export function isPredzvest(navest: Navest): navest is Volno | Predzvest {
    return ['volno', 'vystraha', 40, 60, 80, 100].includes(navest);
}