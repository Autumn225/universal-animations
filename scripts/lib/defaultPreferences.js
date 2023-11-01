const spellSchools = {
    'abj': {
        'name': 'abjuration',
        'color': 'blue'
    },
    'con': {
        'name': 'conjuration',
        'color': 'yellow'
    },
    'div': {
        'name': 'divination',
        'color': 'blue'
    },
    'enc': {
        'name': 'enchantment',
        'color': 'pink'
    },
    'evo': {
        'name': 'evocation',
        'color': 'red'
    },
    'ill': {
        'name': 'illusion',
        'color': 'purple'
    },
    'nec': {
        'name': 'necromancy',
        'color': 'green'
    },
    'trs': {
        'name': 'transmutation',
        'color': 'yellow'
    }
};
const conditionsAbrevs = { // Some are named weird to account for base system status effects names
    'blind': {
        'file': 'jb2a.markers.light_orb.complete.blue',
        'fade': false
    },
    'charmed': {
        'file': 'jb2a.markers.heart.pink.01',
        'fade': true
    },
    'deaf': {
        'file': 'jb2a.markers.mute.dark_red.01',
        'fade': true
    },
    'frightened': {
        'file': 'jb2a.markers.fear.dark_purple.01',
        'fade': true
    },
    'fear': { // Yes this is the same thing, yes base system status effects are stupid
        'file': 'jb2a.markers.fear.dark_purple.01',
        'fade': true
    },
    'grappled': {
        'file': 'jb2a.melee_generic.whirlwind.01.orange.0',
        'fade': false
    },
    'incapacitated': {
        'file': 'jb2a.markers.chain.spectral_standard.complete.02.blue',
        'fade': false
    },
    'paraly': {
        'file': 'jb2a.markers.horror.purple.01',
        'fade': true
    },
    'petrified': {
        'file': 'jb2a.markers.skull.dark_orange.01',
        'fade': true
    },
    'poison': {
        'file': 'jb2a.markers.poison.dark_green.01',
        'fade': true
    },
    'prone': {
        'file': 'jb2a.markers.shield_cracked.purple.01',
        'fade': true
    },
    'restrain': {
        'file': 'jb2a.markers.chain.standard.complete.02.red',
        'fade': false
    },
    'stun': {
        'file': 'jb2a.markers.stun.purple.01',
        'fade': true
    },
    'unconscious': {
        'file': 'jb2a.swirling_sparkles.01.blue',
        'fade': false
    }
}
const baseWeapons = {
    'club': {
        'animations': [
            'jb2a.club.melee.01.white.0',
            'jb2a.club.melee.01.white.1',
            'jb2a.club.melee.01.white.2',
            'jb2a.club.melee.01.white.3',
            'jb2a.club.melee.01.white.4',
            'jb2a.club.melee.01.white.5'
        ]
    },
    'dagger': {
        'animations': {
            'melee': ['jb2a.dagger.melee.02.white'],
            'ranged': ['jb2a.dagger.throw.01.white']
        }
    },
    'greatclub': {
        'animations': ['jb2a.greatclub.standard.white']
    },
    'handaxe': {
        'animations': {
            'melee': ['jb2a.handaxe.melee.standard.white'],
            'ranged': ['jb2a.throwable.launch.cannon_ball.01.black'], // Needs patreon options'
        }
    },
    'javelin': {
        'animations': {
            'ranged': ['jb2a.arrow.physical.white.01'], // Needs patreon options
            'melee': [
                'jb2a.spear.melee.01.white.0',
                'jb2a.spear.melee.01.white.1', // Needs patreon options
                'jb2a.spear.melee.01.white.2',
                'jb2a.spear.melee.01.white.3',
                'jb2a.spear.melee.01.white.4',
                'jb2a.spear.melee.01.white.5'
            ]
        }
    },
    'lighthammer': {
        'animations': {
            'ranged': ['jb2a.throwable.launch.cannon_ball.01.black'], // Needs patreon options
            'melee': [
                'jb2a.spear.melee.01.white.0',
                'jb2a.spear.melee.01.white.1',
                'jb2a.spear.melee.01.white.2',
                'jb2a.spear.melee.01.white.3',
                'jb2a.spear.melee.01.white.4',
                'jb2a.spear.melee.01.white.5'
            ]
        }
    },
    'mace': {
        'animations': [
            'jb2a.mace.melee.01.white.0',
            'jb2a.mace.melee.01.white.1',
            'jb2a.mace.melee.01.white.2',
            'jb2a.mace.melee.01.white.3',
            'jb2a.mace.melee.01.white.4',
            'jb2a.mace.melee.01.white.5'
        ]
    },
    'quarterstaff': {
        'animations': [
            'jb2a.quarterstaff.melee.01.white.0',
            'jb2a.quarterstaff.melee.01.white.1',
            'jb2a.quarterstaff.melee.01.white.2',
            'jb2a.quarterstaff.melee.01.white.3',
            'jb2a.quarterstaff.melee.01.white.4',
            'jb2a.quarterstaff.melee.01.white.5'
        ]
    },
    'sickle': {
        'animations': [
            'jb2a.melee_attack.01.sickle.01.0',
            'jb2a.melee_attack.01.sickle.01.1',
            'jb2a.melee_attack.01.sickle.01.2',
            'jb2a.melee_attack.01.sickle.01.3'
        ]
    },
    'spear': {
        'animations': {
            'ranged': ['jb2a.arrow.physical.white.01'], // Needs patreon options
            'melee': [
                'jb2a.spear.melee.01.white.0',
                'jb2a.spear.melee.01.white.1',
                'jb2a.spear.melee.01.white.2',
                'jb2a.spear.melee.01.white.3',
                'jb2a.spear.melee.01.white.4',
                'jb2a.spear.melee.01.white.5'
            ]
        }
    },
    'battleaxe': {
        'animations': [
            'jb2a.melee_attack.02.battleaxe.01.0',
            'jb2a.melee_attack.02.battleaxe.01.1',
            'jb2a.melee_attack.02.battleaxe.01.2',
            'jb2a.melee_attack.02.battleaxe.01.3'
        ]
    }, // No flail animation
    'glaive': {
        'animations': [
            'jb2a.glaive.melee.01.white.0',
            'jb2a.glaive.melee.01.white.1',
            'jb2a.glaive.melee.01.white.2',
            'jb2a.glaive.melee.01.white.3',
            'jb2a.glaive.melee.01.white.4',
            'jb2a.glaive.melee.01.white.5'
        ]
    },
    'greataxe': {
        'animations': ['jb2a.greataxe.melee.standard.white']
    },
    'greatsword': {
        'animations': ['jb2a.greatsword.melee.standard.white']
    },
    'halberd': {
        'animations': [
            'jb2a.halberd.melee.01.white.0',
            'jb2a.halberd.melee.01.white.1',
            'jb2a.halberd.melee.01.white.2',
            'jb2a.halberd.melee.01.white.3',
            'jb2a.halberd.melee.01.white.4',
            'jb2a.halberd.melee.01.white.5'
        ]
    }, // No lance animationsword
    'longsword': {
        'animations': [
            'jb2a.sword.melee.01.white.0',
            'jb2a.sword.melee.01.white.1',
            'jb2a.sword.melee.01.white.2',
            'jb2a.sword.melee.01.white.3',
            'jb2a.sword.melee.01.white.4',
            'jb2a.sword.melee.01.white.5'
        ]
    },
    'maul': {
        'animations': ['jb2a.maul.melee.standard.white']
    },
    'morningstar': { // No morningstar animation, substitute mace
        'animations': [
            'jb2a.mace.melee.01.white.0',
            'jb2a.mace.melee.01.white.1',
            'jb2a.mace.melee.01.white.2',
            'jb2a.mace.melee.01.white.3',
            'jb2a.mace.melee.01.white.4',
            'jb2a.mace.melee.01.white.5'
        ]
    },
    'pike': { // No pike animation, substitue pike
        'animations': [
            'jb2a.spear.melee.01.white.0',
            'jb2a.spear.melee.01.white.1',
            'jb2a.spear.melee.01.white.2',
            'jb2a.spear.melee.01.white.3',
            'jb2a.spear.melee.01.white.4',
            'jb2a.spear.melee.01.white.5'
        ]
    },
    'rapier': {
        'animations': [
            'jb2a.rapier.melee.01.white.0',
            'jb2a.rapier.melee.01.white.1',
            'jb2a.rapier.melee.01.white.2',
            'jb2a.rapier.melee.01.white.3',
            'jb2a.rapier.melee.01.white.4',
            'jb2a.rapier.melee.01.white.5'
        ]
    },
    'scimitar': {
        'animations': [
            'jb2a.scimitar.melee.01.white.0',
            'jb2a.scimitar.melee.01.white.1',
            'jb2a.scimitar.melee.01.white.2',
            'jb2a.scimitar.melee.01.white.3',
            'jb2a.scimitar.melee.01.white.4',
            'jb2a.scimitar.melee.01.white.5'
        ]
    },
    'shortsword': {
        'animations': [
            'jb2a.shortsword.melee.01.white.0',
            'jb2a.shortsword.melee.01.white.1',
            'jb2a.shortsword.melee.01.white.2',
            'jb2a.shortsword.melee.01.white.3',
            'jb2a.shortsword.melee.01.white.4',
            'jb2a.shortsword.melee.01.white.5'
        ]
    },
    'trident': {
        'moveTowards': true,
        'animations': ['jb2a.spiritual_weapon.trident.01.spectral.02.green']
    }, // No animation for war pick
    'warhammer': {
        'animations': [
            'jb2a.warhammer.melee.01.white.0',
            'jb2a.warhammer.melee.01.white.1',
            'jb2a.warhammer.melee.01.white.2',
            'jb2a.warhammer.melee.01.white.3',
            'jb2a.warhammer.melee.01.white.4',
            'jb2a.warhammer.melee.01.white.5'
        ]
    },
    'whip': { // No animation for whip, substitute generic animation
        'animations': ['jb2a.melee_generic.slash.01.orange.0']
    }
}
export let defaultPreferences = {
    'spellSchools': spellSchools,
    'conditionAbrevs': conditionsAbrevs,
    'baseWeapons': baseWeapons
}