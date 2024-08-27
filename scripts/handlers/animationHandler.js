import { constants } from '../lib/constants.js'
import { debug } from '../lib/debugger.js'
import { colorMatrix } from '../animations/colorMatrix.js'
import { defaultPreferences } from '../lib/defaultPreferences.js'

let settingsRegistry = {}

function initializeSettings() {
    debug('Initializing Settings!');
    settingsRegistry = game.settings.get('universal-animations', 'Animations');
}
function isNumber(number) {
    return (typeof number === 'number' || number instanceof Number);
}
function isString(string) {
    return (typeof string === 'string' || string instanceof String);
}
function glow(data) {
    function hasProperties(itemProperties, wantedProperties) {
        if (foundry.utils.isNewerVersion(game.system.version, '2.4.1')) {
            return Array.from(itemProperties).find(k => wantedProperties.includes(k))?.shift();
        } else {
            return Object.entries(data.item.system?.properties).find(([k, v]) => wantedProperties.includes(k) && v === true)?.shift();
        }
    }
    if (data.willGlow && !data.skipGlow) {
        let glowColor = data?.damageFlavors?.[1] ?? data?.otherDamageFlavors?.[0] ?? hasProperties(data.item.system?.properties, ['ada', 'sil']) ?? data.item.system?.rarity ?? 'mgc';
        if (data?.ammo) glowColor = data?.ammo?.damageFlavors?.[1] ?? hasProperties(data?.ammo?.properties, ['ada', 'sil']) ?? data?.ammo?.rarity ?? 'mgc';
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
    return data?.damageFlavors?.length > 1 || data?.ammo?.damageFlavors?.length > 0 || data?.otherDamageFlavors || data?.properties?.mgc === true || data?.properties?.has('mgc') || data?.ammo?.properties?.mgc === true || data?.ammo?.properties?.has('mgc') ? true : false;
}
function hasPostLoop(object) {
    if (!object) return false;
    return Object?.values(object)?.some(obj => 
        obj && typeof obj === 'object' && obj.value === 'postLoop'
    )
}
function buildSequence(data, sequence, e, i) {
    let effect = sequence.effect();
    if (e.fileUsage === 'single' && isString(e.files)) {
        effect.file(e.files);
    } else if (e.fileUsage === 'singleEval' && isString(e.files)) {
        if (e.files?.includes('spellSchool') && data.spellSchool.length === 0) effect.file('jb2a.swirling_sparkles.01.blue');
        else effect.file(eval(e.files));
    } else if (e.fileUsage === 'random') {
        if (isString(e?.files)) e.files = findAnimations(data, e.files)
        let position = Math.floor(Math.random() * e.files.length) ?? 0;
        effect.file(e.files[position]);
    }
    effect.atLocation(eval(e.atLocation[0]), JSON.parse(e.atLocation?.[1] ?? '{}'));
    if (e?.anchor) effect.anchor(JSON.parse(e.anchor));
    if (e?.async === true) effect.async();
    if (e?.belowTokens === true) effect.belowTokens();
    if (e?.delay) effect.delay(e.delay);
    if (e?.duration) effect.duration(eval(e.duration));
    if (e?.endTime) effect.endTime(e.endTime);
    if (e?.endTimePerc) effect.endTimePerc(e.endTimePerc);
    if (e?.fadeIn) effect.fadeIn(eval(e.fadeIn[0]), JSON.parse(e.fadeIn?.[1] ?? '{}'));
    if (e?.fadeOut) effect.fadeOut(eval(e?.fadeOut[0]), JSON.parse(e.fadeOut?.[1] ?? '{}'));
    if (e?.filter) {
        if (e.filter[0] === 'ColorMatrix') effect.filter('ColorMatrix', colorMatrix(e.filter[1], eval(e.filter[2]), JSON.parse(e?.filter[3] ?? '{}')));
        else if (e.filter[0] === 'Glow') effect.filter('Glow', glow(data));
        else if (e.filter[0] === 'Blur') effect.filter('Blur', eval(e.filter[1]));
    }
    if (e?.missed) effect.missed(eval(e.missed));
    if (e?.mirrorX === true) effect.mirrorX();
    if (e?.mirrorY === true) effect.mirrorY();
    if (e?.moveSpeed) effect.moveSpeed(e.moveSpeed);
    if (e?.moveTowards) effect.moveTowards(eval(e?.moveTowards[0]), JSON.parse(e.moveTowards?.[1] ?? '{}'));
    if (e?.opacity || e?.opacity === 0) effect.opacity(e.opacity);
    if (e?.rotateIn) effect.rotateIn(e.rotateIn[0], e.rotateIn[1], JSON.parse(e.rotateIn?.[2] ?? '{}'));
    if (e?.rotateOut) effect.rotateOut(e.rotateOut[0], e.rotateOut[1], JSON.parse(e.rotateOut?.[2] ?? '{}'));
    if (e?.rotateTowards) effect.rotateTowards(eval(e.rotateTowards[0]), JSON.parse(e.rotateTowards?.[1] ?? '{}'));
    if (e?.scaleIn) effect.scaleIn(e.scaleIn[0], e.scaleIn[1], JSON.parse(e.scaleIn?.[2] ?? '{}'));
    if (e?.scaleOut) effect.scaleOut(e.scaleOut[0], e.scaleOut[1], JSON.parse(e.scaleOut?.[2] ?? '{}'));
    if (e?.scaleToObject) effect.scaleToObject(e.scaleToObject);
    if (e?.startTime) effect.startTime(e.startTime);
    if (e?.startTimePerc) effect.startTimePerc(e.startTimePerc);
    if (e?.stretchTo) effect.stretchTo(eval(e.stretchTo[0]), JSON.parse(e.stretchTo?.[1] ?? '{}'));
    if (e?.timeRange) effect.timeRange(e.timeRange[0], e.timeRange[1]);
    if (e?.playbackRate) effect.playbackRate(eval(e.playbackRate));
    if (e?.waitUntilFinished) effect.waitUntilFinished(eval(e.waitUntilFinished = true ? 1 : e.waitUntilFinished));
    if (e?.zIndex) effect.zIndex(e.zIndex);
    return sequence;
}
async function animate(data, state) {
    debug('Animation Handler: type ' + state + ' for ' + data.targets[0]);
    let settingsClone = foundry.utils.deepClone(Object.values(settingsRegistry));
    settingsClone = settingsClone.filter(e => e.call === state && e.itemType === data.itemType && e.actionType?.includes(data.actionType));
    if (settingsClone.length === 0) {
        debug('Animation Handler: No animation found');
        return;
    }
    let evaluatedSettings = new Set(settingsClone);
    for (let s of settingsClone) {
        if (s?.requirements) {
            for (let r of Object.values(s.requirements)) {
                if (r.value != 'postLoop' && eval(r.key) != r.value) evaluatedSettings.delete(s);
            }
        }
    }
    for (let a of evaluatedSettings) {
        debug('Playing animation "' + a.name + '"');
        if (a.targetType === 'multiple') {
            let sequence = [];
            targetLoop: for (let k = 0; k < data.targets.length; k++) {
                let i = data.targets[k]
                if (hasPostLoop(a.requirements)) {
                    for (let r of Object.values(a.requirements)) {
                        if (r.value === 'postLoop' && !eval(r.key)) continue targetLoop;
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
                if (hasPostLoop(a.requirements)) {
                    for (let r of Object.values(a.requirements)) {
                        if (r.value === 'postLoop' && !eval(r.key)) continue targetLoop;
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
                    if (hasPostLoop(a.requirements)) {
                        for (let r of Object.values(a.requirements)) {
                            if (r.value === 'postLoop' && !eval(r.key)) continue targetLoop;
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
                if (hasPostLoop(a.requirements)) {
                    for (let r of Object.values(a.requirements)) {
                        if (r.value === 'postLoop' && !eval(r.key)) continue variableLoop;
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
    'buildSequence': buildSequence,
    'animate': animate
}