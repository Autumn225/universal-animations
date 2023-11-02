const attacks = [
    'mwak',
    'rwak',
    'msak',
    'rsak'
];
const meleeAttacks = [
    'mwak',
    'msak'
];
const rangedAttacks = [
    'rwak',
    'rsak'
];
const weaponAttacks = [
    'mwak',
    'rwak'
];
const spellAttacks = [
    'msak',
    'rsak'
];
const nonDamageTypes = [
    'healing',
    'temphp',
    'midi-none'
];
function jb2aCheck () {
    return game.modules.get('jb2a_patreon')?.active ? 'patreon' : game.modules.get('JB2A_DnD5e')?.active ? 'free' : false;
}
export let constants = {
    'attacks': attacks,
    'meleeAttacks': meleeAttacks,
    'rangedAttacks': rangedAttacks,
    'weaponAttacks': weaponAttacks,
    'spellAttacks': spellAttacks,
    'nonDamageTypes': nonDamageTypes,
    'jb2aCheck': jb2aCheck
}