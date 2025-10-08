function registerHandlebarsHelpers() {
    // eslint-disable-next-line no-undef
    Handlebars.registerHelper({
        incl, 
        forNum, 
        addition,
        nullCoOp
    });
}
function incl(array, value) {
    return array.includes(value);
}
function forNum(context, options) {
    let content = '';
    for (let i = 0; i < context; i++) {
        content += options.fn(i);
    }
    return content;
}
function addition(value1, value2) {
    let num1 = Number(value1);
    let num2 = Number(value2);
    if (!(num1 >= 0 && num2 >=0)) return undefined;
    return num1 + num2;
}
function nullCoOp(value1, value2) {
    return value1 ?? value2;
}
/****/
function localize(value) {
    let localized = value;
    try {
        localized = game.i18n.localize(value);
    } catch (error) {
        /***/
    }
    return localized;
}
function format(string, data) {
    return game.i18n.format(string, data);
}
function deepClone(value) {
    return foundry.utils.deepClone(value);
}
async function confirm(title, content) {
    return await foundry.applications.api.DialogV2.confirm({
        window: {title: localize(title)},
        content: '<p>' + localize(content) + '</p>'
    });
}
function setProperty(object, key, value) {
    return foundry.utils.setProperty(object, key, value);
}
function notification(type, content, options) {
    ui.notifications[type]('Universal Animations | ' + localize(content), options);
}
export let helpers = {
    registerHandlebarsHelpers,
    localize,
    format,
    deepClone,
    confirm,
    setProperty,
    notification
};