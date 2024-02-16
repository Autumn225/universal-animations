import { animationHandler } from "../handlers/animationHandler.js";
import { settings } from "./settings.js";
import { universalAnimationsAnimationMenu } from "./animationMenu.js";
export class universalAnimationsSettingsMenu extends FormApplication {
    constructor() {
        super();
        this.category = null;
        this.animationsCache;
    }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'classes': ['form'],
            'popOut': true,
            'template': 'modules/universal-animations/styles/config.html',
            'id': 'universal-animations-settings',
            'title': 'Universal Animations',
            'scrollY': ['.ua-settings'],
            'width': '600',
            'height': '800',
            'submitOnChange': false,
            'closeOnSubmit': true,
            'resizable': true
        });
    }
    getData() {
        if (!this.animationsCache) this.animationsCache = foundry.utils.deepClone(game.settings.get('universal-animations', 'Animations'));
        let settingsObject = this.animationsCache;
        for (let i of Object.keys(settingsObject)) {
            if (settingsObject[i]?.requirements) {
                settingsObject[i].requirementsSize = Object.keys(settingsObject[i].requirements).length;
            } else (settingsObject[i].requirementsSize = 0)
        }
        return {'settings': settingsObject};
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '[data-action]', this._handleButtonClick.bind(this));
    }
    async _handleButtonClick(event) {
        let clickedElement = $(event.currentTarget);
        let action = clickedElement.data().action;
        let settingId = clickedElement.parents('[data-setting-id]')?.data()?.settingId;
        switch (action) {
            case 'reset':
                this.animationsCache = foundry.utils.deepClone(settings.defaultSettings);
                this.render();
                break;
            case 'resetDefaults':
                let defaultSettings = settings.defaultSettings;
                let defaultSettingsKeys = Object.keys(defaultSettings);
                for (let key of Object.keys(foundry.utils.deepClone(this.animationsCache))) {
                    if (defaultSettingsKeys.includes(key)) {
                        this.animationsCache[key] = defaultSettings[key];
                    }
                }
                this.render();
                break;
            case 'resetCustoms':
                let customKeys = Object.keys(foundry.utils.deepClone(this.animationsCache)).filter(key => key.includes('customSetting'));
                if (customKeys) {
                    for (let k of customKeys) {
                        delete this.animationsCache[k];
                    }
                }
                this.render();
                break;
            case 'settingAdd':
                let currentCustomSettings = Object.keys(this.animationsCache).filter(k => k.includes('customSetting'))?.length ?? 0;
                let addedSettings = foundry.utils.deepClone(this.animationsCache);
                addedSettings['customSetting' + currentCustomSettings] = settings.exampleSetting;
                this.animationsCache = addedSettings;
                this.render();
                break;
            case 'settingEdit':
                let tester = Object.keys(this.animationsCache).filter(k => Object.keys((game.settings.get('universal-animations', 'Animations'))).includes(k));
                if (tester.length !== Object.keys(this.animationsCache).length) {
                    if (await Dialog.confirm({
                        'title': 'Universal Animations',
                        'content': 'Save current changes in order to edit animations?'
                    })) {
                        await game.settings.set('universal-animations', 'Animations', this.animationsCache);
                        animationHandler.initalizeSettings();
                        new universalAnimationsAnimationMenu().render(true, {settingId});
                    }
                } else {
                    new universalAnimationsAnimationMenu().render(true, {settingId});
                }
                break;
            case 'settingReset':
                let currentSettings = foundry.utils.deepClone(this.animationsCache);
                let defaultSetting = settings.defaultSettings[settingId];
                if (!defaultSetting) defaultSetting = settings.defaultSettings['spellAttackCast'];
                currentSettings[settingId] = defaultSetting;
                this.animationsCache = currentSettings;
                this.render();
                break;
            case 'settingDelete':
                let currentSetting = foundry.utils.deepClone(this.animationsCache);
                delete currentSetting[settingId];
                this.animationsCache = currentSetting;
                this.render();
                break;
            case 'confirm':
                await game.settings.set('universal-animations', 'Animations', this.animationsCache);
                animationHandler.initalizeSettings();
                let openWindows = Object.values(ui.windows).filter(w => w.id === 'universal-animations-animation-menu');
                if (openWindows) openWindows.forEach(w => w.close());
                this.close();
                break;
        }
    }
    async _updateObject(event, formData) {
    }
}