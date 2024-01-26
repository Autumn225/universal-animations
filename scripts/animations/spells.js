/*

Deprecated by new settings and animation handler, will be deleted in future update.

import { colorMatrix } from "./colorMatrix.js";
import { constants } from '../lib/constants.js';
import { defaultPreferences } from "../lib/defaultPreferences.js";

async function cast(data) {
    if (constants.spellAttacks.includes(data.actionType)) {
        await new Sequence()
            .effect()
                .file('jb2a.cast_generic.01.yellow.0') //needs to be customizable
                .filter('ColorMatrix', colorMatrix('jb2a.cast_generic.01.yellow.0', data.spellSchool)) //needs to be customizable
                .atLocation(data.token)
                .scaleToObject(1.25)
                .playbackRate(0.75)
                .waitUntilFinished()
            .play();
    } else if (data.isRitual) {
        let animationIntro = 'jb2a.magic_signs.circle.02.' + defaultPreferences.spellSchools[data.spellSchool].name  + '.intro.' + defaultPreferences.spellSchools[data.spellSchool].color;
        let animationOutro = 'jb2a.magic_signs.circle.02.' + defaultPreferences.spellSchools[data.spellSchool].name  + '.outro.' + defaultPreferences.spellSchools[data.spellSchool].color;
        new Sequence()
            .effect()
                .file('jb2a.particles.outward.greenyellow.02.01')
                .filter('ColorMatrix', colorMatrix('jb2a.particles.outward.greenyellow.02.01', data.spellSchool))
                .atLocation(data.token)
                .scaleToObject(3)
                .playbackRate(.8)
                .delay(500)
                .duration(5500)
                .fadeIn(3000)
                .opacity(0.5)
                .fadeOut(2000)
                .scaleIn(0, 2000)
            .effect()
                .file(animationIntro)
                .atLocation(data.token)
                .scaleToObject(2.5)
                .playbackRate(1)
                .belowTokens()
                .waitUntilFinished(-1000)
            .effect()
                .file(animationOutro)
                .atLocation(data.token)
                .playbackRate(1)
                .scaleToObject(2.5)
                .belowTokens()
            .play();
    } else {
        await new Sequence()
            .effect()
                .file('jb2a.cast_generic.02.blue.0')
                .filter('ColorMatrix', colorMatrix('jb2a.cast_generic.02.blue.0', data.spellSchool))
                .atLocation(data.token)
                .scaleToObject(1.25)
                .playbackRate(0.75)
                .waitUntilFinished()
            .play();
    } 
    if (data.actionType === 'save') {
        await save(data);
        return;
    } else if (['other', 'util'].includes(data.actionType) && data?.targets?.length > 0) {
        utility(data);
        return;
    }
    async function save(data) {
        await new Promise (async resolve => {
            setTimeout(resolve, 1250);
            let color = data?.damageFlavors?.[0] ?? data.spellSchool;
            for (let i of data.targets) {
                new Sequence()
                    .effect()
                        .file('jb2a.energy_strands.range.standard.purple.04')
                        .filter('ColorMatrix', colorMatrix('jb2a.energy_strands.range.standard.purple.04', color))
                        .atLocation(data.token)
                        .stretchTo(i, {offset: {x: -0.5}, local: true, gridUnits: true})
                        .playbackRate(1)
                    .effect()
                        .file('jb2a.energy_strands.in.green.01.0')
                        .filter('ColorMatrix', colorMatrix('jb2a.energy_strands.in.green.01.0', color))
                        .atLocation(i)
                        .scaleToObject(1.5)
                        .delay(500)
                        .playbackRate(1)
                        .waitUntilFinished()
                    .play();
            }
        })
    }
    function utility(data) {
        for (let i of data.targets) {
            let animationIntro = 'jb2a.magic_signs.circle.02.' + defaultPreferences.spellSchools[data.spellSchool].name  + '.intro.' + defaultPreferences.spellSchools[data.spellSchool].color;
            let animationOutro = 'jb2a.magic_signs.circle.02.' + defaultPreferences.spellSchools[data.spellSchool].name  + '.outro.' + defaultPreferences.spellSchools[data.spellSchool].color;
            new Sequence()
                .effect()
                    .file(animationIntro)
                    .atLocation(i)
                    .scaleToObject(1.5)
                    .playbackRate(1)
                    .belowTokens()
                    .waitUntilFinished(-1000)
                .effect()
                    .file(animationOutro)
                    .atLocation(i)
                    .playbackRate(1)
                    .scaleToObject(1.5)
                    .belowTokens()
                .play();
        }
        if (data?.conditions?.size > 0) { // For conditions
            for (let condition of data.conditions) {
                for (let i of data.targets) {
                    if (defaultPreferences.conditionAbrevs[condition].fade === true) {
                        new Sequence()
                            .effect()
                                .file(defaultPreferences.conditionAbrevs[condition].file)
                                .atLocation(i)
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
                                .atLocation(i)
                                .scaleToObject(1.5)
                                .playbackRate(1)
                                .delay(500)
                            .play();
                    }
                }
            }
        } else { // Based on disposition
            for (let i of data.targets) {
                if (i.document.disposition === data.token.document.disposition) {
                    new Sequence()
                        .effect()
                            .file('jb2a.markers.bubble.intro.blue')
                            .filter('ColorMatrix', colorMatrix('jb2a.markers.bubble.intro.blue', data.spellSchool))
                            .atLocation(i)
                            .scaleToObject(1)
                            .playbackRate(0.8)
                            .waitUntilFinished(-1000)
                        .effect()
                            .file('jb2a.markers.bubble.outro.blue')
                            .filter('ColorMatrix', colorMatrix('jb2a.markers.bubble.outro.blue', data.spellSchool))
                            .atLocation(i)
                            .playbackRate(0.8)
                            .scaleToObject(1)
                        .play();
                } else {
                    new Sequence()
                        .effect()
                            .file('jb2a.markers.runes03.dark_orange.01')
                            .filter('ColorMatrix', colorMatrix('jb2a.markers.runes03.dark_orange.01', data.spellSchool))
                            .atLocation(i)
                            .scaleToObject(1.5)
                            .playbackRate(.8)
                            .delay(500)
                            .duration(5500)
                            .fadeIn(3000)
                            .fadeOut(2000)
                        .play();
                }
            }
        }
    }
}
async function attack(data) {
    if (data.actionType === 'heal' || data.actionType === 'save') return;
    if (data.distance <= 5) {
        await melee(data);
        return;
    } else if (constants.spellAttacks.includes(data.actionType)) {
        await ranged(data);
        return;
    }
    return;
    async function melee(data) {
        await new Promise (async resolve => {
            setTimeout(resolve, 750);
            for (let i of data.targets) {
                new Sequence()
                    .effect()
                        .file('jb2a.cast_generic.fire.side01.orange.0')
                        .filter('ColorMatrix', colorMatrix('jb2a.cast_generic.fire.side01.orange.0', data.spellSchool))
                        .atLocation(i, {local: true, gridUnits: true})
                        .anchor({x:0.15})
                        .scaleToObject(2)
                        .rotateTowards(data.token)
                        .playbackRate(1)
                    .play();
            }
        })
    }
    async function ranged(data) {
        await new Promise (async resolve => {
            setTimeout(resolve, 250);
            for (let i of data.targets) {
                new Sequence()
                    .effect()
                        .file('jb2a.template_line_piercing.generic.01.orange.15ft')
                        .filter('ColorMatrix', colorMatrix('jb2a.template_line_piercing.generic.01.orange.15ft', data.damageFlavors[0]))
                        .atLocation(data.token)
                        .stretchTo(i, {offset: {x: -0.5}, local: true, gridUnits: true})
                        .playbackRate(0.75)
                        .waitUntilFinished(-400)
                        .missed(!(data.hitTargetsIds.includes(i.id)))
                    .play();
            }
        })
    }
}
async function damage(data) {
    if (data.actionType === 'save') return;
    if (data.actionType === 'heal') {
        heal(data);
        return;
    } else if (constants.spellAttacks.includes(data.actionType)) {
        ranged(data);
    }
    return;
    async function ranged(data) {
        for (let i of data.targets) {
            if ((data.hitTargetsIds.includes(i.id))) {
                new Promise(async resolve => {
                await new Sequence()
                    .effect()
                        .file('jb2a.impact.010.orange')
                        .filter('ColorMatrix', colorMatrix('jb2a.impact.010.orange', data.damageFlavors[0]))
                        .atLocation(i)
                        .scaleToObject(2)
                        .playbackRate(0.5)
                        .waitUntilFinished(-500)
                    .play();
                if (data.isCritical) {
                    await new Sequence()
                        .effect()
                            .file('jb2a.impact.006.yellow')
                            .filter('ColorMatrix', colorMatrix('jb2a.impact.006.yellow', data.damageFlavors[0]))
                            .atLocation(i)
                            .scaleToObject(3.5)
                            .playbackRate(0.65)
                        .play();
                }
                resolve();
            })
            }
        }
    }
    async function heal(data) {
        for (let i of data.targets) {
            new Promise(async resolve => {
                await new Sequence()
                    .effect()
                        .file('jb2a.energy_strands.in.green.01.2')
                        .filter('ColorMatrix', colorMatrix('jb2a.energy_strands.in.green.01.0', data.spellSchool))
                        .atLocation(i)
                        .scaleToObject(2)
                        .playbackRate(1)
                        .waitUntilFinished(-300)
                    .effect()
                        .file('jb2a.healing_generic.burst.greenorange')
                        .filter('ColorMatrix', colorMatrix('jb2a.energy_strands.in.green.01.0', data.spellSchool))
                        .atLocation(i)
                        .scaleToObject(2.5)
                        .playbackRate(1)
                        .waitUntilFinished(-2000)
                    .effect()
                        .file('jb2a.energy_field.02.above.blue')
                        .filter('ColorMatrix', colorMatrix('jb2a.energy_field.02.above.blue', data.spellSchool))
                        .duration(2300)
                        .startTime(1200)
                        .atLocation(i)
                        .scaleToObject(1)
                        .playbackRate(2.5)
                    .play();
                resolve();
            })
        }
    }
}
async function save(data) {
    if (data.outcome === false) {
        let animationIntro = 'jb2a.magic_signs.rune.' + defaultPreferences.spellSchools[data.spellSchool].name  + '.intro.' + defaultPreferences.spellSchools[data.spellSchool].color;
        let animationOutro = 'jb2a.magic_signs.rune.' + defaultPreferences.spellSchools[data.spellSchool].name  + '.outro.' + defaultPreferences.spellSchools[data.spellSchool].color;
        new Sequence()
            .effect()
                .file(animationIntro)
                .atLocation(data.targets[0])
                .scaleToObject(1)
                .delay(200)
                .playbackRate(0.75)
            .effect()
                .file(animationOutro)
                .atLocation(data.targets[0])
                .delay(1500)
                .playbackRate(0.75)
                .scaleToObject(1)
            .play();
    } else {
        new Sequence()
            .effect()
                .file('jb2a.energy_field.02.above.blue')
                .filter('ColorMatrix', colorMatrix('jb2a.energy_field.02.above.blue', data.spellSchool))
                .duration(3000)
                .startTime(1200)
                .atLocation(data.targets[0])
                .scaleToObject(1)
                .playbackRate(2)
            .play();
    }
}
export let spells = {
    'cast': cast,
    'attack': attack,
    'damage': damage,
    'save': save
} */