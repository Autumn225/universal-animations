import { spells } from '../animations/spells.js'
import { weapons } from '../animations/weapons.js'
import { debug } from '../lib/debugger.js'
export async function animationHandler(data, state) {
    debug('Animation Handler: type ' + state + ' for ' + data.targets[0]);
    if (data.itemType === 'spell') {
        switch (state) {
            case 'attack': {
                await spells.cast(data)
                break;
            }
            case 'postHit': {
                await spells.attack(data)
                break;
            }
            case 'damage': {
                await spells.damage(data)
                break;
            }
            case 'save': {
                await spells.save(data)
            }
        }
    } else if (data.itemType === 'weapon') {
        switch (state) {
            case 'attack': {
                await weapons.attack(data)
                break;
            }
            case 'postHit': {
                await weapons.postHit(data)
                break;
            }
            case 'damage': {
                await weapons.damage(data)
                break;
            }
            case 'save': {

            }
        }
    }
}