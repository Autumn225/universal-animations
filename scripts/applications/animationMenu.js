let {ApplicationV2, HandlebarsApplicationMixin} = foundry.applications.api;
import { settings } from '../lib/settings.js';
import { helpers } from '../lib/lib.js';
export class UniversalAnimationsAnimationMenu extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(data) {
        super({id: 'universal-animations-animation'});
        this.windowTitle = helpers.localize('UNIVERSALANIMATIONS.AnimationMenu.WindowTitle');
        this.category = null;
        this.parent = data.parent;
        this.settingId = data.settingId;
        this.animationCache = UniversalAnimationsAnimationMenu.getAnimation(this.settingId);
        this.accordionCache = UniversalAnimationsAnimationMenu.makeAccordionCache(this.animationCache);
    }
    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            handler: UniversalAnimationsAnimationMenu.formHandler,
            submitOnChange: true,
            closeOnSubmit: false,
        },
        actions: {
            addEffect: UniversalAnimationsAnimationMenu.addEffect,
            addRequirement: UniversalAnimationsAnimationMenu.addRequirement,
            confirm: UniversalAnimationsAnimationMenu.confirm,
            deleteEffect: UniversalAnimationsAnimationMenu.deleteEffect,
            deleteRequirement: UniversalAnimationsAnimationMenu.deleteRequirement
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
            template: 'modules/universal-animations/templates/animation.hbs',
            scrollable: [''],
        },
        footer: {
            template: 'modules/universal-animations/templates/footer.hbs',
        }
    };
    get title() {
        return this.windowTitle;
    }
    get hasChanged() {
        return this?._hasChanged ?? false;
    }
    set hasChanged(value) {
        this._hasChanged = value;
        this.animationCache.isCustomized = true;
    }
    static formHandler(event) {
        let state = event.type;
        if (state === 'change') {
            let target = event.target;
            let key = target.name;
            let value = target.value;
            if (['true', 'false'].includes(value)) value = value === 'true' ? true : false;
            let parent = target.closest('.input-section');
            let section = parent?.getAttribute('data-section') ?? 'info';
            switch (section) { 
                case 'info': {
                    helpers.setProperty(this.animationCache, key, value);
                    break;
                }
                case 'requirement': {
                    let [index, innerKey] = key.split('-');
                    let array = this.animationCache.requirements;
                    let obj = array[index];
                    helpers.setProperty(obj, innerKey, value);
                    array.splice(index, 1, obj);
                    helpers.setProperty(this.animationCache, 'requirements', array);
                    break;
                }
                case 'effects': {
                    let index = parent.getAttribute('data-index');
                    let array = this.animationCache.effects;
                    let obj = array[index];
                    if (key.includes('-')) {
                        let [keyProperty, keyIndex] = key.split('-');
                        let innerArray = obj[keyProperty];
                        innerArray.splice(keyIndex, 1, value) ;
                        helpers.setProperty(obj, keyProperty, innerArray);
                    } else {
                        helpers.setProperty(obj, key, value);
                    }
                    array.splice(index, 1, obj);
                    helpers.setProperty(this.animationCache, 'effects', array);
                    break;
                }
                case 'addProperty': {
                    let index = parent.getAttribute('data-index');
                    let array = this.animationCache.effects;
                    let obj = array[index];
                    let defaultValue = settings.prototypeSetting.effects[0][value].default;
                    helpers.setProperty(obj, value, defaultValue);
                    array.splice(index, 1, obj);
                    helpers.setProperty(this.animationCache, 'effects', array);
                    this.render(true);
                }
            }
            this.hasChanged = true;
        } 
    }
    static accordion(event) {
        let target = event.target;
        let parentEl = target.closest('.ua-animations-effects-effect');
        let index = parentEl.id.replace('effect-', '');
        let accordionEl = parentEl.querySelector('.ua-animations-effects-inputs');
        let accordionClassList = accordionEl.classList;
        let buttonEl = parentEl.querySelector('.ua-accordion-button');
        let buttonClassList = buttonEl.classList;
        if (accordionClassList.contains('ua-accordion-closed')) {
            accordionClassList.remove('ua-accordion-closed');
            accordionClassList.add('ua-accordion-open');
            buttonClassList.remove('ua-accordion-button-closed');
            buttonClassList.add('ua-accordion-button-open');
            this.accordionCache[index] = 'open';
        } else {
            accordionClassList.remove('ua-accordion-open');
            accordionClassList.add('ua-accordion-closed');
            buttonClassList.remove('ua-accordion-button-open');
            buttonClassList.add('ua-accordion-button-closed');
            this.accordionCache[index] = 'closed';
        }
    }
    /** Buttons **/
    static addRequirement(event, target) {
        if (!this.animationCache?.requirements) {
            this.animationCache.requirements = helpers.deepClone(settings.prototypeSetting.requirements.default);
        } else {
            let length = Object.keys(this.animationCache.requirements).length;
            this.animationCache.requirements[length] = helpers.deepClone(settings.prototypeSetting.requirements.default[0]);
        }
        this.hasChanged = true;
        this.render();
    }
    static deleteRequirement(event) {
        let target = event.target;
        let parent = target.closest('.ua-animations-requirements-input');
        let reqId = parent.id;
        let index = Number(reqId.replace('requirement-', '') ?? 0);
        this.animationCache.requirements.splice(index, 1);
        this.hasChanged = true;
        this.render(true);
    }
    static addEffect(event) {
        if (!this.animationCache.effects) {
            this.animationCache.effects = helpers.deepClone(settings.defaultSettings.exampleSetting.effects);
        } else {
            let length = this.animationCache.effects.length;
            this.animationCache.effects[length] = settings.exampleSetting.effects[0];
        }
        this.hasChanged = true;
        this.render();
    }
    static deleteEffect(event) {
        let target = event.target;
        let parent = target.closest('.ua-animations-effects-effect');
        let parentId = parent.id;
        let effectId = Number(parentId.replace('effect-', '') ?? 0);
        this.animationCache.effects.splice(effectId, 1);
        this.hasChanged = true;
        this.render();
    }
    static confirm(event, target) {
        delete this.animationCache.isDefault;
        delete this.animationCache.requirementsSize;
        this.animationCache = this.cleanProperties(this.animationCache);
        let validation = this.validateType(this.animationCache, settings.prototypeSetting);
        if (validation) {
            this.parent.updateSetting(this.settingId, this.animationCache);
            this.close({hasSaved: true});
        }
    }
    /****/
    static getAnimation(settingId) {
        let settingsObject = game.settings.get('universal-animations', 'animations');
        let animationCache = settingsObject?.[settingId];
        if (!animationCache) {
            ui.notifications.warn(helpers.format('UNIVERSALANIMATIONS.AnimationMenu.Error.Setting', settingId));
            return false;
        }
        return helpers.deepClone(animationCache);
    }
    static makeAccordionCache(animationCache) {
        if (!animationCache.effects?.length) return {};
        let cache = {};
        for (let i = 0; i < animationCache.effects.length; i++) {
            cache[i] = 'closed';
        }
        return cache;
    }
    cleanProperties(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.cleanProperties(obj[key]);
                if (Array.isArray(obj[key])) {
                    obj[key] = obj[key].filter(value => value !== false && value !== '' && value !== null);
                }
            }
            if (obj[key] === false || obj[key] === 'false' || obj[key] === '') {
                delete obj[key];
            }
            if (obj[key] === 'true') obj[key] = true;
            if (typeof obj[key] === 'string') {
                let numberValue = parseFloat(obj[key]);
                if (!isNaN(numberValue)) {
                    obj[key] = numberValue;
                }
            }
        }
        return obj;
    }
    validateType(variable, comparator) {
        function compare(def, variable, key) {
            if (!def || !variable || !key) return true;
            let defType = typeof def;
            let varType = typeof variable;
            if (defType != varType) {
                ui.notifications.error(helpers.format('UNIVERSALANIMATIONS.AnimationMenu.Error.Type', {key, wantedType: defType, varType}));
                return false;
            } else {
                if (defType === 'object') {
                    for (let i = 0; i < variable.length; i++) {
                        let value = compare(def[i], variable[i], key);
                        if (!value) return false;
                    }
                } else if (defType === 'string' && def?.includes('{')) {
                    try {
                        JSON.parse(variable);
                    } catch (error) {
                        ui.notifications.error(helpers.format('UNIVERSALANIMATIONS.AnimationMenu.Error.Object', {key}));
                        return false;
                    }
                }
            }
            return true;
        }
        for (let key in variable) {
            let def = comparator[key]?.default ?? comparator[key];
            if (!def) continue;
            if (Array.isArray(comparator[key])) { // To catch `effects`
                for (let i = 0; i < variable[key].length; i++) {
                    if (!this.validateType(variable[key][i], comparator[key][0])) {
                        return false;
                    }
                }
            } else {
                let value = compare(def, variable[key], key);
                if (!value) return false;
            }
        }
        return true;
    }
    /* Overwrites */
    _prepareContext(options) {
        let animation = this.animationCache;
        let animationClone = helpers.deepClone(animation);
        let context = {};
        context.header = {
            id: 'ua-animation-menu-header',
            inputs: [
                {
                    type: 'text',
                    name: 'name',
                    id: 'name',
                    value: animation.name,
                }
            ]
        };
        animationClone.isDefault = settings.defaultSettings?.[this.settingId] ? true : false;
        if (animationClone.isDefault) context.header.inputs.push(
            {
                type: 'content',
                name: 'defaultSetting',
                id: 'defaultSetting',
                value: helpers.localize('UNIVERSALANIMATIONS.AnimationMenu.DefaultSetting.Label'),
            }
        );
        if (animationClone.isCustomized) context.header.inputs.push(
            {
                type: 'content',
                name: 'customizedSetting',
                id: 'customizedSetting',
                value: helpers.localize('UNIVERSALANIMATIONS.AnimationMenu.CustomizedSetting.Label'),
            }
        );
        let protoSetting = settings.prototypeSetting;
        context.form = {
            id: this.settingId,
            inputs: Object.entries(protoSetting).filter(([key, value]) => !['name', 'effects'].includes(key)).map(([key, value]) => (
                {
                    id: key,
                    name: key,
                    label: value.label,
                    type: value.inputType,
                    options: value.options,
                    buttons: value.buttons,
                    value: animationClone[key],
                    placeholder: value.default
                }
            )),
            effects: animationClone.effects?.map((e, index) => ({
                id: 'effect-' + index,
                name: 'effect-' + index,
                accordionClass: 'ua-accordion-' + this.accordionCache[index],
                accordionButtonClass: 'ua-accordion-button-' + this.accordionCache[index],
                inputs: Object.entries(e).map(([key, value]) => {
                    let obj = protoSetting.effects[0][key];
                    obj.value = value;
                    obj.id = key;
                    obj.name = key;
                    return obj;
                }),
                availableProperties: Object.keys(protoSetting.effects[0]).filter(i => !Object.keys(e).includes(i))
            })),
            buttons: [
                {
                    id: 'addEffect',
                    name: 'addEffect',
                    type: 'button',
                    class: '.ua-animations-effects-add-effect',
                    action: 'addEffect',
                    label: 'UNIVERSALANIMATIONS.AnimationMenu.AddEffect'
                }
            ]
        };
        context.footer = {
            id: 'ua-animations-menu-footer',
            buttons: [
                {
                    type: 'submit',
                    action: 'confirm',
                    label: 'UNIVERSALANIMATIONS.General.Confirm',
                    name: 'confirm'
                }
            ]
        };
        return context;
    }
    _onRender(context, options) {
        this.element.querySelectorAll('.ua-accordion-button .ua-animations-effects-header-name, .ua-accordion-button .fa-chevron-right').forEach(i => i.addEventListener('click', UniversalAnimationsAnimationMenu.accordion.bind(this)));
        this.element.querySelectorAll('.ua-accordion-button .fa-minus').forEach(i => i.addEventListener('click', UniversalAnimationsAnimationMenu.deleteEffect.bind(this)));
    }
    async close(options) {
        if (!options?.hasSaved && this.hasChanged) {
            let result = await helpers.confirm(this.windowTitle, 'UNIVERSALANIMATIONS.AnimationMenu.Close.Confirm.Content');
            if (!result) return false;
        }
        super.close(options);
        return true;
    }
}