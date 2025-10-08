let {ApplicationV2, HandlebarsApplicationMixin} = foundry.applications.api;
import { animationHandler } from '../handlers/animationHandler.js';
import { settings } from '../lib/settings.js';
import { helpers } from '../lib/lib.js';
import { UniversalAnimationsAnimationMenu } from './animationMenu.js';
export class UniversalAnimationsSettingsMenu extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor() {
        super({id: 'universal-animations-settings'});
        this.windowTitle = helpers.localize('UNIVERSALANIMATIONS.SettingsMenu.WindowTitle');
        this.category = null;
        this.hasChanged = false;
        this.childWindows = [];
        this.animationsCache = helpers.deepClone(game.settings.get('universal-animations', 'animations'));
    }
    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            handler: UniversalAnimationsSettingsMenu.handler,
            submitOnChange: false,
            closeOnSubmit: true,
            id: 'universal-animations-settings'
        },
        actions: {
            reset: UniversalAnimationsSettingsMenu.reset,
            resetDefaults: UniversalAnimationsSettingsMenu.resetDefaults,
            resetCustoms: UniversalAnimationsSettingsMenu.resetCustoms,
            settingAdd: UniversalAnimationsSettingsMenu.settingAdd,
            settingEdit: UniversalAnimationsSettingsMenu.settingEdit,
            settingReset: UniversalAnimationsSettingsMenu.settingReset,
            settingDelete: UniversalAnimationsSettingsMenu.settingDelete,
            confirm: UniversalAnimationsSettingsMenu.confirm
        },
        window: {
            title: 'Default Title',
            resizable: true,
            contentClasses: ['standard-form'],
        },
        position: {
            width: 600,
            height: 800
        }
    };
    static PARTS = {
        header: {
            template: 'modules/universal-animations/templates/header.hbs',
        },
        form: {
            template: 'modules/universal-animations/templates/settings.hbs',
            scrollable: [''],
        },
        footer: {
            template: 'modules/universal-animations/templates/footer.hbs',
        }
    };
    get title() {
        return this.windowTitle;
    }
    _prepareContext(options) {
        let settingsObject = this.animationsCache;
        for (let key in settingsObject) {
            settingsObject[key].requirementsSize = settingsObject[key]?.requirements?.length ?? 0;
        }
        let context = {
            header: {
                id: 'ua-settings-menu-header',
                buttons: [
                    {
                        type: 'button',
                        action: 'reset',
                        label: 'UNIVERSALANIMATIONS.SettingsMenu.Reset.Label',
                        name: 'reset'
                    },
                    {
                        type: 'button',
                        action: 'resetDefaults',
                        label: 'UNIVERSALANIMATIONS.SettingsMenu.ResetDefaults.Label',
                        name: 'resetDefaults'
                    },
                    {
                        type: 'button',
                        action: 'resetCustoms',
                        label: 'UNIVERSALANIMATIONS.SettingsMenu.ResetCustoms.Label',
                        name: 'resetCustoms'
                    }
                ]
            },
            form: {
                inputs: settingsObject,
                buttons: [
                    {
                        type: 'button',
                        action: 'settingEdit',
                        name: 'settingEdit',
                        icon: 'fa-solid fa-pen-to-square',
                    },
                    {
                        type: 'button',
                        action: 'settingReset',
                        name: 'settingReset',
                        icon: 'fa-solid fa-recycle',
                    },
                    {
                        type: 'button',
                        action: 'settingDelete',
                        name: 'settingDelete',
                        icon: 'fa-solid fa-trash-can',
                    }
                ]
            },
            footer: {
                id: 'ua-settings-menu-footer',
                buttons: [
                    {
                        type: 'submit',
                        action: 'confirm',
                        label: 'UNIVERSALANIMATIONS.SettingsMenu.Confirm.Label',
                        name: 'confirm'
                    }
                ]
            }
        };
        return context;
    }
    static async reset(event, target) {
        let result = await helpers.confirm(this.windowTitle, 'UNIVERSALANIMATIONS.SettingsMenu.Reset.Confirm.Content');
        if (!result) return;
        this.animationsCache = helpers.deepClone(settings.defaultSettings);
        this.hasChanged = true;
        this.render(true);
    };
    static async resetDefaults(event, target) {
        let result = await helpers.confirm(this.windowTitle, 'UNIVERSALANIMATIONS.SettingsMenu.ResetDefaults.Confirm.Content');
        if (!result) return;
        let defaultSettings = settings.defaultSettings;
        let defaultSettingsKeys = Object.keys(defaultSettings);
        for (let key of Object.keys(helpers.deepClone(this.animationsCache))) {
            if (defaultSettingsKeys.includes(key)) {
                this.animationsCache[key] = defaultSettings[key];
            }
        }
        this.hasChanged = true;
        this.render(true);
    };
    static async resetCustoms(event, target) {
        let result = await helpers.confirm(this.windowTitle, 'UNIVERSALANIMATIONS.SettingsMenu.ResetCustoms.Confirm.Content');
        if (!result) return;
        let customKeys = Object.keys(helpers.deepClone(this.animationsCache)).filter(key => key.includes('customSetting'));
        if (customKeys) {
            for (let k of customKeys) {
                delete this.animationsCache[k];
            }
        }
        this.hasChanged = true;
        this.render(true);
    };
    static settingAdd(event, target) {
        let currentCustomSettings = Object.keys(this.animationsCache).filter(k => k.includes('customSetting'))?.length ?? 0;
        let addedSettings = helpers.deepClone(this.animationsCache);
        addedSettings['customSetting' + currentCustomSettings] = settings.exampleSetting;
        this.animationsCache = addedSettings;
        this.hasChanged = true;
        this.render(true);
    };
    static async settingEdit(event, target) {
        let settingId = target.closest('.ua-settings-item').id;
        if (this.hasChanged) {
            if (await helpers.confirm(this.windowTitle, 'UNIVERSALANIMATIONS.SettingsMenu.SettingEditConfirm.Content')) {
                await game.settings.set('universal-animations', 'animations', this.animationsCache);
                animationHandler.initalizeSettings();
                this.hasChanged = false;
                let childWindow = await new UniversalAnimationsAnimationMenu({settingId, parent: this}).render(true);
                this.childWindows.push(childWindow);
            }
        } else {
            let childWindow = await new UniversalAnimationsAnimationMenu({settingId, parent: this}).render(true);
            this.childWindows.push(childWindow);
        }
    };
    static async settingReset(event, target) {
        let result = await helpers.confirm(this.windowTitle, 'UNIVERSALANIMATIONS.SettingsMenu.SettingReset.Confirm.Content');
        if (!result) return;
        let settingId = target.closest('.ua-settings-item').id;
        let currentSettings = helpers.deepClone(this.animationsCache);
        let defaultSetting = settings.defaultSettings[settingId] ?? settings.exampleSetting;
        currentSettings[settingId] = defaultSetting;
        this.animationsCache = currentSettings;
        this.hasChanged = true;
        this.render();
    };
    static async settingDelete(event, target) {
        let result = await helpers.confirm(this.windowTitle, 'UNIVERSALANIMATIONS.SettingsMenu.SettingDelete.Confirm.Content');
        if (!result) return;
        let settingId = target.closest('.ua-settings-item').id;
        let currentSetting = helpers.deepClone(this.animationsCache);
        delete currentSetting[settingId];
        this.animationsCache = currentSetting;
        this.hasChanged = true;
        this.render();
    };
    static async confirm(event, target) {
        let confirmation = true;
        for (let i of this.childWindows) {
            let result;
            if (i.state === 2) result = await i.close();
            if (result === false) confirmation = false;
        }
        if (confirmation === false) return;
        await game.settings.set('universal-animations', 'animations', this.animationsCache);
        animationHandler.initalizeSettings();
        this.close({hasSaved: true});
    };
    updateSetting(settingId, settingObject) {
        this.animationsCache[settingId] = settingObject;
        this.hasChanged = true;
        this.render(true);
    }
    async close(options = {}) {
        if (!options?.hasSaved && this.hasChanged && !options?.submitted) {
            let result = await helpers.confirm(this.windowTitle, 'UNIVERSALANIMATIONS.AnimationMenu.Close.Confirm.Content');
            if (!result) return false;
        }
        super.close(options);
        return true;
    }
}