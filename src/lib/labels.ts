
export type LabelType = 'vchod' | 'odchod' | 'cestove' | 'oddiel' | 'krycie' | 'autoblok' | 'zriadovacie' | 'vlozene' | 'predzvest';
export type LabelOptions = {
    nextType: Exclude<LabelType, 'cestove'|'vlozene'|'predzvest'>;
    group: boolean;
    repeating: boolean;
}


export function generateLabel(type: LabelType, options: Partial<LabelOptions> = {}): string {
    if('predzvest' == type && !options.nextType) {
        throw new Error(`Missing next type for ${type} label`);
    }
    if(type === 'cestove' || type === 'vlozene') options.nextType = 'odchod';
    if(!['cestove', 'vlozene', 'predzvest'].includes(type)) delete options.nextType;
    if(!['cetove', 'odchod'].includes(type)) options.group = false;

    let label = 'ERROR';

    if(options.nextType) {
        label = generateLabel(options.nextType, {group: options.group, repeating: options.repeating});
        switch(type) {
            case 'predzvest':
                label = `${options.repeating ? 'OPr' : 'Pr'}${label}`;
                break;
            case 'vlozene':
                label = `V${label}`;
                break;
            case 'cestove':
                label = `${label[0]}c${label.slice(1)}`;
                break;
        }
    } else {
        if(type === 'autoblok') {
            const track = Math.round(Math.random()) + 1;
            const number = Math.floor(Math.random() * 3000) + 200;
            label = `${track}-${number}`;
        } else if(type === 'zriadovacie') {
            const number = Math.floor(Math.random() * 50) + 1;
            label = `Se${number}`;  
        } else {
            const direction = Math.random() > 0.5 ? 'L' : 'S',
                number = Math.floor(Math.random() * 10) + (options.group ? 1 : 0);
            let processedNumber = `${number}`;
            if(number === 0) processedNumber = '';
            if(options.group) processedNumber = `${number}-${number + Math.ceil(Math.random() * 2)*2}`;
            switch(type) {
                case 'vchod':
                    label = `${processedNumber}${direction}`;
                    break;
                case 'odchod':
                    label = `${direction}${processedNumber}`;
                    break;
                case 'oddiel':
                    label = `${direction}o${Math.round(Math.random()) + 1}`;
                    break;
                case 'krycie':
                    label = `${direction}k${processedNumber}`;
                    break;
            }
        }
    }

    return label;
}