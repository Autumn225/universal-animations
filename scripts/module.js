import * as systemSupport from './system-support/index.js'
import { createHeaderButton } from './lib/itemConfig.js';
import { uaHandler } from './handlers/ua-handler.js';
import { animationHandler } from './handlers/animationHandler.js';
import { settings } from './lib/settings.js';

Hooks.once('init', async function() {
    settings.initialize();
});

Hooks.once('ready', async function() {
    if (game.modules.get('jb2a_patreon')?.active && game.modules.get('JB2A_DnD5e')?.active) {
        ui.notifications.warn('Universal Animations | You have both JB2A modules active, please disable the free version', {permanent: true})
    } else if (!game.modules.get('jb2a_patreon')?.active && !game.modules.get('JB2A_DnD5e')?.active) {
        ui.notifications.error('Universal Animations | You do not have a JB2A module active, this module requires either the free or patreon version', {permanent: true})
    }
    Hooks.on('getItemSheetHeaderButtons', createHeaderButton);
    const systemId = game.system.id;
    systemSupport[systemId].systemHooks();
    uaHandler.startup();
    animationHandler.initalizeSettings();
});
globalThis['universalAnimations'] = {
    animationHandler
}