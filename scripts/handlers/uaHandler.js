/* eslint-disable no-async-promise-executor */
import { animationHandler } from './animationHandler.js';
import { debug } from '../lib/debugger.js';
import { helpers } from '../lib/lib.js';

let cache = {itemUuid: '', targetsIds: []};

let autorecSettings = [];

export let uaHandler = {
    startup: startup,
    initialize: initialize,
    initializeCache: initializeCache,
    close: close,
    closeByActor: closeByActor,
    clean: clean,
};
function startup() {
    if (game.modules.get('autoanimations')?.active) {
        debug('UA Startup - Copying AA Settings');
        autorecSettings = [
            game.settings.get('autoanimations', 'aaAutorec-melee'),
            game.settings.get('autoanimations', 'aaAutorec-range'),
            game.settings.get('autoanimations', 'aaAutorec-ontoken'),
            game.settings.get('autoanimations', 'aaAutorec-templatefx'),
            game.settings.get('autoanimations', 'aaAutorec-aura'),
            game.settings.get('autoanimations', 'aaAutorec-preset'),
            game.settings.get('autoanimations', 'aaAutorec-aefx')
        ];
    }
}
async function initialize(data, stage) {
    let clonedData = foundry.utils.deepClone(data);
    if (await animationCheck(clonedData.item)) return;
    getDistance(clonedData);
    await animationHandler.animate(clonedData, stage);
    debug('Initialized Animation during stage: ' + stage, clonedData);
}
async function initializeCache(data, hookName, callback) {
    if (await animationCheck(data.item)) return;
    if (cache.hookData) close();
    debug('Initializing cache for ' + data.item.name + ' at ' + hookName);
    cache.targetsIds = data.targets.map(token => token.id);
    let itemUuid = data.item.uuid;
    cache.itemUuid = itemUuid;
    let hookId = Hooks.on(hookName, callback);
    cache.hookData = {hookId: hookId, hookName: hookName, itemUuid: itemUuid};
    await new Promise(async (resolve) => {
        setTimeout(resolve, 20000); //this delay should be customizable
    });
    debug('Timed out for item "' + itemUuid + '"');
    close(hookName, hookId, itemUuid);
}
async function close(hookName, hookId, itemUuid) {
    if (!hookName) hookName = cache.hookData.hookName;
    if (!hookId) hookId = cache.hookData.hookId;
    if (!itemUuid) itemUuid = cache.hookData.itemUuid;
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
        cache.targetsIds.splice(index, 1);
        let itemUuid = cache.itemUuid;
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
    if (item.flags?.universalAnimations?.override === 'alwaysPlay') return false;
    if (item.flags?.universalAnimations?.override === 'neverPlay') return true;
    if (item.flags?.autoanimations?.isEnabled || item.flags['chris-premades']?.info?.hasAnimation) return true;
    if (game.modules.get('autoanimations')?.active && item.flags?.autoanimations?.isEnabled != false) {
        try {
            let name = item.name;
            return autorecSettings.some(setting => setting.some(autoRec => name.toLowerCase().includes(autoRec.label.toLowerCase())));
        } catch (error) {
            console.log('Univeral Animations | ERROR | ' + helpers.localize('UNIVERSALANIMATIONS.Handler.AAError.Console'), error);
            helpers.notification('error', 'UNIVERSALANIMATIONS.Handler.AAError.Notification');
        }
    } else return false;
}
function getDistance(data) {
    // This code was written by TPosney for Midi-QOL. It is adapated here for UA
    const t1 = data.token;
    const t2 = data.targets[0];
    if (!canvas || !canvas.scene) {
        debug('No scene active');
        return -1;
    }
    if (!canvas.grid || !canvas.dimensions) {
        debug('Scene dimensions or grid not defined');
        return -1;
    }
    if (!t1 || !t2) {
        debug('Token or target not defined');
        return -1;
    }
    let t1DocWidth = t1.document.width ?? 1;
    if (t1DocWidth > 10) t1DocWidth = t1DocWidth / canvas.dimensions.size;
    let t1DocHeight = t1.document.height ?? 1;
    if (t1DocHeight > 10) t1DocHeight = t1DocHeight / canvas.dimensions.size;
    let t2DocWidth = t2.document.width ?? 1;
    if (t2DocWidth > 10) t2DocWidth = t2DocWidth / canvas.dimensions.size;
    let t2DocHeight = t2.document.height ?? 1;
    if (t2DocHeight > 10) t2DocHeight = t2DocHeight / canvas.dimensions.size;
    const t1StartX = t1DocWidth >= 1 ? 0.5 : t1DocWidth / 2;
    const t1StartY = t1DocHeight >= 1 ? 0.5 : t1DocHeight / 2;
    const t2StartX = t2DocWidth >= 1 ? 0.5 : t2DocWidth / 2;
    const t2StartY = t2DocHeight >= 1 ? 0.5 : t2DocHeight / 2;
    var x, x1, y, y1, d, r, segments = [], rdistance, distance;
    for (x = t1StartX; x < t1DocWidth; x++) {
        for (y = t1StartY; y < t1DocHeight; y++) {
            if (y === t1StartY + 1) {
                if (x > t1StartX && x < t1DocWidth - t1StartX) {
                    // skip to the last y position;
                    y = t1DocHeight - t1StartY;
                }
            }
            let origin;
            const point = canvas.grid.getCenterPoint({ x: Math.round(t1.document.x + (canvas.dimensions.size * x)), y: Math.round(t1.document.y + (canvas.dimensions.size * y)) });
            origin = new PIXI.Point(point.x, point.y);
            for (x1 = t2StartX; x1 < t2DocWidth; x1++) {
                for (y1 = t2StartY; y1 < t2DocHeight; y1++) {
                    if (y1 === t2StartY + 1) {
                        if (x1 > t2StartX && x1 < t2DocWidth - t2StartX) {
                            // skip to the last y position;
                            y1 = t2DocHeight - t2StartY;
                        }
                    }
                    const point = canvas.grid.getCenterPoint({ x: Math.round(t2.document.x + (canvas.dimensions.size * x1)), y: Math.round(t2.document.y + (canvas.dimensions.size * y1)) });
                    let dest = new PIXI.Point(point.x, point.y);
                    const r = new foundry.canvas.geometry.Ray(origin, dest);
                    segments.push({ ray: r });
                }
            }
        }
    }
    if (segments.length === 0) {
        debug('Error with distance check, no paths to target found');
        return -1;
    }
    rdistance = segments.map(ray => measureDistances([ray], { gridSpaces: true }));
    distance = Math.min(...rdistance);
    data.distance = distance;
}
function measureDistances(segments, options) {
    // Also stolen from Midi-QOL
    let configSettings = game.modules.get('midi-qol').active ? game.settings.get('midi-qol', 'ConfigSettings') : {};
    let isGridless = canvas.grid?.constructor.name === 'GridlessGrid';
    if (!isGridless || !options.gridSpaces || !configSettings.griddedGridless || !canvas.grid) {
        return segments.map(s => canvas.grid?.measurePath([s.ray.A, s.ray.B], {})).map(d => d?.distance ?? 0);
    }
    if (!canvas.grid) return [0];
    const diagonals = game.settings.get('core', 'gridDiagonals');
    const canvasGridProxy = new Proxy(canvas.grid, {
        get: function (target, prop, receiver) {
            if (foundry.grid.SquareGrid.prototype[prop] instanceof Function) {
                return foundry.grid.SquareGrid.prototype[prop].bind(canvasGridProxy);
            } else if (prop === 'diagonals') {
                return diagonals;
            } else if (prop === 'isSquare') return true;
            else if (prop === 'isGridless') return false;
            else if (prop === 'isHex') return false;
            return Reflect.get(target, prop);
        }
    });
    const GridDiagonals = CONST.GRID_DIAGONALS;
    // First snap the poins to the nearest center point for equidistant/1,2,1/2,1,2
    // I expected this would happen automatically in the proxy call - but didn't and not sure why.
    if ([GridDiagonals.APPROXIMATE, GridDiagonals.EQUIDISTANT, GridDiagonals.ALTERNATING_1, GridDiagonals.ALTERNATING_2].includes(diagonals)) {
        segments = segments.map(s => {
            const gridPosA = canvasGridProxy.getOffset(s.ray.A);
            const aCenter = canvasGridProxy.getCenterPoint(gridPosA);
            const gridPosB = canvasGridProxy.getOffset(s.ray.B);
            const bCenter = canvasGridProxy.getCenterPoint(gridPosB);
            return { ray: new foundry.canvas.geometry.Ray(aCenter, bCenter) };
        });
    }
    let distances = segments.map(s => canvasGridProxy.measurePath([s.ray.A, s.ray.B], {}));
    return distances.map(d => {
        let distance = d.distance;
        let fudgeFactor = configSettings.gridlessFudge ?? 0;
        switch (diagonals) {
            case GridDiagonals.EQUIDISTANT:
            case GridDiagonals.ALTERNATING_1:
            case GridDiagonals.ALTERNATING_2:
            // already fudged by snapping so no extra adjustment
                break;
            case GridDiagonals.EXACT:
            case GridDiagonals.RECTILINEAR:
            // @ts-expect-error yes it does
                if (d.diagonals > 0)
                    distance = Math.max(0, d.distance - (Math.SQRT2 * fudgeFactor));
                else distance = Math.max(0, d.distance - fudgeFactor);
                break;
            case GridDiagonals.APPROXIMATE:
            // @ts-expect-error yes it does
                if (d.diagonals > 0)
                    distance = Math.max(0, d.distance - fudgeFactor);
                break;
            case GridDiagonals.ILLEGAL:
            default:
                distance = d.distance;
        }
        return distance;
    });

}