import { spells } from "../animations/spells.js"
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
    }
}