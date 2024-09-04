import { animationHandler } from "./animationHandler.js";
import { debug } from "../lib/debugger.js";

let cache = {itemUuid: '', targetsIds: []}

let autorecSettings = [];

export let uaHandler = {
    'startup': startup,
    'initialize': initialize,
    'initializeCache': initializeCache,
    'close': close,
    'closeByActor': closeByActor,
    'clean': clean,
}
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
        ]
    }
}
async function initialize(data, stage) {
    let clonedData = foundry.utils.deepClone(data)
    if (await animationCheck(clonedData.item)) return;
    getDistance(clonedData);
    await animationHandler.animate(clonedData, stage);
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
        setTimeout(resolve, 20000); //this delay should be customizable
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
    if (item.flags?.universalAnimations?.override === 'alwaysPlay') return false;
    if (item.flags?.universalAnimations?.override === 'neverPlay') return true;
    if (item.flags?.autoanimations?.isEnabled || item.flags['chris-premades']?.info?.hasAnimation) return true;
    if (game.modules.get('autoanimations')?.active && item.flags?.autoanimations?.isEnabled != false) {
        try {
            let name = item.name;
            return autorecSettings.some(setting => setting.some(autoRec => name.toLowerCase().includes(autoRec.label.toLowerCase())));
        } catch (error) {
            let style = 'background-color: #ff3333; color: #ff6666;'
            console.log(`%cERROR | Univeral Animations | Issue with AA Auto Recs - Please Share w/Autumn225`, style, error);
            ui.notifications.error('ERROR | Universal Animations | Issue with AA Auto Recs | See Console (F12)');
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
            let origin;
            if (game.release.generation > 11) {
                const point = canvas.grid.getCenterPoint({ x: Math.round(t1.document.x + (canvas.dimensions.size * x)), y: Math.round(t1.document.y + (canvas.dimensions.size * y)) });
                origin = new PIXI.Point(point.x, point.y);
            } else {
                origin = new PIXI.Point(...canvas.grid.getCenter(Math.round(t1.document.x + (canvas.dimensions.size * x)), Math.round(t1.document.y + (canvas.dimensions.size * y))));
            }
            for (x1 = t2StartX; x1 < t2DocWidth; x1++) {
                for (y1 = t2StartY; y1 < t2DocHeight; y1++) {
                    let dest;
                    if (game.release.generation > 11) {
                        const point = canvas.grid.getCenterPoint({ x: Math.round(t2.document.x + (canvas.dimensions.size * x1)), y: Math.round(t2.document.y + (canvas.dimensions.size * y1)) });
                        dest = new PIXI.Point(point.x, point.y);
                    } else {
                        dest = new PIXI.Point(...canvas.grid.getCenter(Math.round(t2.document.x + (canvas.dimensions.size * x1)), Math.round(t2.document.y + (canvas.dimensions.size * y1))));
                    }
                    const r = new Ray(origin, dest);
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
    data.distance = distance
}
function measureDistances(segments, options) {
    // Also stolen from Midi-QOL
    let configSettings = game.settings.get('midi-qol', 'ConfigSettings');
    if (game.release.generation > 11) {
        let isGridless = canvas?.grid?.constructor.name === "GridlessGrid";
        const oldMeasurePath = canvas?.grid?.constructor.prototype._measurePath;
        const oldDiagonals = canvas?.grid?.diagonals;
        const oldGetOffset = canvas?.grid?.constructor.prototype.getOffset;
        let distances;
        if (isGridless && options.gridSpaces && configSettings.griddedGridless && canvas?.grid) {
            canvas.grid.constructor.prototype._measurePath = foundry.grid.SquareGrid.prototype._measurePath;
            canvas.grid.constructor.prototype.getOffset = foundry.grid.SquareGrid.prototype.getOffset;
            canvas.grid.diagonals = game.settings.get("core", "gridDiagonals");
        } try {
            distances = segments.map(s => canvas?.grid?.measurePath([s.ray.A, s.ray.B]))
        } catch (err) {
            throw (err);
        } finally {
            if (canvas?.grid) {
                if (oldMeasurePath) canvas.grid.constructor.prototype._measurePath = oldMeasurePath;
                if (oldDiagonals) canvas.grid.diagonals = oldDiagonals;
                if (oldGetOffset) canvas.grid.constructor.prototype.getOffset = oldGetOffset
            }
        }
        if (options.gridSpaces ) {
            return distances.map(d => d.spaces === 0 ? d.distance : d.spaces * canvas?.grid.distance);
        }
        return distances = distances.map(d => d.distance);
    } else {
        let isGridless;
        isGridless = canvas?.grid?.grid?.constructor.name === "BaseGrid";
        if (!isGridless || !options.gridSpaces || !configSettings.griddedGridless) {
            const distances = canvas?.grid?.measureDistances(segments, options);
            if (!configSettings.gridlessFudge) return distances; // TODO consider other impacts of doing this
            return distances;
        }
        const rule = game.settings.get("dnd5e", "diagonalMovement") ?? "EUCL"; // V12
        if (!configSettings.gridlessFudge || !options.gridSpaces || !["555", "5105", "EUCL"].includes(rule)) {
            return canvas?.grid?.measureDistances(segments, options);
        }
        let nDiagonal = 0;
        const d = canvas?.dimensions;
        const grid = canvas?.scene?.grid;
        if (!d || !d.size) return 0;
        const fudgeFactor = configSettings.gridlessFudge / d.distance;
        return segments.map(s => {
            let r = s.ray;
            let nx = Math.ceil(Math.max(0, Math.abs(r.dx / d.size) - fudgeFactor));
            let ny = Math.ceil(Math.max(0, Math.abs(r.dy / d.size) - fudgeFactor));
            let nd = Math.min(nx, ny);
            let ns = Math.abs(ny - nx);
            nDiagonal += nd;
            if (rule === "5105") {
                let nd10 = Math.floor(nDiagonal / 2) - Math.floor((nDiagonal - nd) / 2);
                let spaces = (nd10 * 2) + (nd - nd10) + ns;
                return spaces * d.distance;
            } else if (rule === "EUCL") {
                let nx = Math.max(0, Math.abs(r.dx / d.size) - fudgeFactor);
                let ny = Math.max(0, Math.abs(r.dy / d.size) - fudgeFactor);
                return Math.ceil(Math.hypot(nx, ny) * grid?.distance);
            } else return Math.max(nx, ny) * grid.distance;
        })
    }
}