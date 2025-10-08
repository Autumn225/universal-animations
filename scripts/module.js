import * as systemSupport from './system-support/index.js';
import { createHeaderButton } from './applications/itemConfig.js';
import { uaHandler } from './handlers/uaHandler.js';
import { animationHandler } from './handlers/animationHandler.js';
import { settings } from './lib/settings.js';
import { helpers } from './lib/lib.js';

Hooks.once('init', async function() {
    settings.initialize();
    helpers.registerHandlebarsHelpers();
});

Hooks.once('ready', async function() {
    if (game.modules.get('jb2a_patreon')?.active && game.modules.get('JB2A_DnD5e')?.active) {
        helpers.notification('warn', 'UNIVERSALANIMATIONS.Notifications.BothJB2As', {permanent: true});
    } else if (!game.modules.get('jb2a_patreon')?.active && !game.modules.get('JB2A_DnD5e')?.active) {
        helpers.notification('error', 'UNIVERSALANIMATIONS.Notifications.NoJB2A', {permanent: true});
    }
    Hooks.on('getItemSheetHeaderButtons', createHeaderButton);
    const systemId = game.system.id;
    systemSupport[systemId].systemHooks();
    uaHandler.startup();
    animationHandler.initalizeSettings();
});
globalThis['universalAnimations'] = {
    animationHandler
};