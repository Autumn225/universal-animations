import { colorMatrix } from "./colorMatrix.js";
import { constants } from '../lib/constants.js';
import { defaultPreferences } from "../lib/defaultPreferences.js";

async function attack(data) {
    let animations = defaultPreferences?.baseWeapons[data.baseItem]?.animations;
    if (animations) {
        let range;
        if (Object?.keys(animations).includes('ranged')) {
            range = data.distance > 5 ? 'ranged' : 'melee';
            animations = animations[range];
        }
        let position = Math.floor(Math.random() * animations.length) ?? 0;
        if (range === 'ranged') {
            new Sequence()
            .effect()
                .file(animations[position])
                .zIndex(10)
                .atLocation(data.token)
                .stretchTo(data.targets[0])
            .play();
        } else {
            new Sequence()
                .effect()
                    .file(animations[position])
                    .zIndex(10)
                    .atLocation(data.token)
                    .scaleToObject(3.5)
                    .rotateTowards(data.targets[0], {offset: {x: -1.5}, gridUnits: true, local: true})
                .play();
        }
    } else if (data.distance <= 5) {
        new Sequence()
            .effect()
                .file('jb2a.unarmed_strike.physical.01.blue')
                .zIndex(10)
                .delay(300)
                .atLocation(data.token)
                .scaleToObject(3.5)
                .rotateTowards(data.targets[0], {offset: {x: -1.5}, gridUnits: true, local: true})
            .play();
    }
}
async function postHit(data) {
    for (let i of data.targets) {
        if (data.hitTargetsIds.includes(i.id)) {
            if (data.damageFlavors.includes('slashing')) {
                new Sequence()
                    .effect()
                        .file('jb2a.melee_attack.04.trail.01.orangered.1')
                        .zIndex(1)
                        .delay(650)
                        .atLocation(data.token, {offset: {x: -0.25}, gridUnits: true, local: true})
                        .scaleToObject(2)
                        .rotateTowards(i)
                        .playbackRate(0.65)
                    .play()
            } else if (data.damageFlavors.includes('piercing')) {
                let matrix = colorMatrix('jb2a.impact.008.orange', 'piercing');
                matrix.brightness = .7;
                new Sequence()
                    .effect()
                        .file('jb2a.impact.008.orange')
                        .zIndex(1)
                        .filter('ColorMatrix', matrix)
                        .delay(970)
                        .atLocation(i, {offset: {x: -0.5}, gridUnits: true, local: true})
                        .scaleToObject(1)
                        .rotateTowards(data.token)
                        .playbackRate(0.55)
                    .play()
            } else if (data.damageFlavors.includes('bludgeoning')) {
                new Sequence()
                    .effect()
                        .file('jb2a.smoke.puff.ring.01.white.1')
                        .zIndex(1)
                        .delay(800)
                        .atLocation(i)
                        .scaleToObject(1.5)
                        .playbackRate(1)
                    .play()
            }
        } else {
            new Sequence()
                .effect()
                    .file('jb2a.smoke.puff.side.grey.4')
                    .zIndex(1)
                    .filter('ColorMatrix', {'brightness': 2, 'saturate': 1} )
                    .delay(950)
                    .atLocation(i)
                    .scaleToObject(1)
                    .rotateTowards(data.token, {offset: {x: 0.5}, gridUnits: true, local: true, rotationOffset: 180})
                    .playbackRate(1)
                .play()
        }
    }
}
async function damage(data) {
    for (let i of data.targets) {
        if (data.isCritical) {
            let matrix = colorMatrix('jb2a.liquid.splash.blue', 'piercing');
            matrix.brightness = .75;
            new Sequence()
                .effect()
                    .file('jb2a.liquid.splash.blue')
                    .zIndex(1)
                    .filter('ColorMatrix', matrix)
                    .delay(970)
                    .atLocation(i)
                    .scaleToObject(1.5)
                    .belowTokens()
                    .playbackRate(1)
                .play()
        }
        if (data.hitTargetsIds.includes(i.id)) {
            let matrix = colorMatrix('jb2a.liquid.splash.blue', 'piercing');
            matrix.brightness = .6;
            new Sequence()
                .effect()
                    .file('jb2a.liquid.splash_side.blue')
                    .zIndex(1)
                    .filter('ColorMatrix', matrix)
                    .delay(1100)
                    .atLocation(i)
                    .scaleToObject(1.35)
                    .rotateTowards(data.token, {offset: {x: 0.25}, gridUnits: true, local: true, rotationOffset: 180})
                    .playbackRate(1)
                .play()
        } 
    }
    
}
export let weapons = {
    'attack': attack,
    'postHit': postHit,
    'damage': damage
}