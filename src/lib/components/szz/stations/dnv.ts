import type { Station } from "../types";

export const DNV: Station = {
    name: 'Devínska Nová Ves',
    tiles: [
        [
            ['straight', 6],
            ['switch', 'bl'],
            ['straight', 2],
            ['switch', 'bl'],
            ['straight', 3],
            ['switch', 'tr'],
        ],
        [
            ['straight', 3],
            ['switch', 'bl'],
            ['switch', 'br'],
            ['switch', 'tr'],
            ['straight', 2],
            ['switch', 'tr'],
            ['straight', 4],
        ],
        [
            ['straight', 2],
            ['switch', 'tr'],
            ['straight', 2],
            ['switch', 'tl'],
            ['straight', 2],
            ['switch', 'br'],
            ['straight', 4],
        ],
        [
            ['blank', 9],
            ['tl', 'r'],
            ['straight', 3],
        ],
    ]
};