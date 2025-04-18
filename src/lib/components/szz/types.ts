type Direction = 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l' | 'tl';

type Straight = [
    'straight',
    number
];

type Switch = [
    'switch',
    'tr' | 'tl' | 'br' | 'bl',
];

type Blank = [
    'blank',
    number
];

type Other = [Direction, Direction];

type Tile = Straight | Switch | Other | Blank;

export type Station = {
    tiles: Tile[][];
    name: string;
}