import { uaHandler } from '../../handlers/uaHandler.js';
import { getRequiredData } from '../getRequiredData.js';
import * as constantsIndex from '../indexConstants.js';
import * as preferencesIndex from '../indexPreferences.js';
import { debug } from '../../lib/debugger.js';

let defaultPreferences = preferencesIndex['dnd5e'].defaultPreferences;
let constants = constantsIndex['dnd5e'].constants;

export function systemHooks() {
    if (game.modules.get('midi-qol')?.active) {
        Hooks.on('midi-qol.postPreambleComplete', async (workflow) => {
            debug('Hook caught for midi-qol.postPreambleComplete');
            await attack(getWorkflowData(workflow));
        });
        Hooks.on('midi-qol.AttackRollComplete', async (workflow) => {
            debug('Hook caught for midi-qol.AttackRollComplete');
            if (workflow.activity.item?.hasAreaTarget) return;
            await postHit(getWorkflowData(workflow));
        });
        Hooks.on('midi-qol.DamageRollComplete', async (workflow) => { 
            debug('Hook caught for midi-qol.DamageRollComplete');
            if (workflow.activity.item?.hasAreaTarget) return;
            await damage(getWorkflowData(workflow));
        });
        Hooks.on('midi-qol.postCheckSaves', async (workflow) => {
            debug('Hook caught for post midi-qol.postCheckSaves');
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
    } else {
        Hooks.on('dnd5e.preUseActivity', async (activity, options) => {
            debug('DND attack');
            let data = await getRequiredData({activity, item: activity.item, actor: activity.item.actor, workflow: activity.item});
            attack(data);
            if (activity.item.system.hasSave === true) { // Save from ammo doesn't work without midi. // No idea if this works
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
        });
        Hooks.on('dnd5e.rollAttack', async (roll, {subject: activity, ammoUpdate}) => {
            debug('DND postHit');
            if (activity.item.hasAreaTarget) return; 
            postHit(await getRequiredData({activity, item: activity.item, actor: activity.item.actor, workflow: activity.item, rollAttackHook: {activity, item: activity.item, roll}}));  
        });
        Hooks.on('dnd5e.rollDamage', async (roll, {subject: activity}) => {
            debug('DND damage');
            if (activity.item.hasAreaTarget) return;
            damage(await getRequiredData({activity, item: activity.item, actor: activity.item.actor, workflow: activity.item, rollAttackHook: {activity, item: activity.item, roll}}));
        });
    }
    Hooks.on('createMeasuredTemplate', async (template, data, userId) => {
        if (userId !== game.user.id) { return; };
        templateAnimation(await getRequiredData({itemUuid: template.flags?.dnd5e?.origin, templateData: template, workflow: template, isTemplate: true}));
    });
    async function attack(data) {
        data.actionType = data.activity.actionType;
        data.itemType = data.item.type;
        getInfo(data);
        if (data.itemType === 'spell') {
            data.spellSchool = data.item.system?.school;
        }
        debug('End of attack function');
        await uaHandler.initialize(data, 'attack');
    }
    async function postHit(data) {
        data.actionType = data.activity.actionType;
        data.itemType = data.item.type;
        getInfo(data);
        getOutcome(data);
        await uaHandler.initialize(data, 'postHit');
    }
    async function damage(data) {
        data.actionType = data.activity.actionType;
        data.itemType = data.item.type;
        getInfo(data);
        getOutcome(data);
        await uaHandler.initialize(data, 'damage');
    }
    async function save(saveData) {
        saveData.actionType = saveData.activity.actionType;
        saveData.itemType = saveData.item.type;
        if (saveData.itemType === 'spell') {
            saveData.spellSchool = saveData.item.system?.school;
        }
        getInfo(saveData);
        await uaHandler.initialize(saveData, 'save');
    }
    function getWorkflowData(workflow) {
        return {
            id: game.time.serverTime,
            activity: workflow.activity,
            item: workflow.activity.item,
            token: workflow?.rangeDetails?.attackingToken ?? workflow.token,
            targets: Array.from(workflow.targets),
            workflow: workflow    
        };
    }
    function hasProperties(itemProperties, wantedProperties, item) {
        if (foundry.utils.isNewerVersion(game.system.version, '2.4.1')) {
            return Array.from(itemProperties).some(k => wantedProperties.includes(k));
        } else {
            return Object.entries(item.system?.properties).some(([k, v]) => wantedProperties.includes(k) && v === true);
        }
    }
    function getInfo(data) { // Gets properties that are used within animations
        data.isRitual = data.item.system?.properties.has('ritual') ? true : false;
        if (data.item.system?.type?.baseItem) data.baseItem = data.item.system.type.baseItem;
        if (data.item.system?.properties?.has('fir')) firearm(data);
        data.hasAmmunition = data.item.system?.properties.has('amm');
        function firearm(data) {
            if (data.activity?.damage?.parts[0][0].charAt(0) == 1) data.baseItem = 'firearmRenaissance';
            else if (data.activity?.damage?.parts[0][0].charAt(0) == 2) data.baseItem = 'firearmModern';
            else if (['necrotic', 'radiant'].includes(data.activity?.damage?.parts[0][1])) data.baseItem = 'firearmFuturistic';
        }
        data.properties = data.item.system?.properties;
        if (data.item.system?.rarity) data.itemRarity = data.item.system.rarity;
        if (data.hasAmmunition && data.activity?.consumption?.targets[0]?.target) getAmmoInfo(data);
        let conditions = new Set();
        function getConditions(e) {
            Object.keys(defaultPreferences.conditionAbrevs).forEach(c => {
                if ([e?.name ? e.name.toLowerCase() : e?.label.toLowerCase()].includes(c) || e.statuses.has(c)) conditions.add(c);
            });
            e.changes.filter(ch => ['StatusEffect', 'StatusEffectLabel', 'macro.CE'].includes(ch.key)).forEach(ch =>  Object.keys(defaultPreferences.conditionAbrevs).forEach(c => {
                if (ch.value.toLowerCase().includes(c)) conditions.add(c);
            }));
        }
        data.activity?.effects?.map(i => i.effect).forEach(e => getConditions(e));
        data?.ammo?.item?.effects.forEach(e => getConditions(e));
        data.conditions = conditions;
        if (data.activity?.damage?.parts?.length) {
            let damageFlavors = new Set();
            for (let p of data.activity.damage.parts) {
                for (let f of p.types) {
                    if (!constants.nonDamageTypes.includes(f?.toLowerCase())) damageFlavors.add(f);
                }
            }
            data.damageFlavors = [...damageFlavors];
            if (data.item.system.activities.size > 1) {
                let otherActivities = Object.entries(data.item.system.activities.entries()).filter(([key, value]) => data.activity.id != key).map(([key, value]) => value);
                let otherActivitiesDamage = otherActivities.map(a => a?.damage?.parts?.map(p => [...p?.types ?? []]));
                if (otherActivitiesDamage.length) otherActivities = otherActivities.flatMap();
                data.otherDamageFlavors = Object.keys(defaultPreferences.glows).filter(i => otherActivitiesDamage.includes(i));
                data.otherDamageHalfDamage = otherActivities.some(a => a?.damage?.onSave === 'half');
            }
        }
        if (data.itemType === 'weapon') data.willGlow ??= data?.damageFlavors?.length > 1 ? true : data?.otherDamageFlavors ? true : hasProperties(data.item.system?.properties, ['ada', 'mgc', 'sil'], data.item) ? true : data.item.system?.rarity ? true : false;
        data.color = data?.ammo?.damageFlavors?.[1] ?? data?.damageFlavors?.[1] ?? data?.otherDamageFlavors?.[0] ?? data?.conditions?.first() ?? 'mgc';
        data.needsColor = data?.damageFlavors?.length > 1 || data?.ammo?.damageFlavors?.length > 0 || data?.otherDamageFlavors || data?.properties?.mgc === true || data?.properties?.has('mgc') || data?.ammo?.properties?.mgc === true || data?.ammo?.properties?.has('mgc') ? true : false;
        data.glowColor = data?.damageFlavors?.[1] ?? data?.otherDamageFlavors?.[0] ?? hasProperties(data.item.system?.properties, ['ada', 'sil'], data.item) ?? data.item.system?.rarity ?? 'mgc';
        if (data?.ammo) data.glowColor = data?.ammo?.damageFlavors?.[1] ?? hasProperties(data?.ammo?.properties, ['ada', 'sil'], data.item) ?? data?.ammo?.rarity ?? 'mgc';
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
        let ammoItem = data.token.actor.items.get(data.activity.consumption.targets[0].target);
        if (!ammoItem) return;
        data.ammo = {
            name: ammoItem.name,
            item: ammoItem,
            attackBonus: ammoItem.system.attackBonus,
            properties: ammoItem.system.properties,
            rarity: ammoItem.system.rarity,
            save: ammoItem.system.save,
            ammoType: null
        };
        switch (data.baseItem) {
            case 'lightcrossbow':
            case 'handcrossbow':
            case 'heavycrossbow':
                data.ammoType = 'bolt';
                break;
            case 'shortbow':
            case 'longbow':
                data.ammoType = 'arrow';
                break;
            case 'firearmRenaissance':
                data.ammoType = 'bullet02';
                break;
            case 'firearmModern':
                data.ammoType = 'bullet01';
                break;
            case 'firearmFuturistic':
                data.ammoType = 'lasershot';
                break;
        }
        if (ammoItem.hasDamage) {
            if (data.activity?.damage?.parts?.length) {
                let damageFlavors = new Set();
                for (let p of data.activity.damage.parts) {
                    for (let f of p.types) {
                        if (!constants.nonDamageTypes.includes(f?.toLowerCase())) damageFlavors.add(f);
                    }
                }
                data.ammo.damageFlavors = damageFlavors;
            }
        }
        data.willGlow ??= data.ammo?.damageFlavors?.length > 1 ? true : hasProperties(ammoItem.system?.properties, ['ada', 'mgc', 'sil'], ammoItem) ? true : ammoItem.system?.rarity ? true : false;
    }
    function templateAnimation(data) {
        // Currently does nothing, I've got to think about what to do with templates. Suggestions welcome.
    }
}
