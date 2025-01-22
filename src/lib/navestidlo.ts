
export enum TypNavestidla {
    HLAVNE = 'Hlavné návestidlo',
    HLAVNE_IBA_JAZDA = 'Hlavné návestidlo (platné iba pre jazdu vlaku)',
    VLOZENE = 'Vložené návestidlo',
    AUTOBLOK = 'Návestidlo automatického bloku',
    // SPADOVISKO = 'Spádoviskové návestidlo',
    ZRIADOVACIE = 'Zriaďovacie návestidlo',
    PREDZVEST = 'Samostatná predzvesť'
}

export type Options = {
    poleStyleClass: string;
    labelStyleClass?: string;
    bulbCount: number;
    speedIndication: boolean;
    labelExample: string[];
    
    repeating: boolean;
    privolavanie: boolean;
}

export const typeOptions: { [key in TypNavestidla]: Options } = {
    [TypNavestidla.HLAVNE]: {
        poleStyleClass: 'hlavne',
        bulbCount: 4,
        speedIndication: true,
        labelExample: ['1L', 'KL', 'L5', 'S2-6'],
        repeating: true,
        privolavanie: true,
    },
    [TypNavestidla.HLAVNE_IBA_JAZDA]: {
        poleStyleClass: 'hlavne_jazda',
        labelStyleClass: 'hlavne',
        bulbCount: 4,
        speedIndication: true,
        labelExample: ['2S', '1MS', 'S3-7', 'L4'],
        repeating: true,
        privolavanie: true,
    },
    [TypNavestidla.VLOZENE]: {
        poleStyleClass: 'vlozene',
        labelStyleClass: 'hlavne',
        bulbCount: 3,
        speedIndication: false,
        labelExample: ['VL5', 'VS2-6'],
        repeating: false,
        privolavanie: false,
    },
    [TypNavestidla.AUTOBLOK]: {
        poleStyleClass: 'autoblok',
        bulbCount: 3,
        speedIndication: false,
        labelExample: ['1-487', '2-358'],
        repeating: false,
        privolavanie: false,
    },
    [TypNavestidla.ZRIADOVACIE]: {
        poleStyleClass: 'zriadovacie',
        bulbCount: 2,
        speedIndication: false,
        labelExample: ['Se1', 'Se24'],
        repeating: false,
        privolavanie: false,
    },
    [TypNavestidla.PREDZVEST]: {
        poleStyleClass: 'predzvest',
        bulbCount: 2,
        speedIndication: false,
        labelExample: ['Pr1L', 'Pr2KS'],
        repeating: false,
        privolavanie: false,
    }
}

export type Rychlost = 40 | 60 | 80 | 100;

export type ZriadovacieNavesti = 'p_dovoleny' | 'p_zakazany';

export type Predzvest = 'vystraha' | Rychlost;
export type Navest = 'volno' | 'stoj' | Predzvest | ZriadovacieNavesti | 'odchod_dovoluje';

export const povoleneNavesti: { [key in TypNavestidla]: Navest[] } = {
    [TypNavestidla.HLAVNE]: ['volno', 'stoj', 'vystraha', 40, 60, 80, 100, 'p_dovoleny'],
    [TypNavestidla.HLAVNE_IBA_JAZDA]: ['volno', 'stoj', 'vystraha', 40, 60, 80, 100],
    [TypNavestidla.AUTOBLOK]: ['volno', 'stoj', 'vystraha', 40, 60, 80, 100],
    [TypNavestidla.PREDZVEST]: ['volno', 'vystraha', 40, 60, 80, 100],
    [TypNavestidla.VLOZENE]: ['stoj', 'odchod_dovoluje', 'p_dovoleny', 'p_zakazany'],
    [TypNavestidla.ZRIADOVACIE]: ['p_dovoleny', 'p_zakazany']
}

export const nazvyNavesti = {
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

export const navestneZnaky = {
    'volno': [null, 'bg-green-600', null, null],
    'stoj': {
        [TypNavestidla.HLAVNE]: [null, null, 'bg-red-600', null],
        [TypNavestidla.VLOZENE]: ['bg-red-600', null, 'bg-blue-600'],
    },
    'vystraha': ['bg-yellow-400', null, null, null],
    40: ['bg-yellow-400 animate-blink', null, null, null],
    60: ['bg-yellow-400 animate-blink-fast', null, null, null],
    80: [null, 'bg-green-600 animate-blink', null, null],
    100: [null, 'bg-green-600 animate-blink-fast', null, null],
    'p_dovoleny': {
        [TypNavestidla.HLAVNE]: [null, null, null, 'bg-white'],
        [TypNavestidla.VLOZENE]: [null, 'bg-white', null],
        [TypNavestidla.ZRIADOVACIE]: ['bg-white', null],
    },
    'p_zakazany': {
        [TypNavestidla.VLOZENE]: [null, null, 'bg-blue-600'],
        [TypNavestidla.ZRIADOVACIE]: [null, 'bg-blue-600'],
    },
    'odchod_dovoluje': [null, 'bg-white animate-blink', null]
}

export const privolavaciaNavest = [null, null, null, 'bg-white animate-blink'];
export const opakovanieNavesti = [null, null, null, 'bg-white'];