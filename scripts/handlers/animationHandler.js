import { constants } from '../lib/constants.js'
import { debug } from '../lib/debugger.js'
import { settings } from '../lib/settings.js'
import { colorMatrix } from '../animations/colorMatrix.js'
import { defaultPreferences } from '../lib/defaultPreferences.js'

let settingsRegistry = {}

function initializeSettings() {
    debug('Initializing Settings!');
    // will eventually import properly
    settingsRegistry = settings.defaultSettings;
}
function isNumber(number) {
    return (typeof number === 'number' || number instanceof Number);
}
function isString(string) {
    return (typeof string === 'string' || string instanceof String);
}
function glow(data) {
    if (data.willGlow && !data.skipGlow) {
        let glowColor = data?.damageFlavors?.[1] ?? data?.otherDamageFlavors?.[0] ?? Object.entries(data.item.system?.properties).find(([k, v]) => ['ada', 'sil'].includes(k) && v === true)?.shift() ?? data.item.system?.rarity ?? 'mgc';
        if (data?.ammo) glowColor = data?.ammo?.damageFlavors?.[1] ?? Object.entries(data?.ammo?.properties).find(([k, v]) => ['ada', 'sil'].includes(k) && v === true)?.shift() ?? data?.ammo?.rarity ?? 'mgc';
        let range = data.distance > 5
        return {
            'distance': range ? 15 : 25,
            'outerStrength': range ? 5 : 10,
            'innerStrength': 1,
            'color': defaultPreferences.glows[glowColor] ?? '0xffffff'
        }
    } else {
        return {
            'distance': 1,
            'outerStrength': 0
        }
    }
}
function findAnimations(data, files) {
    let animations;
    if (files === 'baseWeapons') animations = defaultPreferences?.baseWeapons?.[data.baseItem].animations
    let jb2a = constants.jb2aCheck;
    if (jb2a === 'patreon') animations = animations['patreon'] ?? animations;
    if (Object?.keys(animations).includes('ranged')) {
        let range = data.distance > 5 ? 'ranged' : 'melee';
        animations = animations[range];
    }
    return animations;
}
function getColor(data) {
    return data?.ammo?.damageFlavors?.[1] ?? data?.damageFlavors?.[1] ?? data?.otherDamageFlavors?.[0] ?? data?.conditions?.first() ?? 'mgc';
}
function needsColor(data) {
    return data?.damageFlavors?.length > 1 || data?.ammo?.damageFlavors?.length > 0 || data?.otherDamageFlavors || data?.properties?.mgc === true || data?.ammo?.properties?.mgc === true ? true : false;
}
function buildSequence(data, sequence, e, i) {
    let effect = sequence.effect();
    if (e.fileUsage === 'single' && isString(e.files)) {
        effect.file(e.files);
    } else if (e.fileUsage === 'singleEval' && isString(e.files)) {
        effect.file(eval(e.files));
    } else if (e.fileUsage === 'random') {
        if (isString(e?.files)) e.files = findAnimations(data, e.files)
        let position = Math.floor(Math.random() * e.files.length) ?? 0;
        effect.file(e.files[position]);
    }
    isString(e?.atLocation) ? effect.atLocation(eval(e?.atLocation)) : effect.atLocation(eval(e?.atLocation[0]), e?.atLocation[1])
    if (e?.anchor && e?.anchor != '' && e?.anchor != {}) effect.anchor(e?.anchor);
    if (e?.async === true) effect.async();
    if (e?.belowTokens === true) effect.belowTokens();
    if (e?.delay && e?.delay != 0 && e?.delay != '') effect.delay(eval(e?.delay));
    if (e?.duration && e?.duration != 0 && e?.duration != '') effect.duration(eval(e?.duration));
    if (e?.endTime && e?.endTime != 0 && e?.endTime != '') effect.endTime(eval(e?.endTime));
    if (e?.endTimePerc && e?.endTimePerc != 0 && e?.endTimePerc != '') effect.endTimePerc(eval(e?.endTimePerc));
    if (e?.fadeIn && e?.fadeIn != 0 && e?.fadeIn != '') isNumber(e?.fadeIn) ? effect.fadeIn(eval(e?.fadeIn)) : effect.fadeIn(eval(e.fadeIn[0]), e.fadeIn[1]);
    if (e?.fadeOut && e?.fadeOut != 0 && e?.fadeOut != '') isNumber(e?.fadeOut) ? effect.fadeOut(eval(e?.fadeOut)) : effect.fadeOut(eval(e.fadeOut[0]), e.fadeOut[1]);
    if (e?.filter && e?.filter != '' && e?.filter != []) {
        if (e.filter[0] === 'ColorMatrix') effect.filter('ColorMatrix', colorMatrix(e.filter[1], eval(e.filter[2]), e?.filter[3] ?? undefined));
        else if (e.filter[0] === 'Glow') effect.filter('Glow', glow(data));
        else if (e.filter[0] === 'Blur') effect.filter('Blur', eval(e.filter[1]));
    }
    if (e?.missed && e?.missed != '') effect.missed(eval(e.missed));
    if (e?.mirrorX === true) effect.mirrorX();
    if (e?.mirrorY === true) effect.mirrorY();
    if (e?.moveSpeed && e?.moveSpeed != '' && isNumber(Number(e?.opacity))) effect.moveSpeed(eval(e?.moveSpeed));
    if (e?.moveTowards && e?.moveTowards != '') isString(e?.moveTowards) ? effect.moveTowards(eval(e?.moveTowards)) : effect.moveTowards(eval(e.moveTowards[0]), e.moveTowards[1]);
    if (e?.opacity !== '' && isNumber(Number(e?.opacity)) && e?.opacity !== undefined) effect.opacity(eval(e?.opacity));
    if (e?.rotateIn && e?.rotateIn != '') e?.rotateIn.length === 2 ? effect.rotateIn(e?.rotateIn[0], e?.rotateIn[1]) : effect.rotateIn(e?.rotateIn[0], e?.rotateIn[1]. e?.rotateIn[2]);
    if (e?.rotateTowards && e?.rotateTowards != '') isString(e?.rotateTowards) ? effect.rotateTowards(eval(e?.rotateTowards)) : effect.rotateTowards(eval(e.rotateTowards[0]), e.rotateTowards[1]);
    if (e?.scaleIn && e?.scaleIn != 0 && e?.scaleIn != '') effect.scaleIn(eval(e?.scaleIn));
    if (e?.scaleOut && e?.scaleOut != 0 && e?.scaleOut != '') effect.scaleOut(eval(e?.scaleOut));
    if (e?.scaleToObject && e?.scaleToObject != 0 && e?.scaleToObject != '') effect.scaleToObject(eval(e?.scaleToObject));
    if (e?.startTime && e?.startTime != 0 && e?.startTime != '') effect.startTime(eval(e?.startTime));
    if (e?.startTimePerc && e?.startTimePerc != 0 && e?.startTimePerc != '') effect.startTimePerc(eval(e?.startTimePerc));
    if (e?.stretchTo && e?.stretchTo != 0 && e?.stretchTo != '') isString(e?.stretchTo) ? effect.stretchTo(eval(e?.stretchTo)) : effect.stretchTo(eval(e?.stretchTo[0]), e?.stretchTo[1]);
    if (e?.timeRange && e?.timeRange != 0 && e?.timeRange != '') effect.timeRange(e.timeRange[0], e.timeRange[1]);
    if (e?.playbackRate && e?.playbackRate != 0 && e?.playbackRate != '') effect.playbackRate(eval(e?.playbackRate));
    if (e?.waitUntilFinished === true || Number(e?.waitUntilFinished) > 0) effect.waitUntilFinished(e?.waitUntilFinished === true ? 0 : e?.waitUntilFinished);
    if (e?.zIndex && e?.zIndex != '') effect.zIndex(eval(e?.zIndex));
    return sequence;
}
async function animate(data, state) {
    debug('Animation Handler: type ' + state + ' for ' + data.targets[0]);
    let settingsClone = foundry.utils.deepClone(settingsRegistry);
    settingsClone = settingsClone.filter(e => e.call === state && e.itemType === data.itemType && e.actionType?.includes(data.actionType));
    if (settingsClone.length === 0) {
        debug('Animation Handler: No animation found');
        return;
    }
    let evaluatedSettings = new Set(settingsClone);
    for (let s of settingsClone) {
        if (s?.requirements) {
            for (let [key, value] of Object.entries(s.requirements)) {
                if (value != 'postLoop' && eval(key) != value) evaluatedSettings.delete(s);
            }
        }
    }
    for (let a of evaluatedSettings) {
        debug('Playing animation "' + a.name + '"');
        if (a.targetType === 'multiple') {
            let sequence = [];
            targetLoop: for (let k = 0; k < data.targets.length; k++) {
                let i = data.targets[k]
                if (Object.values(a.requirements).includes('postLoop')) {
                    for (let [key, value] of Object.entries(a.requirements)) {
                        if (value === 'postLoop' && !eval(key)) continue targetLoop;
                    }
                }
                sequence[k] = new Sequence();
                for (let effect of a.effects) {
                    sequence[k] = buildSequence(data, sequence[k], effect, data.targets[k]);
                }
                if (a.async === true) {
                    await sequence[k].play();
                } else {
                    sequence[k].play();
                }
            }
        } else if (a.targetType === 'multipleLoopPromise') {
            let sequence = [];
            targetLoop: for (let k = 0; k < data.targets.length; k++) {
                let i = data.targets[k]
                if (a.requirements && Object.values(a.requirements).includes('postLoop')) {
                    for (let [key, value] of Object.entries(a.requirements)) {
                        if (value === 'postLoop' && !eval(key)) continue targetLoop;
                    }
                }
                sequence[k] = new Sequence();
                for (let effect of a.effects) {
                    sequence[k] = buildSequence(data, sequence[k], effect, i);
                }
                await new Promise(async resolve => {
                    isNumber(a.timeout) ? setTimeout(resolve, a.timeout) : undefined;
                    if (a.async === true) {
                        await sequence[k].play();
                    } else {
                        sequence[k].play();
                    }
                    a.timeout === 'resolve' ? resolve() : undefined;
                })
            }
        } else if (a.targetType === 'multiplePromiseLoop') {
            await new Promise(async resolve => {
                isNumber(a.timeout) ? setTimeout(resolve, a.timeout) : undefined;
                let sequence = [];
                targetLoop: for (let k = 0; k < data.targets.length; k++) {
                    let i = data.targets[k];
                    if (a.requirements && Object.values(a.requirements)?.includes('postLoop')) {
                        for (let [key, value] of Object.entries(a.requirements)) {
                            if (value === 'postLoop' && !eval(key)) continue targetLoop;
                        }
                    }
                    sequence[k] = new Sequence();
                    for (let effect of a.effects) {
                        sequence[k] = buildSequence(data, sequence[k], effect, i);
                    }
                    if (a.async === true) {
                        await sequence[k].play();
                    } else {
                        sequence[k].play();
                    }
                }
                a.timeout === 'resolve' ? resolve() : undefined;
            })
        } else if (a.targetType === 'loopOf') {
            let sequence = [];
            variableLoop: for (let k = 0; k < eval(a.loopOf)?.size; k++) {
                let l = Array.from(eval(a.loopOf))[k];
                if (a.requirements && Object.values(a.requirements)?.includes('postLoop')) {
                    for (let [key, value] of Object.entries(a.requirements)) {
                        if (value === 'postLoop' && !eval(key)) continue variableLoop;
                    }
                }
                sequence[k] = new Sequence();
                for (let effect of a.effects) {
                    sequence[k] = buildSequence(data, sequence[k], effect, l);
                }
                if (a.async === true) {
                    await sequence[k].play();
                } else {
                    sequence[k].play();
                }
            }
        } else if (a.targetType === 'single') {
            let sequence = new Sequence();
            for (let effect of a.effects) {
                sequence = buildSequence(data, sequence, effect);
            }
            if (a.async === true) {
                await sequence.play();
            } else {
                sequence.play();
            }
        }
    }
}
export let animationHandler = {
    'initalizeSettings': initializeSettings,
    'animate': animate
}