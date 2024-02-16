import { settings } from "./settings.js";
export class universalAnimationsAnimationMenu extends FormApplication {
    constructor() {
        super();
        this.category = null;
        this.animationCache;
        this.buttonCache = {};
    }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            'classes': ['form'],
            'popOut': true,
            'template': 'modules/universal-animations/styles/animationConfig.html',
            'id': 'universal-animations-animation-menu',
            'title': 'Universal Animations',
            'width': '600',
            'height': '800',
            'closeOnSubmit': false,
            'submitOnChange': true,
            'resizable': true,
            'settingId': ''
        });
    }
    getAnimation(settingId) {
        if (!this.animationCache) {
            let settingsObject = game.settings.get('universal-animations', 'Animations');
            this.animationCache = settingsObject?.[settingId];
            if (!this.animationCache) {
                ui.notifications.warn('Universal Animations | Error with setting "' + settingId + '"');
                return false;
            }
        }
        return foundry.utils.deepClone(this.animationCache);
    }
    getData(options) {
        let animation = this.getAnimation(options.settingId);
        animation.isDefault = settings.defaultSettings?.[options.settingId] ? true : false;
        animation.isDefault === false ? animation.isCustomized = true : animation.isCustomized = settings.defaultSettings[options.settingId] === animation ? false : true;
        animation.buttonCache = this.buttonCache;
        let protoSetting = settings.protypeSetting;
        loop: for (let [key, value] of Object.entries(protoSetting)) {
            if (['name', 'effects'].includes(key)) continue loop;
            let animValue = animation[key];
            animation[key] = value;
            if (animation[key].values?.includes(true) && !animValue) {
                animation[key].value = false;
            } else if (animValue?.length < protoSetting[key].values?.length) {
                let expandedValues = [];
                protoSetting[key].values.forEach(v => {
                    animValue.includes(v) ? expandedValues.push(v) : expandedValues.push(false);
                });
                animation[key].value = expandedValues;
            } else {
                animation[key].value = animValue;
            }
        }
        animation.effectKeys = Object.keys(protoSetting.effects[0]);
        animation.effectKeysLabel = animation.effectKeys.forEach(k => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase()))
        for (let i of animation.effects) {
            for (let [key, value] of Object.entries(i)) {
                let protoEffect = protoSetting.effects[0][key];
                i[key] = {
                    'value': value,
                    'values': protoEffect?.values,
                    'label': key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase()),
                    'valuesLabels': protoEffect?.valuesLabels,
                    'type': protoEffect.type,
                    'default': protoEffect.default,
                    'values': protoEffect.values,
                    'isRadio': protoEffect.type === 'boolean',
                    'isSelect': protoEffect.type === 'string' && protoEffect.values?.length > 1,
                    'isSelectThenText': protoEffect.type === 'array' && protoEffect.values?.length > 1,
                    'isText': protoEffect.type === 'string' && protoEffect.values === undefined,
                    'isTextMultiple': protoEffect.type === 'array' && protoEffect.values === undefined,
                    'isNumber': protoEffect.type === 'number'
                }
                if (i[key].isSelectThenText || i[key].isTextMultiple) {
                    if (['string', 'number'].includes(typeof i[key].value)) i[key].value = [i[key].value];
                    while (i[key].value.length < i[key].default.length) {
                        i[key].value.push(undefined);
                    }
                }
            }
            i.availableProperties = Object.keys(protoSetting.effects[0]).filter(key => !Object.keys(i).includes(key))
        }
        return {'animation': animation};
    }
    processFormData(formData) {
        function cleanProperties(obj) {
            for (let key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    cleanProperties(obj[key]);
                    if (Array.isArray(obj[key])) {
                        obj[key] = obj[key].filter(value => value !== false && value !== "" && value !== null);
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
        }
        function validateType(variable, comparator) {
            for (let key in comparator) {
                if (Array.isArray(comparator[key])) {
                    for (let i = 0; i < variable[key].length; i++) {
                        if (!validateType(variable[key][i], comparator[key][0])) {
                            return false;
                        }
                    }
                } else {
                    if (comparator[key]?.type && typeof variable[key] !== comparator[key].type && (!comparator[key].type === 'array' && (Array.isArray(variable[key]) === false))) {
                        ui.notifications.error(`UA | Error with setting '${key}', is not type of '${comparator[key].type}', is type of '${typeof variable[key]}'`);
                        return false;
                    }
                }
            }
            return true;
        }
        function addProperty(obj) {
            let effect = Object.keys(obj.addProperty)[0];
            let key = obj.addProperty[effect];
            obj.effects[effect][key] = settings.protypeSetting.effects[0][key].default;
        }
        let obj = foundry.utils.deepClone(formData);
        cleanProperties(obj);
        obj.effects = Object.values(obj.effects);
        if (Object.values(obj.addProperty).length > 0) addProperty(obj);
        if (validateType(obj, settings.protypeSetting)) {
            this.animationCache = foundry.utils.deepClone(obj);
        }
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '[data-action]', this._handleButtonClick.bind(this));
        html.find('.accordion-button').click(ev => {
            let clickedElement = $(ev.currentTarget);
            let content = clickedElement[0].nextElementSibling;
            let index = clickedElement[0].name;
            this.buttonCache?.[index] === true ? this.buttonCache[index] = false : this.buttonCache[index] = true;
            content.style.display === 'block' ? content.style.display = 'none' : content.style.display = 'block';
        });
    }
    adjustObject(object, keyToDelete) {
        delete object[keyToDelete];
        let count = 0;
        let adjustedObject = {};
        for (let key in object) {
            adjustedObject[count] = object[key];
            count++;
        }
        return adjustedObject;
    }
    async _handleButtonClick(event) {
        let clickedElement = $(event.currentTarget)
        let action = clickedElement.data().action;
        switch (action) {
            case 'add-requirement':
                if (!this.animationCache?.requirements) {
                    this.animationCache.requirements = settings.protypeSetting.requirements.default;
                } else {
                    let length = Object.keys(this.animationCache.requirements).length;
                    this.animationCache.requirements[length] = settings.protypeSetting.requirements.default[0];
                }
                this.render();
                break;
            case 'delete-requirement':
                let reqId = clickedElement[0].name;
                this.animationCache.requirements = this.adjustObject(this.animationCache.requirements, reqId);
                this.render();
                break;
            case 'add-effect':
                if (!this.animationCache.effects) {
                    this.animationCache.effects = settings.defaultSettings.exampleSetting.effects;
                } else {
                    let length = this.animationCache.effects.length;
                    this.animationCache.effects[length] = settings.exampleSetting.effects[0];
                }
                this.render();
                break;
            case 'delete-effect':
                let effectId = clickedElement[0].name;
                this.animationCache.effects.splice(effectId, 1);
                this.buttonCache = this.adjustObject(this.buttonCache, effectId);
                this.render();
                break;
            case 'confirm':
                let currentSettings = game.settings.get('universal-animations', 'Animations');
                currentSettings[this.options.settingId] = this.animationCache;
                await game.settings.set('universal-animations', 'Animations', currentSettings);
                Object.values(ui.windows).find(w => w.id === 'universal-animations-settings').render();
                this.close();
                break;
        }
    }
    async _updateObject(event, formData) {
        this.processFormData(foundry.utils.expandObject(formData));
        this.render();
    }
}