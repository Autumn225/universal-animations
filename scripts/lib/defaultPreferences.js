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
const conditionsFull = {
    'blinded': {
        'StatusEffect': [
            'blind',
            'Convenient Effect: Blinded'
        ],
        'macro.CE': 'Blinded',
        'label': 'Blind'
    },
    'charmed': {
        'StatusEffect': [
            'charmed',
            'Convient Effect: Charmed'
        ],
        'macro.CE': 'Charmed',
        'label': 'Charmed'
    },
    'deafened': {
        'StatusEffect': [
            'deaf',
            'Convient Effect: Deafened'
        ],
        'macro.CE': 'Deafened',
        'label': 'Deaf'
    },
    'frightended': {
        'StatusEffect': [
            'fear',
            'Convient Effect: Frightened'
        ],
        'macro.CE': 'Frightened',
        'label': 'Frightened'
    },
    'grappled': {
        'StatusEffect': [
            'grappled',
            'Convient Effect: Grappled'
        ],
        'macro.CE': 'Grappled',
        'label': 'Grappled'
    },
    'incapacitated': {
        'StatusEffect': [
            'incapacitated',
            'Convient Effect: Incapacitated'
        ],
        'macro.CE': 'Incapacitated',
        'label': 'Incapacitated'
    },
    'invisible': {
        'StatusEffect': [
            'invisible',
            'Convient Effect: Invisible'
        ],
        'macro.CE': 'Invisible',
        'label': 'Invisible'
    },
    'paralyzed': {
        'StatusEffect': [
            'paralysis',
            'Convient Effect: Paralysis'
        ],
        'macro.CE': 'Paralyzed',
        'label': 'Paralyzed'
    },
    'petrified': {
        'StatusEffect': [
            'petrified',
            'Convient Effect: Petrified'
        ],
        'macro.CE': 'Petrified',
        'label': 'Petrified'
    },
    'poisoned': {
        'StatusEffect': [
            'poison',
            'Convient Effect: Poisoned'
        ],
        'macro.CE': 'Poisoned',
        'label': 'Poisoned'
    },
    'prone': {
        'StatusEffect': [
            'prone',
            'Convient Effect: Prone'
        ],
        'macro.CE': 'Prone',
        'label': 'Prone'
    },
    'restrained': {
        'StatusEffect': [
            'restrain',
            'Convient Effect: Restrained'
        ],
        'macro.CE': 'Restrained',
        'label': 'Restrained'
    },
    'stunned': {
        'StatusEffect': [
            'stun',
            'Convient Effect: Stunned'
        ],
        'macro.CE': 'Stunned',
        'label': 'Stunned'
    },
    'unconscious': {
        'StatusEffect': [
            'unconscious',
            'Convient Effect: Unconscious'
        ],
        'macro.CE': 'Unconscious',
        'label': 'Unconscious'
    },
}
export let defaultPreferences = {
    'spellSchools': spellSchools,
    'conditionAbrevs': conditionsAbrevs
}