import { animationHandler } from "./animationHandler.js";
import { debug } from "../lib/debugger.js";

let cache = {itemUuid: '', targetsIds: []}

export let uaHandler = {
    'initialize': initialize,
    'initializeCache': initializeCache,
    'close': close,
    'closeByActor': closeByActor,
    'clean': clean,
}
async function initialize(data, stage) {
    let clonedData = foundry.utils.deepClone(data)
    if (await animationCheck(clonedData.item)) return;
    await getDistance(clonedData);
    await animationHandler(clonedData, stage);
    debug('Initialized Animation during stage: ' + stage, clonedData);
}
async function initializeCache(data, hookName, callback) {
    if (await animationCheck(data.item)) return;
    if (cache.hookData) close()
    debug('Initializing cache for ' + data.item.name + ' at ' + hookName);
    cache.targetsIds = data.targets.map(token => token.id);
    let itemUuid = data.item.uuid;
    cache.itemUuid = itemUuid;
    let hookId = Hooks.on(hookName, callback);
    cache.hookData = {hookId: hookId, hookName: hookName, itemUuid: itemUuid};
    await new Promise(async (resolve) => {
        setTimeout(resolve, 20000); //this delay with be customizable
    });
    debug('Timed out for item "' + itemUuid + '"')
    close(hookName, hookId, itemUuid);
}
async function close(hookName, hookId, itemUuid) {
    if (!hookName) hookName = cache.hookData.hookName
    if (!hookId) hookId = cache.hookData.hookId
    if (!itemUuid) itemUuid = cache.hookData.itemUuid
    debug('Closing Cache');
    if (cache.itemUuid === itemUuid) {
        clean();
        Hooks.off(hookName, hookId);
    }
}
async function closeByActor(actor) {
    let tokenId = actor.token?.id;
    if (!tokenId) return null;
    if (cache.targetsIds.includes(tokenId)) {
        debug('Clearing Cache');
        let index = cache.targetsIds.indexOf(tokenId);
        cache.targetsIds.splice(index, 1)
        let itemUuid = cache.itemUuid
        if (cache.targetsIds?.length === 0) {
            close();
            clean();
        }
        return itemUuid;
    } else return null;
}
async function clean() {
    cache = {itemUuid: '', targetsIds: []};
}
async function animationCheck(item) {
    if (item.flags?.autoanimations?.isEnabled || item.flags['chris-Premades']?.info?.hasAnimation) return true;
    if (game.modules.get('autoanimations')?.active && item.flags?.autoanimations?.isEnabled != false) {
        let name = item.name;
        let autorecSettings = [
            game.settings.get('autoanimations', 'aaAutorec-melee'),
            game.settings.get('autoanimations', 'aaAutorec-range'),
            game.settings.get('autoanimations', 'aaAutorec-ontoken'),
            game.settings.get('autoanimations', 'aaAutorec-templatefx'),
            game.settings.get('autoanimations', 'aaAutorec-aura'),
            game.settings.get('autoanimations', 'aaAutorec-preset'),
            game.settings.get('autoanimations', 'aaAutorec-aefx')
        ]
        return autorecSettings.some(setting => setting.some(autoRec => name.toLowerCase().includes(autoRec.label.toLowerCase())));
    } else if (item.flags?.itemacro?.macro?.command?.includes('new Sequence()')) {
        return true;
    } else return false;
}
async function getDistance(data) {
    // This code was written by TPosney for Midi-QOL. It is adapated here for UA
    const t1 = data.token;
    const target = data.targets[0];
    const noResult = { distance: -1, acBonus: undefined };
    if (!canvas || !canvas.scene)
        return noResult;
    if (!canvas.grid || !canvas.dimensions)
        noResult;
    if (!t1 || !target)
        return noResult;
    if (!canvas || !canvas.grid || !canvas.dimensions)
        return noResult;
    const t1StartX = t1.document.width >= 1 ? 0.5 : t1.document.width / 2;
    const t1StartY = t1.document.height >= 1 ? 0.5 : t1.document.height / 2;
    const t2StartX = target.document.width >= 1 ? 0.5 : target.document.width / 2;
    const t2StartY = target.document.height >= 1 ? 0.5 : target.document.height / 2;
    var x, x1, y, y1, d, r, segments = [], rdistance, distance;
    for (x = t1StartX; x < t1.document.width; x++) {
        for (y = t1StartY; y < t1.document.height; y++) {
            const origin = new PIXI.Point(...canvas.grid.getCenter(Math.round(t1.document.x + (canvas.dimensions.size * x)), Math.round(t1.document.y + (canvas.dimensions.size * y))));
            for (x1 = t2StartX; x1 < target.document.width; x1++) {
                for (y1 = t2StartY; y1 < target.document.height; y1++) {
                    const dest = new PIXI.Point(...canvas.grid.getCenter(Math.round(target.document.x + (canvas.dimensions.size * x1)), Math.round(target.document.y + (canvas.dimensions.size * y1))));
                    const r = new Ray(origin, dest);
                    segments.push({ ray: r });
                }
            }
        }
    }
    if (segments.length === 0) {
        return noResult;
    }
    rdistance = segments.map(ray => canvas.grid.measureDistances([ray], { gridSpaces: true })[0]);
    distance = rdistance[0];
    rdistance.forEach(d => {
        if (d < distance)
            distance = d;
    });
    data.distance = distance;
}