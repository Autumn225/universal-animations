import { spells } from '../animations/spells.js'
import { weapons } from '../animations/weapons.js'
import { debug } from '../lib/debugger.js'
import { settings } from '../lib/settings.js'
import { colorMatrix } from '../animations/colorMatrix.js'

let settingsRegistry = {}

function initializeSettings() {
    debug('Initializing Settings!');
    // will eventually import properly
    settingsRegistry = settings.defaultSettings;
}
function buildSequence(data, sequence, e, i) {
    i = data.targets[0].document;
    let effect = sequence.effect();
    if (e.fileUsage === 'single' && isString(e.files)) {
        effect.file(e.files);
    } else if (e.fileUsage === 'random') {
        let position = Math.floor(Math.random() * e.files.length) ?? 0;
        effect.file(e.files[position]);
    }
    effect.atLocation(eval(e.atLocation));
    if (e?.belowTokens === 'true') effect.belowTokens();
    if (e?.delay && e?.delay != 0 && e?.delay != '') effect.delay(eval(e?.delay));
    if (e?.duration && e?.duration != 0 && e?.duration != '') effect.duration(eval(e?.duration));
    if (e?.fadeIn && e?.fadeIn != 0 && e?.fadeIn != '') effect.fadeIn(eval(e?.fadeIn));
    if (e?.fadeOut && e?.fadeOut != 0 && e?.fadeOut != '') effect.fadeOut(eval(e?.fadeOut));
    if (e?.filter && e?.filter != '' && e?.filter != []) {
        if (e.filter[0] === 'ColorMatrix') effect.filter('ColorMatrix', colorMatrix(eval(e.filter[1])));
        else if (e.filter[0] === 'Glow') effect.filter('Glow', eval(e.filter[1]));
        else if (e.filter[0] === 'Blur') effect.filter('Blur', eval(e.filter[1]));
    }
    if (e?.missed && e?.missed != '') effect.missed(eval(e.missed));
    if (e?.opacity !== '' && isNumber(Number(e?.opacity)) && e?.opacity !== undefined) effect.opacity(eval(e?.opacity));
    if (e?.scaleIn && e?.scaleIn != 0 && e?.scaleIn != '') effect.scaleIn(eval(e?.scaleIn));
    if (e?.scaleOut && e?.scaleOut != 0 && e?.scaleOut != '') effect.scaleOut(eval(e?.scaleOut));
    if (e?.scaleToObject && e?.scaleToObject != 0 && e?.scaleToObject != '') effect.scaleToObject(eval(e?.scaleToObject));
    if (e?.startTime && e?.startTime != 0 && e?.startTime != '') effect.startTime(eval(e?.startTime));
    console.log(e?.stretchTo);
    //console.log(eval(e?.stretchTo?.[0]), eval(e?.stretchTo?.[1]));
    if (e?.stretchTo && e?.stretchTo != 0 && e?.stretchTo != '') effect.stretchTo(eval(e?.stretchTo[0]), eval(e?.stretchTo[1]));
    if (e?.playbackRate && e?.playbackRate != 0 && e?.playbackRate != '') effect.playbackRate(eval(e?.playbackRate));
    if (e?.waitUntilFinished === true || Number(e?.waitUntilFinished) > 0) effect.waitUntilFinished(e?.waitUntilFinished === true ? 0 : e?.waitUntilFinished);
    return sequence;
}
function isNumber(number) {
    return (typeof number === 'number' || number instanceof Number);
}
function isString(string) {
    return (typeof string === 'string' || string instanceof String);
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
                if (value != 'postLoop') {
                    if (eval(key) != value) evaluatedSettings.delete(s);
                }
            }
        }
    }
    console.log(Array.from(evaluatedSettings));
    for (let a of evaluatedSettings) {
        debug('Playing animation "' + a.name + '"');
        let sequence = new Sequence();
        if (a.targetType === 'single') {
            for (let effect of a.effects) {
                sequence = buildSequence(data, sequence, effect);
            }
        } else if (a.targetType === 'multiple') {
            for (let i of data.targets) {
                for (let effect of a.effects) {
                    console.log(i, effect);
                    sequence = buildSequence(data, sequence, effect, i);
                }
            }
        }
        console.log(sequence);
        await sequence.play();
        //need to account for evauluations w/in loop
        //need to account for custom loops
        //single, multiplePreLoop, multiplePostLoop, multiple
    }
    /*if (data.itemType === 'spell') {
        switch (state) {
            case 'attack': {
                await spells.cast(data);
                break;
            }
            case 'postHit': {
                await spells.attack(data);
                break;
            }
            case 'damage': {
                await spells.damage(data);
                break;
            }
            case 'save': {
                await spells.save(data);
            }
        }
    } else if (data.itemType === 'weapon') {
        switch (state) {
            case 'attack': {
                await weapons.attack(data);
                break;
            }
            case 'postHit': {
                await weapons.postHit(data);
                break;
            }
            case 'damage': {
                await weapons.damage(data);
                break;
            }
            case 'save': {
                await weapons.save(data);
            }
        }
    }*/
}
export let animationHandler = {
    'initalizeSettings': initializeSettings,
    'animate': animate
}
/*
- grab settings on load, will have function called when settings menu is closed
- look for settings that meet requirements

*/