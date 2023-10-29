import * as systemSupport from "./system-support/index.js"
// import game settings

Hooks.once('init', async function() {
    //resgisterSettings()
});

Hooks.once('ready', async function() {
    const systemId = game.system.id;
    systemSupport[systemId].systemHooks();
});
