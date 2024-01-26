export function debug(...args) {
    let DEV_MODE = false; // For testing only
    let style = 'background-color: #2A2846; color: #FAE074;'
    if (/*game.settings?.get("universal-animations", "debug") || */ DEV_MODE) { // No setting yet
        console.log(`%cDEBUG | Univeral Animations |`, style, ...args, );
    }
}