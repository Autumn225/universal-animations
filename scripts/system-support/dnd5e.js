import { uaHandler } from "../handlers/ua-handler.js";
import { getRequiredData } from "./getRequiredData.js";
import { constants } from "../lib/constants.js";

export function systemHooks() {
    if (game.modules.get("midi-qol")?.active) {
        Hooks.on('midi-qol.preambleComplete', async (workflow) => {
            await attack(getWorkflowData(workflow));
        })
        Hooks.on("midi-qol.AttackRollComplete", async (workflow) => {
            if (workflow.item?.hasAreaTarget) return;
            await postHit(getWorkflowData(workflow));
        });
        Hooks.on("midi-qol.DamageRollComplete", async (workflow) => { 
            if (workflow.item?.hasAreaTarget) return;
            await damage(getWorkflowData(workflow));
        });
        Hooks.on('midi-qol.postCheckSaves', async (workflow) => {
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
        // Items with no Attack/Damage
        Hooks.on("midi-qol.RollComplete", (workflow) => {
            if (workflow.item?.hasAreaTarget || workflow.item?.hasAttack || workflow.item?.hasDamage) { return };
            useItem(getWorkflowData(workflow))
        });
    } else {
        Hooks.on("dnd5e.preDisplayCard", async (item, options) => {
            let data = await getRequiredData({item, actor: item.actor, workflow: item})
            attack(data);
            if (item.system.hasSave === true) {
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
        getDamageFlavors(data);
        if (data.itemType === 'spell') {
            data.spellSchool = data.item.system?.school;
        }
        await uaHandler.initialize(data, 'attack');
    }
    async function postHit(data) {
        data.actionType = data.item.system.actionType;
        data.itemType = data.item.type;
        getDamageFlavors(data);
        getOutcome(data);
        await uaHandler.initialize(data, 'postHit');
    }
    async function damage(data) {
        data.actionType = data.item.system.actionType;
        data.itemType = data.item.type;
        getDamageFlavors(data);
        getOutcome(data);
        await uaHandler.initialize(data, 'damage');
    }
    async function save(saveData) {
        saveData.actionType = saveData.item.system.actionType;
        saveData.itemType = saveData.item.type;
        if (saveData.itemType === 'spell') {
            saveData.spellSchool = saveData.item.system?.school;
        }
        getDamageFlavors(saveData);
        await uaHandler.initialize(saveData, 'save')
    }
    function useItem() {
        //currently does nothing
    }
    function getWorkflowData(workflow) {
        return {
            'id': game.time.serverTime,
            'item': workflow.item,
            'token': workflow.token,
            'targets': Array.from(workflow.targets),
            'workflow': workflow    
        }
    }
    function getDamageFlavors(data) {
        if (!data.item.hasDamage) return;
        let damageFlavors = [];
        for (let i = 0; data.item.system.damage.parts.length > i; i++) {
            let flavor = data.item.system.damage.parts[i][1];
            if (damageFlavors.includes(flavor.toLowerCase()) === false && !constants.nonDamageTypes.includes(flavor.toLowerCase())) damageFlavors.push(flavor);
        }
        data.damageFlavors = damageFlavors;
    }
    function getOutcome(data) {
        if (game.modules.get("midi-qol")?.active) {
            data.isCritical = data.workflow.isCritical;
            for (let i of data.targets) {
                for (let j of data.workflow.hitTargets) {
                    if (i == j) i.isHit = true;
                }
            }
        } else {
            if (data?.rollAttackHook?.roll?.isCritical || data?.rollDamageHook?.roll?.isCritical) data.isCritical = true;
            for (let i of data.targets) {
                i.isHit = data?.rollAttackHook?.roll?.total ?? 100 >= i.actor.system.attributes.ac.value;
            }
        }
    }
}