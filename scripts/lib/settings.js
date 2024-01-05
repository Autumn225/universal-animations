let prototypeSetting = {
    'name': 'prototypeSetting',
    'call': 'attack, postHit, damage, save',
    'actionType': ['mwak', 'msak', 'rwak', 'rsak', 'util', 'save', 'heal', 'other'],
    'itemType': 'spell, weapon',
    'requirements': {'data.isRitual': true},
    'targetType': 'single, multiple at once, multiple in sucession',
    'async': true,
    'timeout': 1000,
    'effects': [
        {
            'files': 'string, array of strings',
            'fileUsage': 'single, multiple, random',
            'atLocation': 'data.token',
            'belowTokens': false,
            'delay': 0,
            'duration': '',
            'fadeIn': 0,
            'fadeOut': 0,
            'filter': ['ColorMatrix', 'colorMatrix()'],
            'missed': false,
            'opacity': 1,
            'scaleIn': '',
            'scaleOut': '',
            'scaleToObject': 1,
            'startTime': 0,
            'stretchTo': '',
            'playbackRate': 1,
            'waitUntilFinished': false
        }
    ]
}

let defaultSettings = [
    {
        'name': 'spellAttackCast',
        'call': 'attack',
        'actionType': ['msak', 'rsak'],
        'itemType': 'spell',
        'requirements': '',
        'targetType': 'single',
        'async': true,
        'effects': [
            {
                'files': 'jb2a.cast_generic.01.yellow.0',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'filter': ['ColorMatrix', '`jb2a.cast_generic.01.yellow.0`, data.spellSchool'],
                'scaleToObject': 1.25,
                'playbackRate': 0.75,
                'waitUntilFinished': true
            }
        ]
    },
    {
        'name': 'ritualCast',
        'call': 'attack',
        'actionType': ['mwak', 'msak', 'rwak', 'rsak', 'util', 'save', 'heal', 'other'],
        'itemType': 'spell',
        'requirements': {'data.isRitual': true},
        'targetType': 'single',
        'effects': [
            {
                'files': 'jb2a.particles.outward.greenyellow.02.01',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'delay': 500,
                'duration': 5500,
                'fadeIn': 3000,
                'fadeOut': 2000,
                'filter': ['ColorMatrix', '`jb2a.particles.outward.greenyellow.02.01`, data.spellSchool'],
                'opacity': 0.5,
                'scaleIn': (0, 2000),
                'scaleToObject': 3,
                'playbackRate': 0.8,
            },
            {
                'files': '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.intro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'belowTokens': true,
                'scaleToObject': 2.5,
                'playbackRate': 1,
                'waitUntilFinished': -1000
            },
            {
                'files': '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'belowTokens': true,
                'scaleToObject': 2.5,
                'playbackRate': 1,
            }
        ]
    },
    {
        'name': 'cast',
        'call': 'attack',
        'actionType': ['mwak', 'rwak', 'util', 'save', 'heal', 'other'],
        'itemType': 'spell',
        'targetType': 'single',
        'requirements': {'data.isRitual': false},
        'async': true,
        'effects': [
            {
                'files': 'jb2a.cast_generic.02.blue.0',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'filter': ['ColorMatrix', '`jb2a.cast_generic.02.blue.0`, data.spellSchool'],
                'scaleToObject': 1.25,
                'playbackRate': 0.75,
                'waitUntilFinished': true
            }
        ]
    },
    {
        'name': 'saveCast',
        'call': 'attack',
        'actionType': ['save'],
        'itemType': 'spell',
        'targetType': 'multiplePreLoop',
        'timeout': 1250,
        'effects': [
            {
                'files': 'jb2a.energy_strands.range.standard.purple.04',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'filter': ['ColorMatrix', '`jb2a.energy_strands.range.standard.purple.04`, data?.damageFlavors?.[0] ?? data.spellSchool'],
                'stretchTo': 'i, {offset: {x: -0.5}, local: true, gridUnits: true}',
                'playbackRate': 1,
            },
            {
                'files': 'jb2a.energy_strands.in.green.01.0',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 500,
                'filter': ['ColorMatrix', '`jb2a.energy_strands.in.green.01.0`, data?.damageFlavors?.[0] ?? data.spellSchool'],
                'scaleToObject': 1.5,
                'playbackRate': 1,
            }
        ]
    },
    {
        'name': 'utilityCast',
        'call': 'attack',
        'actionType': ['util', 'other'],
        'itemType': 'spell',
        'requirements': {'data?.targets?.length > 0': true},
        'targetType': 'multiple',
        'effects': [
            {
                'files': '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.intro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                'fileUsage': 'single',
                'atLocation': 'i',
                'belowTokens': true,
                'scaleToObject': 1.5,
                'playbackRate': 1,
                'waitUntilFinished': -1000
            },
            {
                'files': '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                'fileUsage': 'single',
                'atLocation': 'i',
                'belowTokens': true,
                'scaleToObject': 1.5,
                'playbackRate': 1,
            }
        ]
    },
    {
        'name': 'conditionCast',
        'call': 'attack',
        'actionType': ['util', 'other'],
        'itemType': 'spell',
        'requirements': {'data?.targets?.length > 0': true, 'data?.conditions?.size > 0': true},
        'targetType': 'multipleLoopOf',
        'loopOf': 'data.conditions',
        'effects': [
            {
                'files': 'defaultPreferences.conditionAbrevs[condition].file',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 500,
                'duration': 'defaultPreferences.conditionAbrevs[condition].fade === true ? 5500 : false',
                'fadeIn': 'defaultPreferences.conditionAbrevs[condition].fade === true ? 3000 : false',
                'fadeOut': 'defaultPreferences.conditionAbrevs[condition].fade === true ? 2000 : false',
                'scaleToObject': 1.5,
                'playbackRate': 'defaultPreferences.conditionAbrevs[condition].fade === true ? 0.8 : 1',
            }
        ]
    },
    {
        'name': 'utilityFriendlyCast',
        'call': 'attack',
        'actionType': ['util', 'other'],
        'itemType': 'spell',
        'requirements': {'data?.targets?.length > 0': true, 'i.document.disposition === data.token.document.disposition': 'afterLoop'},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.markers.bubble.intro.blue',
                'fileUsage': 'single',
                'atLocation': 'i',
                'filter': ['ColorMatrix', '`jb2a.markers.bubble.intro.blue`, data.spellSchool'],
                'scaleToObject': 1,
                'playbackRate': 0.8,
                'waitUntilFinished': -1000
            },
            {
                'files': 'jb2a.markers.bubble.outro.blue',
                'fileUsage': 'single',
                'atLocation': 'i',
                'filter': ['ColorMatrix', '`jb2a.markers.bubble.outro.blue`, data.spellSchool'],
                'scaleToObject': 1,
                'playbackRate': 0.8,
            }
        ]
    },
    {
        'name': 'utilityCastHostile',
        'call': 'attack',
        'actionType': ['util', 'other'],
        'itemType': 'spell',
        'requirements': {'data?.targets?.length > 0': true, 'i.document.disposition != data.token.document.disposition': 'afterLoop'},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.markers.runes03.dark_orange.01',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 500,
                'duration': 5500,
                'fadeIn': 3000,
                'fadeOut': 2000,
                'filter': ['ColorMatrix', '`jb2a.markers.runes03.dark_orange.01`, data.spellSchool'],
                'scaleToObject': 1.5,
                'playbackRate': 0.8,
            }
        ]
    },
    {
        'name': 'meleeSpellAttack',
        'call': 'attack',
        'actionType': ['mwak', 'msak', 'rwak', 'rsak', 'util', 'other'],
        'itemType': 'spell',
        'requirements': {'data.distance <= 5': true},
        'targetType': 'multiplePostLoop',
        'timeout': 750,
        'effects': [
            {
                'files': 'jb2a.cast_generic.fire.side01.orange.0',
                'fileUsage': 'single',
                'anchor': {'x': 0.15},
                'atLocation': 'i, {local: true, gridUnits: true}',
                'filter': ['ColorMatrix', '`jb2a.cast_generic.fire.side01.orange.0`, data.spellSchool'],
                'rotateTowards': 'data.token',
                'scaleToObject': 2,
                'playbackRate': 1,
            }
        ]
    },
    {
        'name': 'rangedSpellAttack',
        'call': 'postHit',
        'actionType': ['msak', 'rsak'],
        'itemType': 'spell',
        'requirements': {'data?.distance > 5': true},
        'targetType': 'multiple',
        'timeout': 250,
        'effects': [
            {
                'files': 'jb2a.template_line_piercing.generic.01.orange.15ft',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'filter': ['ColorMatrix', '`jb2a.template_line_piercing.generic.01.orange.15ft`, data?.damageFlavors[0]'],
                'missed': '!(data.hitTargetsIds.includes(i.id))',
                'stretchTo': ['i', '{offset: {x: -0.5}, local: true, gridUnits: true}'],
                'playbackRate': 0.75,
                'waitUntilFinished': -400
            }
        ]
    },
    {
        'name': 'healDamage',
        'call': 'damage',
        'actionType': ['heal'],
        'itemType': 'spell',
        'targetType': 'multiplePreLoop',
        'async': true,
        'timeout': 'resolve',
        'effects': [
            {
                'files': 'jb2a.energy_strands.in.green.01.2',
                'fileUsage': 'single',
                'atLocation': 'i',
                'filter': ['ColorMatrix', '`jb2a.energy_strands.in.green.01.0`, data.spellSchool'],
                'scaleToObject': 2,
                'playbackRate': 1,
                'waitUntilFinished': -300
            },
            {
                'files': 'jb2a.healing_generic.burst.greenorange',
                'fileUsage': 'single',
                'atLocation': 'i',
                'filter': ['ColorMatrix', '`jb2a.energy_strands.in.green.01.0`, data.spellSchool'],
                'scaleToObject': 2.5,
                'playbackRate': 1,
                'waitUntilFinished': -2000
            },
            {
                'files': 'jb2a.energy_field.02.above.blue',
                'fileUsage': 'single',
                'atLocation': 'i',
                'duration': 2300,
                'filter': ['ColorMatrix', '`jb2a.energy_field.02.above.blue`, data.spellSchool'],
                'scaleToObject': 1,
                'startTime': 1200,
                'playbackRate': 2.5,
            }
        ]
    },
    {
        'name': 'spellAttackDamage',
        'call': 'damage',
        'actionType': ['msak', 'rsak'],
        'itemType': 'spell',
        'requirements': {'data.hitTargetsIds.includes(i.id)': 'postLoop'},
        'targetType': 'multiple',
        'async': true,
        'timeout': 'resolve',
        'effects': [
            {
                'files': 'jb2a.impact.010.orange',
                'fileUsage': 'single, multiple, random',
                'atLocation': 'i',
                'filter': ['ColorMatrix', '`jb2a.impact.010.orange`, data?.damageFlavors[0]'],
                'scaleToObject': 2,
                'playbackRate': 0.5,
                'waitUntilFinished': -500
            }
        ]
    },
    {
        'name': 'spellAttackDamageCritical',
        'call': 'damage',
        'actionType': ['msak', 'rsak'],
        'itemType': 'spell',
        'requirements': {'data.isCritical': true, 'data.hitTargetsIds.includes(i.id)': 'postLoop'},
        'targetType': 'multiple',
        'async': true,
        'timeout': 'resolve',
        'effects': [
            {
                'files': 'jb2a.impact.006.yellow',
                'fileUsage': 'single, multiple, random',
                'atLocation': 'i',
                'filter': ['ColorMatrix', '`jb2a.impact.006.yellow`, data?.damageFlavors[0]'],
                'scaleToObject': 3.5,
                'playbackRate': 0.65,
            }
        ]
    },
    {
        'name': 'saveFail',
        'call': 'save',
        'actionType': ['save'],
        'itemType': 'spell',
        'requirements': {'data.outcome': false},
        'targetType': 'single',
        'effects': [
            {
                'files': '`jb2a.magic_signs.rune.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.intro.` + defaultPreferences.spellSchools[data.spellSchool].color;',
                'fileUsage': 'single',
                'atLocation': 'data.targets[0]',
                'delay': 200,
                'scaleToObject': 1,
                'playbackRate': 0.75,
            },
            {
                'files': '`jb2a.magic_signs.rune.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color;',
                'fileUsage': 'single',
                'atLocation': 'data.targets[0]',
                'delay': 1500,
                'scaleToObject': 1,
                'playbackRate': 0.75,
            }
        ]
    },
    {
        'name': 'saveSuceed',
        'call': 'save',
        'actionType': ['save'],
        'itemType': 'spell',
        'requirements': {'data.outcome': true},
        'targetType': 'single',
        'effects': [
            {
                'files': 'jb2a.energy_field.02.above.blue',
                'fileUsage': 'single',
                'atLocation': 'data.targets[0]',
                'duration': 3000,
                'filter': ['ColorMatrix', '`jb2a.energy_field.02.above.blue`, data.spellSchool'],
                'scaleToObject': 1,
                'startTime': 1200,
                'playbackRate': 2,
            }
        ]
    }
]

export let settings = {
    'protypeSetting': prototypeSetting,
    'defaultSettings': defaultSettings
}