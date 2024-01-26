/*

Deprecated by new settings and animation handler, will be deleted in future update.

import { colorMatrix } from "./colorMatrix.js";
import { constants } from '../lib/constants.js';
import { defaultPreferences } from "../lib/defaultPreferences.js";

async function attack(data) {
    let animations = defaultPreferences?.baseWeapons?.[data.baseItem];
    if (data?.ammo?.ammoType && constants.jb2aCheck === 'patreon') {
        if (data.ammo.damageFlavors) {
            animations = defaultPreferences[data.ammo.ammoType][data.ammo.damageFlavors[0]] ?? animations;
            animations.skipGlow = true;
        } else if (data.ammo.rarity) {
            animations = defaultPreferences[data.ammo.ammoType][data.ammo.rarity] ?? animations;
            animations.skipGlow = true;
        } else defaultAttack(data, animations);
    } else if (animations) {
        defaultAttack(data, animations);
    } else if (data.baseItem === 'net') {
        await new Sequence()
            .effect()
                .file('jb2a.web.01')
                .filter('ColorMatrix', colorMatrix('jb2a.web.01', 'net'))
                .zIndex(10)
                .atLocation(data.token)
                .rotateIn(800, 2000)
                .moveTowards(data.targets[0])
                .moveSpeed(400)
                .scaleToObject(1)
                .waitUntilFinished()
            .play();
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
    function defaultAttack(data, animations) {
        let jb2a = constants.jb2aCheck;
        if (jb2a === 'patreon') animations = animations['patreon'] ?? animations;
        let range;
        if (Object?.keys(animations).includes('ranged')) {
            range = data.distance > 5 ? 'ranged' : 'melee';
            animations = animations[range];
        }
        let position = Math.floor(Math.random() * animations.length) ?? 0;
        let glowDataMelee = {
            'distance': 1,
            'outerStrength': 0
        };
        let glowDataRanged = {
            'distance': 1,
            'outerStrength': 0
        };
        if (data.willGlow && !data.skipGlow) {
            let glowColor = data?.damageFlavors?.[1] ?? data?.otherDamageFlavors?.[0] ?? Object.entries(data.item.system?.properties).find(([k, v]) => ['ada', 'sil'].includes(k) && v === true)?.shift() ?? data.item.system?.rarity ?? 'mgc';
            if (data?.ammo) glowColor = data?.ammo?.damageFlavors?.[1] ?? Object.entries(data?.ammo?.properties).find(([k, v]) => ['ada', 'sil'].includes(k) && v === true)?.shift() ?? data?.ammo?.rarity ?? 'mgc';
            glowDataMelee = {
                'distance': 25,
                'outerStrength': 10,
                'innerStrength': 1,
                'color': defaultPreferences.glows[glowColor] ?? '0xffffff'
            }
            glowDataRanged = {
                'distance': 15,
                'outerStrength': 5,
                'innerStrength': 1,
                'color': defaultPreferences.glows[glowColor] ?? '0xffffff'
            }
        }
        if (data.distance > 5) {
            new Sequence()
            .effect()
                .file(animations[position])
                .filter('Glow', glowDataRanged)
                .zIndex(10)
                .atLocation(data.token)
                .stretchTo(data.targets[0])
            .play();
        } else {
            new Sequence()
                .effect()
                    .file(animations[position])
                    .filter('Glow', glowDataMelee)
                    .zIndex(10)
                    .atLocation(data.token)
                    .scaleToObject(3.5)
                    .rotateTowards(data.targets[0], {offset: {x: -1.5}, gridUnits: true, local: true})
                .play();
        }
    }
}
async function postHit(data) {
    for (let i of data.targets) {
        if (data.hitTargetsIds.includes(i.id)) {
            if (data.baseItem === 'net') { 
                new Sequence()
                    .effect()
                        .file('jb2a.web.01')
                        .filter('ColorMatrix', colorMatrix('jb2a.web.01', 'net'))
                        .zIndex(10)
                        .atLocation(i)
                        .scaleToObject(1)
                        .playbackRate(.5)
                        .fadeOut(6500, {ease: 'easeInOutBack'})
                    .play();
            } else if (data?.damageFlavors.includes('slashing')) {
                new Sequence()
                    .effect()
                        .file('jb2a.melee_attack.04.trail.01.orangered.1')
                        .zIndex(2)
                        .delay(650)
                        .atLocation(data.token, {offset: {x: -0.25}, gridUnits: true, local: true})
                        .scaleToObject(2)
                        .rotateTowards(i)
                        .playbackRate(0.65)
                    .play();
            } else if (data?.damageFlavors.includes('piercing')) {
                let matrix = colorMatrix('jb2a.impact.008.orange', 'piercing');
                matrix.brightness = .7;
                new Sequence()
                    .effect()
                        .file('jb2a.impact.008.orange')
                        .zIndex(2)
                        .filter('ColorMatrix', matrix)
                        .delay(970)
                        .atLocation(i, {offset: {x: -0.5}, gridUnits: true, local: true})
                        .scaleToObject(1.3)
                        .rotateTowards(data.token)
                        .playbackRate(0.50)
                    .play();
            } else if (data?.damageFlavors.includes('bludgeoning')) {
                new Sequence()
                    .effect()
                        .file('jb2a.smoke.puff.ring.01.white.1')
                        .zIndex(2)
                        .delay(800)
                        .atLocation(i)
                        .scaleToObject(1.5)
                        .playbackRate(1)
                    .play();
            }
            if (needsColor(data) || data?.conditions?.size > 0) {
                let color = getColor(data);
                let file = Sequencer.Database.getEntry('jb2a.eldritch_blast.purple').file['05ft'];
                await new Sequence()
                    .effect()
                        .file(file)
                        .filter('ColorMatrix', colorMatrix('jb2a.eldritch_blast.purple', color))
                        .zIndex(1)
                        .endTimePerc(0.23)
                        .fadeOut(800)
                        .delay(1000)
                        .atLocation(i)
                        .scaleToObject(1.5)
                    .play();
            }
        } else if (data.baseItem === 'net') {
            new Sequence()
                    .effect()
                        .file('jb2a.smoke.puff.ring.01.white.1')
                        .zIndex(1)
                        .atLocation(i)
                        .scaleToObject(1.5)
                        .playbackRate(1)
                    .play();
        } else {
            new Sequence()
                .effect()
                    .file('jb2a.smoke.puff.side.grey.4')
                    .filter('ColorMatrix', {'brightness': 2, 'saturate': 1})
                    .zIndex(1)
                    .delay(950)
                    .atLocation(i)
                    .scaleToObject(1)
                    .rotateTowards(data.token, {offset: {x: 0.5}, gridUnits: true, local: true, rotationOffset: 180})
                    .playbackRate(1)
                .play();
            if (needsColor(data)) {
                let color = getColor(data);
                new Sequence()
                    .effect()
                        .file('jb2a.swirling_leaves.outburst.01.pink')
                        .filter('ColorMatrix', colorMatrix('jb2a.swirling_leaves.outburst.01.pink', color))
                        .zIndex(1)
                        .delay(1100)
                        .atLocation(i)
                        .scaleToObject(1)
                        .playbackRate(1.25)
                    .play();
            }
        }
    }
}
async function damage(data) {
    if (data.baseItem === 'net') return;
    for (let i of data.targets) {
        if (data.isCritical) {
            let matrix = colorMatrix('jb2a.liquid.splash.blue', 'piercing');
            matrix.brightness = .75;
            new Sequence()
                .effect()
                    .file('jb2a.liquid.splash.blue')
                    .filter('ColorMatrix', matrix)
                    .zIndex(2)
                    .delay(970)
                    .atLocation(i)
                    .scaleToObject(1.5)
                    .belowTokens()
                    .playbackRate(1)
                .play();
            if (needsColor(data)) {
                let color = getColor(data);
                new Sequence()
                    .effect()
                        .file('jb2a.particle_burst.01.circle.bluepurple')
                        .filter('ColorMatrix', colorMatrix('jb2a.particle_burst.01.circle.bluepurple', color))
                        .zIndex(1)
                        .delay(970)
                        .timeRange(850, 1800)
                        .fadeOut(500)
                        .delay(1000)
                        .atLocation(i)
                        .scaleToObject(1.75)
                        .mirrorX()
                        .playbackRate(.75)
                    .play();
            }
        }
        if (data.hitTargetsIds.includes(i.id)) {
            let matrix = colorMatrix('jb2a.liquid.splash.blue', 'piercing');
            matrix.brightness = .6;
            new Sequence()
                .effect()
                    .file('jb2a.liquid.splash_side.blue')
                    .zIndex(2)
                    .filter('ColorMatrix', matrix)
                    .delay(1100)
                    .atLocation(i)
                    .scaleToObject(1.35)
                    .rotateTowards(data.token, {offset: {x: 0.25}, gridUnits: true, local: true, rotationOffset: 180})
                    .playbackRate(1)
                .play();
            if (needsColor(data) && data.otherDamageHalfDamage != false) {
                let color = getColor(data);
                await new Sequence()
                        .effect()
                            .file('jb2a.particle_burst.01.circle.bluepurple')
                            .filter('ColorMatrix', colorMatrix('jb2a.particle_burst.01.circle.bluepurple', color))
                            .zIndex(1)
                            .timeRange(850, 1800)
                            .fadeOut(500)
                            .delay(800)
                            .atLocation(i)
                            .scaleToObject(1.25)
                            .playbackRate(0.75)
                        .play();
            }
        } 
    }
}
async function save(data) {
    let target = data.targets[0];
    if (data.outcome === false) {
        if (data.conditions.size > 0) { // For conditions
            for (let condition of data.conditions) {
                if (defaultPreferences.conditionAbrevs[condition].fade === true) {
                    new Sequence()
                        .effect()
                            .file(defaultPreferences.conditionAbrevs[condition].file)
                            .atLocation(target)
                            .scaleToObject(1.5)
                            .playbackRate(.8)
                            .delay(500)
                            .duration(5500)
                            .fadeIn(3000)
                            .fadeOut(2000)
                        .play();
                } else {
                    new Sequence()
                    .effect()
                            .file(defaultPreferences.conditionAbrevs[condition].file)
                            .atLocation(target)
                            .scaleToObject(1.5)
                            .playbackRate(1)
                            .delay(500)
                        .play();
                }
            }
        }
        if (data.otherDamageFlavors && !data.otherDamageHalfDamage) {
            let color = getColor(data);
                await new Sequence()
                    .effect()
                        .file('jb2a.particle_burst.01.circle.bluepurple')
                        .filter('ColorMatrix', colorMatrix('jb2a.particle_burst.01.circle.bluepurple', color))
                        .zIndex(1)
                        .timeRange(850, 1800)
                        .fadeOut(500)
                        .delay(800)
                        .atLocation(target)
                        .scaleToObject(1.25)
                        .playbackRate(0.75)
                    .play();
        }
    } else {
        let color = getColor(data);
        new Sequence()
            .effect()
                .file('jb2a.energy_field.02.above.blue')
                .filter('ColorMatrix', colorMatrix('jb2a.energy_field.02.above.blue', color))
                .delay(1000)
                .duration(3000)
                .startTime(1200)
                .atLocation(target)
                .scaleToObject(1)
                .playbackRate(2)
            .play();
    }
}
function getColor(data) {
    return data?.ammo?.damageFlavors?.[1] ?? data?.damageFlavors?.[1] ?? data?.otherDamageFlavors?.[0] ?? data?.conditions?.first() ?? 'mgc';
}
function needsColor(data) {
    return data?.damageFlavors?.length > 1 || data?.ammo?.damageFlavors?.length > 0 || data?.otherDamageFlavors || data?.properties?.mgc === true || data?.ammo?.properties?.mgc === true;
}
export let weapons = {
    'attack': attack,
    'postHit': postHit,
    'damage': damage,
    'save': save
}*/