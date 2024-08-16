import { uaHandler } from "../handlers/ua-handler.js";
import { getRequiredData } from "./getRequiredData.js";
import { constants } from "../lib/constants.js";
import { defaultPreferences } from "../lib/defaultPreferences.js";
import { debug } from "../lib/debugger.js";

export function systemHooks() {
    if (game.modules.get("midi-qol")?.active) {
        Hooks.on('midi-qol.postPreambleComplete', async (workflow) => {
            debug('Hook caught for midi-qol.postPreambleComplete');
            await attack(getWorkflowData(workflow));
        })
        Hooks.on("midi-qol.AttackRollComplete", async (workflow) => {
            debug('Hook caught for midi-qol.AttackRollComplete');
            if (workflow.item?.hasAreaTarget) return;
            await postHit(getWorkflowData(workflow));
        });
        Hooks.on("midi-qol.DamageRollComplete", async (workflow) => { 
            debug('Hook caught for midi-qol.DamageRollComplete');
            if (workflow.item?.hasAreaTarget) return;
            await damage(getWorkflowData(workflow));
        });
        Hooks.on('midi-qol.postCheckSaves', async (workflow) => {
            debug('Hook caught for post midi-qol.postCheckSaves')
            let data = getWorkflowData(workflow);
            for (let i of Array.from(workflow.saves)) {
                let newData = data;
                newData.targets = [i];
                newData.outcome = true;
                save(newData);
            }
            for (let i of Array.from(workflow.failedSaves)) {
                let newData = data;
                newData.targets = [i];
                newData.outcome = false;
                save(newData);
            }
        });
        // Items with no Attack/Damage (Probably won't be used)
        Hooks.on("midi-qol.RollComplete", (workflow) => {
            if (workflow.item?.hasAreaTarget || workflow.item?.hasAttack || workflow.item?.hasDamage) { return };
            useItem(getWorkflowData(workflow))
        });
    } else {
        Hooks.on("dnd5e.preDisplayCard", async (item, options) => {
            let data = await getRequiredData({item, actor: item.actor, workflow: item});
            attack(data);
            if (item.system.hasSave === true) { // Save from ammo doesn't work without midi.
                async function callback (actor, roll, abilityId) {
                    let itemUuid = await uaHandler.closeByActor(actor);
                    if (!itemUuid) return false;
                    let item = await fromUuid(itemUuid);
                    if (!item) return false;
                    let outcome = roll.total >= item.system.save.dc;
                    data = await getRequiredData({item, actor: item.actor, token: actor.token.object, targets: [actor.token.object], targetIds: [actor.id], workflow: item, outcome: outcome});
                    if (data) save(data);
                }
                uaHandler.initializeCache(data, 'dnd5e.rollAbilitySave', callback);
            }
        })
        Hooks.on("dnd5e.rollAttack", async (item, roll) => {
            if (item.hasAreaTarget) return; 
            postHit(await getRequiredData({item, actor: item.actor, workflow: item, rollAttackHook: {item, roll}}))  
        })
        Hooks.on("dnd5e.rollDamage", async (item, roll) => {
            if (item.hasAreaTarget) return;
            damage(await getRequiredData({item, actor: item.actor, workflow: item, rollDamageHook: {item, roll}}))
        })
        Hooks.on('dnd5e.useItem', async (item, config, options) => {
            if (item?.hasAreaTarget || item.hasAttack || item.hasDamage) return;
            useItem(await getRequiredData({item, actor: item.actor, workflow: item, useItemHook: {item, config, options}}))
        })
    }
    Hooks.on("createMeasuredTemplate", async (template, data, userId) => {
        if (userId !== game.user.id) { return };
        templateAnimation(await getRequiredData({itemUuid: template.flags?.dnd5e?.origin, templateData: template, workflow: template, isTemplate: true}))
    })
    async function attack(data) {
        data.actionType = data.item.system.actionType;
        data.itemType = data.item.type;
        getInfo(data);
        if (data.itemType === 'spell') {
            data.spellSchool = data.item.system?.school;
        }
        debug('End of attack function');
        await uaHandler.initialize(data, 'attack');
    }
    async function postHit(data) {
        data.actionType = data.item.system.actionType;
        data.itemType = data.item.type;
        getInfo(data);
        getOutcome(data);
        await uaHandler.initialize(data, 'postHit');
    }
    async function damage(data) {
        data.actionType = data.item.system.actionType;
        data.itemType = data.item.type;
        getInfo(data);
        getOutcome(data);
        await uaHandler.initialize(data, 'damage');
    }
    async function save(saveData) {
        saveData.actionType = saveData.item.system.actionType;
        saveData.itemType = saveData.item.type;
        if (saveData.itemType === 'spell') {
            saveData.spellSchool = saveData.item.system?.school;
        }
        getInfo(saveData);
        await uaHandler.initialize(saveData, 'save')
    }
    function useItem() {
        // currently does nothing, probably won't be used. Left over from AA
    }
    function getWorkflowData(workflow) {
        return {
            'id': game.time.serverTime,
            'item': workflow.item,
            'token': workflow?.rangeDetails?.attackingToken ?? workflow.token,
            'targets': Array.from(workflow.targets),
            'workflow': workflow    
        }
    }
    function hasProperties(itemProperties, wantedProperties) {
        if (foundry.utils.isNewerVersion(game.system.version, '2.4.1')) {
            return Array.from(itemProperties).some(k => wantedProperties.includes(k));
        } else {
            return Object.entries(data.item.system?.properties).some(([k, v]) => wantedProperties.includes(k) && v === true);
        }
    }
    function getInfo(data) { // Gets properties that are used within animations
        // 3.0.2 vs 2.4.1
        if (foundry.utils.isNewerVersion(game.system.version, '2.4.1')) {
            data.isRitual = data.item.system?.properties.has('ritual') ? true : false;
            if (data.item.system?.type?.baseItem) data.baseItem = data.item.system.type.baseItem;
            if (data.item.system?.properties?.has('fir')) firearm(data)
            data.hasAmmunition = data.item.system?.properties.has('amm');
        } else {
            data.isRitual = data.item.system?.components?.ritual;
            if (data.item.system?.baseItem) data.baseItem = data.item.system.baseItem;
            if (data.item.system?.properties?.fir) firearm(data);
            data.hasAmmunition = data.item.system?.properties?.amm;
        }
        function firearm(data) {
            if (data.item.system?.damage?.parts[0][0].charAt(0) == 1) data.baseItem = 'firearmRenaissance';
            else if (data.item.system?.damage?.parts[0][0].charAt(0) == 2) data.baseItem = 'firearmModern';
            else if (['necrotic', 'radiant'].includes(data.item.system?.damage?.parts[0][1])) data.baseItem = 'firearmFuturistic';
        }
        data.properties = data.item.system?.properties;
        if (data.item.system?.rarity) data.itemRarity = data.item.system.rarity;
        if (data.hasAmmunition && data.item.system?.consume?.target) getAmmoInfo(data);
        let conditions = new Set();
        function getConditions(e) {
            Object.keys(defaultPreferences.conditionAbrevs).forEach(c => {
                if ([e?.name ? e.name.toLowerCase() : e?.label.toLowerCase()].includes(c)) conditions.add(c)
            });
            e.changes.filter(ch => ['StatusEffect', 'StatusEffectLabel', 'macro.CE'].includes(ch.key)).forEach(ch =>  Object.keys(defaultPreferences.conditionAbrevs).forEach(c => {
                if (ch.value.toLowerCase().includes(c)) conditions.add(c);
            }));
        }
        data.item?.effects.forEach(e => getConditions(e));
        data?.ammo?.item?.effects.forEach(e => getConditions(e));
        data.conditions = conditions;
        if (data.item.hasDamage) {
            let damageFlavors = [];
            for (let i = 0; data.item.system.damage.parts.length > i; i++) {
                let flavor = data.item.system.damage.parts[i][1];
                if (damageFlavors.includes(flavor?.toLowerCase()) === false && !constants.nonDamageTypes.includes(flavor?.toLowerCase())) damageFlavors.push(flavor);
            }
            data.damageFlavors = damageFlavors;
            if (data.item.system?.formula) {
                data.otherDamageFlavors = Object.keys(defaultPreferences.glows).filter(i => data.item.system.formula.includes(i));
                data.otherDamageHalfDamage = data.item.system.flags?.midiProperties?.halfdam ?? false
            }
        }
        if (data.itemType === 'weapon') data.willGlow ??= data?.damageFlavors?.length > 1 ? true : data?.otherDamageFlavors ? true : hasProperties(data.item.system?.properties, ['ada', 'mgc', 'sil']) ? true : data.item.system?.rarity ? true : false;
    }
    async function getOutcome(data) {
        data.hitTargetsIds = [];
        if (game.modules.get('midi-qol')?.active) {
            data.isCritical = data.workflow.isCritical;
            data.hitTargetsIds = Array.from(data.workflow.hitTargets).map(token => token.id);
        } else {
            if (data?.rollAttackHook?.roll?.isCritical || data?.rollDamageHook?.roll?.isCritical) data.isCritical = true;
            for (let i of data.targets) {
                if (data?.rollAttackHook?.roll?.total ?? 100 >= i.actor.system.attributes.ac.value) data.hitTargetsIds.push(i.id);
            }
        }
    }
    function getAmmoInfo (data) {
        let ammoItem = data.token.actor.items.get(data.item.system?.consume?.target);
        if (!ammoItem) return;
        data.ammo = {
            'name': ammoItem.name,
            'item': ammoItem,
            'attackBonus': ammoItem.system.attackBonus,
            'properties': ammoItem.system.properties,
            'rarity': ammoItem.system.rarity,
            'save': ammoItem.system.save,
            'ammoType': null
        }
        switch (data.baseItem) {
            case 'lightcrossbow':
            case 'handcrossbow':
            case 'heavycrossbow':
                data.ammoType = 'bolt'
                break;
            case 'shortbow':
            case 'longbow':
                data.ammoType = 'arrow'
                break;
            case 'firearmRenaissance':
                data.ammoType = 'bullet02'
                break;
            case 'firearmModern':
                data.ammoType = 'bullet01'
                break;
            case 'firearmFuturistic':
                data.ammoType = 'lasershot'
                break;
        }
        if (ammoItem.hasDamage) {
            let damageFlavors = [];
            for (let i = 0; data.item.system.damage.parts.length > i; i++) {
                let flavor = data.item.system.damage.parts[i][1];
                if (damageFlavors.includes(flavor.toLowerCase()) === false && !constants.nonDamageTypes.includes(flavor.toLowerCase())) damageFlavors.push(flavor);
            }
            data.ammo.damageFlavors = damageFlavors;
        }
        data.willGlow ??= data.ammo?.damageFlavors?.length > 1 ? true : hasProperties(ammoItem.system?.properties, ['ada', 'mgc', 'sil']) ? true : ammoItem.system?.rarity ? true : false;
    }
    function templateAnimation(data) {
        // Currently does nothing, I've got to think about what to do with templates. Suggestions welcome.
    }
}
