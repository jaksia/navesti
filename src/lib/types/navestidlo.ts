import { TypNavestidla } from '$lib/consts/navestidlo';

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

export type NavestnyZnak = (string | null)[];

export type TypeOptions = {
    speedIndication: boolean;
    labelExample: string[];

    allowedAdditional: Additional[];
    allowedSignals: Navest[];

    repeating: boolean;
    privolavanie: boolean;
}

export type AllowedSignals = {
    [TypNavestidla.HLAVNE]: HlavnaNavest | PosunDovoleny;
    [TypNavestidla.HLAVNE_IBA_JAZDA]: HlavnaNavest;
    [TypNavestidla.VLOZENE]: VlozenaNavest;
    [TypNavestidla.AUTOBLOK]: AutoblokNavest | Rychlost;
    [TypNavestidla.ZRIADOVACIE]: ZriadovaciaNavest;
    [TypNavestidla.PREDZVEST]: Volno | Predzvest;
}