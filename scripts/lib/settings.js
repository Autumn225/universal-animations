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
            'anchor': {},
            'async': true,
            'atLocation': 'data.token or array w/ object',
            'belowTokens': false,
            'delay': 0,
            'duration': '',
            'endTime': 0,
            'endTimePerc': '',
            'fadeIn': 0,
            'fadeOut': 0,
            'filter': ['ColorMatrix', 'colorMatrix()'],
            'missed': false,
            'mirrorX': false,
            'mirrorY': false,
            'moveSpeed': '',
            'moveTowards': 'token or array',
            'opacity': 1,
            'rotateIn': 'array',
            'rotateTowards': 'string array w/ object',
            'scaleIn': '',
            'scaleOut': '',
            'scaleToObject': 1,
            'startTime': 0,
            'startTimePerc': '',
            'stretchTo': '',
            'timeRange': 'array',
            'playbackRate': 1,
            'waitUntilFinished': false,
            'zIndex': 10
        }
    ]
}

let defaultSettings = [ // Spells
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
                'filter': ['ColorMatrix', 'jb2a.cast_generic.01.yellow.0', 'data.spellSchool'],
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
                'filter': ['ColorMatrix', 'jb2a.particles.outward.greenyellow.02.01', 'data.spellSchool'],
                'opacity': 0.5,
                'scaleIn': (0, 2000),
                'scaleToObject': 3,
                'playbackRate': 0.8,
            },
            {
                'files': '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.intro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                'fileUsage': 'singleEval',
                'atLocation': 'data.token',
                'belowTokens': true,
                'scaleToObject': 2.5,
                'playbackRate': 1,
                'waitUntilFinished': -1000
            },
            {
                'files': '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                'fileUsage': 'singleEval',
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
                'filter': ['ColorMatrix', 'jb2a.cast_generic.02.blue.0', 'data.spellSchool'],
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
        'targetType': 'multiplePromiseLoop',
        'timeout': 1250,
        'effects': [
            {
                'files': 'jb2a.energy_strands.range.standard.purple.04',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'filter': ['ColorMatrix', 'jb2a.energy_strands.range.standard.purple.04', 'data?.damageFlavors?.[0] ?? data.spellSchool'],
                'stretchTo': ['i', {'offset': {x: -0.5}, 'local': true, 'gridUnits': true}],
                'playbackRate': 1,
            },
            {
                'files': 'jb2a.energy_strands.in.green.01.0',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 500,
                'filter': ['ColorMatrix', 'jb2a.energy_strands.in.green.01.0', 'data?.damageFlavors?.[0] ?? data.spellSchool'],
                'scaleToObject': 1.5,
                'playbackRate': 1,
                'waitUntilFinished': true
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
                'fileUsage': 'singleEval',
                'atLocation': 'i',
                'belowTokens': true,
                'scaleToObject': 1.5,
                'playbackRate': 1,
                'waitUntilFinished': -1000
            },
            {
                'files': '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                'fileUsage': 'singleEval',
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
                'fileUsage': 'singleEval',
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
                'filter': ['ColorMatrix', 'jb2a.markers.bubble.intro.blue', 'data.spellSchool'],
                'scaleToObject': 1,
                'playbackRate': 0.8,
                'waitUntilFinished': -1000
            },
            {
                'files': 'jb2a.markers.bubble.outro.blue',
                'fileUsage': 'single',
                'atLocation': 'i',
                'filter': ['ColorMatrix', 'jb2a.markers.bubble.outro.blue', 'data.spellSchool'],
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
                'filter': ['ColorMatrix', 'jb2a.markers.runes03.dark_orange.01', 'data.spellSchool'],
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
        'targetType': 'multipleLoopPromise',
        'timeout': 750,
        'effects': [
            {
                'files': 'jb2a.cast_generic.fire.side01.orange.0',
                'fileUsage': 'single',
                'anchor': {'x': 0.15},
                'atLocation': ['i', {'local': true, 'gridUnits': true}],
                'filter': ['ColorMatrix', 'jb2a.cast_generic.fire.side01.orange.0', 'data.spellSchool'],
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
        'targetType': 'multiplePromiseLoop',
        'timeout': 250,
        'effects': [
            {
                'files': 'jb2a.template_line_piercing.generic.01.orange.15ft',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'filter': ['ColorMatrix', 'jb2a.template_line_piercing.generic.01.orange.15ft', 'data?.damageFlavors[0]'],
                'missed': '!(data.hitTargetsIds.includes(i.id))',
                'stretchTo': ['i', {'offset': {'x': -0.5}, 'local': true, 'gridUnits': true}],
                'playbackRate': 0.75,
            }
        ]
    },
    {
        'name': 'healDamage',
        'call': 'damage',
        'actionType': ['heal'],
        'itemType': 'spell',
        'targetType': 'multipleLoopPromise',
        'async': true,
        'timeout': 'resolve',
        'effects': [
            {
                'files': 'jb2a.energy_strands.in.green.01.2',
                'fileUsage': 'single',
                'atLocation': 'i',
                'filter': ['ColorMatrix', 'jb2a.energy_strands.in.green.01.0', 'data.spellSchool'],
                'scaleToObject': 2,
                'playbackRate': 1,
                'waitUntilFinished': -300
            },
            {
                'files': 'jb2a.healing_generic.burst.greenorange',
                'fileUsage': 'single',
                'atLocation': 'i',
                'filter': ['ColorMatrix', 'jb2a.energy_strands.in.green.01.0', 'data.spellSchool'],
                'scaleToObject': 2.5,
                'playbackRate': 1,
                'waitUntilFinished': -2000
            },
            {
                'files': 'jb2a.energy_field.02.above.blue',
                'fileUsage': 'single',
                'atLocation': 'i',
                'duration': 2300,
                'filter': ['ColorMatrix', 'jb2a.energy_field.02.above.blue', 'data.spellSchool'],
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
        'targetType': 'multiplePromiseLoop',
        'async': true,
        'timeout': 'resolve',
        'effects': [
            {
                'files': 'jb2a.impact.010.orange',
                'fileUsage': 'single',
                'atLocation': 'i',
                'async': true,
                'endTime': 500,
                'filter': ['ColorMatrix', 'jb2a.impact.010.orange', 'data?.damageFlavors[0]'],
                'scaleToObject': 2,
                'playbackRate': 0.5
            }
        ]
    },
    {
        'name': 'spellAttackDamageCritical',
        'call': 'damage',
        'actionType': ['msak', 'rsak'],
        'itemType': 'spell',
        'requirements': {'data.isCritical': true, 'data.hitTargetsIds.includes(i.id)': 'postLoop'},
        'targetType': 'multiplePromiseLoop',
        'async': true,
        'timeout': 'resolve',
        'effects': [
            {
                'files': 'jb2a.impact.006.yellow',
                'fileUsage': 'single',
                'atLocation': 'i',
                'async': true,
                'filter': ['ColorMatrix', 'jb2a.impact.006.yellow', 'data?.damageFlavors[0]'],
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
                'fileUsage': 'singleEval',
                'atLocation': 'data.targets[0]',
                'delay': 200,
                'scaleToObject': 1,
                'playbackRate': 0.75,
            },
            {
                'files': '`jb2a.magic_signs.rune.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color;',
                'fileUsage': 'singleEval',
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
                'filter': ['ColorMatrix', 'jb2a.energy_field.02.above.blue', 'data.spellSchool'],
                'scaleToObject': 1,
                'startTime': 1200,
                'playbackRate': 2,
            }
        ]
    },
    { // Weapons
        'name': 'weaponAttackMelee',
        'call': 'attack',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'Object?.keys(defaultPreferences?.baseWeapons?.[data.baseItem] ?? {}).length > 0': true, 'data.distance <= 5': true},
        'targetType': 'single',
        'effects': [
            {
                'files': 'baseWeapons',
                'fileUsage': 'random',
                'atLocation': 'data.token',
                'filter': ['Glow'],
                'rotateTowards': ['data.targets[0]', {'offset': {'x': -1.5}, 'gridUnits': true, 'local': true}],
                'scaleToObject': 3.5,
                'zIndex': 10
            }
        ]
    },
    {
        'name': 'weaponAttackRanged',
        'call': 'attack',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'Object?.keys(defaultPreferences?.baseWeapons?.[data.baseItem] ?? {})?.length > 0': true, 'data.distance > 5': true},
        'targetType': 'single',
        'effects': [
            {
                'files': 'baseWeapons',
                'fileUsage': 'random',
                'atLocation': 'data.token',
                'filter': ['Glow'],
                'stretchTo': 'data.targets[0]',
                'zIndex': 10
            }
        ]
    },
    {
        'name': 'netAttack',
        'call': 'attack',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.baseItem': 'net'},
        'targetType': 'single',
        'async': true,
        'effects': [
            {
                'files': 'jb2a.web.01',
                'fileUsage': 'single',
                'async': true,
                'atLocation': 'data.token',
                'filter': ['ColorMatrix', 'jb2a.web.01', '`net`'],
                'moveSpeed': 400,
                'moveTowards': 'data.targets[0]',
                'rotateIn': [800, 2000],
                'scaleToObject': 1,
                'waitUntilFinished': true,
                'zIndex': 10
            }
        ]
    },
    {
        'name': 'unarmedStrike',
        'call': 'attack',
        'actionType': ['mwak'],
        'itemType': 'weapon',
        'requirements': {'data.distance <= 5': true, 'data.baseItem === ""': true},
        'targetType': 'single',
        'effects': [
            {
                'files': 'jb2a.unarmed_strike.physical.01.blue',
                'fileUsage': 'single',
                'atLocation': 'data.token',
                'delay': 300,
                'rotateTowards': ['data.targets[0]', {'offset': {'x': -1.5}, 'gridUnits': true, 'local': true}],
                'scaleToObject': 3.5,
                'zIndex': 10
            }
        ]
    },
    {
        'name': 'netPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.baseItem': 'net', 'data.hitTargetsIds.includes(i.id)': 'postLoop'},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.web.01',
                'fileUsage': 'single',
                'atLocation': 'i',
                'fadeOut': [6500, {'ease': 'easeInOutBack'}],
                'filter': ['ColorMatrix', 'jb2a.web.01', '`net`'],
                'moveSpeed': 400,
                'playBackRate': 0.5,
                'scaleToObject': 1,
                'zIndex': 10
            }
        ]
    },
    {
        'name': 'slashingPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.hitTargetsIds.includes(i.id)': 'postLoop', 'data?.damageFlavors?.includes(`slashing`)': true},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.melee_attack.04.trail.01.orangered.1',
                'fileUsage': 'single',
                'atLocation': ['data.token', {'offset': {'x': -0.25}, 'gridUnits': true, 'local': true}],
                'delay': 650,
                'rotateTowards': 'i',
                'scaleToObject': 2,
                'playbackRate': 0.65,
                'zIndex': 2
            }
        ]
    },
    {
        'name': 'piercingPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.hitTargetsIds.includes(i.id)': 'postLoop', 'data?.damageFlavors?.includes(`piercing`)': true},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.impact.008.orange',
                'fileUsage': 'single',
                'filter': ['ColorMatrix', 'jb2a.impact.008.orange', '`piercing`', {'brightness': 0.7}],
                'atLocation': ['i', {'offset': {'x': -0.5}, 'gridUnits': true, 'local': true}],
                'delay': 970,
                'rotateTowards': 'data.token',
                'scaleToObject': 1.3,
                'playbackRate': 0.5,
                'zIndex': 2
            }
        ]
    },
    {
        'name': 'bludgeoningPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.hitTargetsIds.includes(i.id)': 'postLoop', 'data?.damageFlavors?.includes(`bludgeoning`)': true},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.smoke.puff.ring.01.white.1',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 800,
                'scaleToObject': 1.5,
                'zIndex': 2
            }
        ]
    },
    {
        'name': 'coloredWeaponPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.hitTargetsIds.includes(i.id)': 'postLoop', 'needsColor(data)': true},
        'targetType': 'multipleLoopPromise',
        'async': true,
        'timeout': 900,
        'effects': [
            {
                'files': 'Sequencer.Database.getEntry(`jb2a.eldritch_blast.purple`).file[`05ft`]',
                'fileUsage': 'singleEval',
                'async': true,
                'atLocation': 'i',
                'delay': 1000,
                'endTimePerc': 0.23,
                'fadeOut': 800,
                'filter': ['ColorMatrix', 'jb2a.eldritch_blast.purple', 'getColor(data)'],
                'scaleToObject': 1.5,
                'zIndex': 1
            }
        ]
    },
    {
        'name': 'conditionPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.hitTargetsIds.includes(i.id)': 'postLoop', 'data?.conditions?.size > 0': true},
        'targetType': 'multiple',
        'async': true,
        'effects': [
            {
                'files': 'Sequencer.Database.getEntry(`jb2a.eldritch_blast.purple`).file[`05ft`]',
                'fileUsage': 'singleEval',
                'async': true,
                'atLocation': 'i',
                'delay': 1000,
                'endTimePerc': 0.23,
                'fadeOut': 800,
                'filter': ['ColorMatrix', 'jb2a.eldritch_blast.purple', 'getColor(data)'],
                'scaleToObject': 1.5,
                'zIndex': 1
            }
        ]
    },
    {
        'name': 'netMissPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.baseItem': 'net', '!data.hitTargetsIds.includes(i.id)': 'postLoop'},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.smoke.puff.ring.01.white.1',
                'fileUsage': 'single',
                'atLocation': 'i',
                'scaleToObject': 1.5,
                'zIndex': 1
            }
        ]
    },
    {
        'name': 'missPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'!data.hitTargetsIds.includes(i.id)': 'postLoop', 'data.baseItem != `net`': true},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.smoke.puff.side.grey.4',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 950,
                'filter': ['ColorMatrix', '`none`', '`none`', {'brightness': 2, 'saturate': 1}],
                'rotateTowards': ['data.token', {'offset': {'x': 0.5}, 'gridUnits': true, 'local': true, 'rotationOffset': 180}],
                'scaleToObject': 1,
                'zIndex': 1
            }
        ]
    },
    {
        'name': 'missColorPostHit',
        'call': 'postHit',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'!data.hitTargetsIds.includes(i.id)': 'postLoop', 'needsColor(data)': true},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.swirling_leaves.outburst.01.pink',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 1100,'filter': ['ColorMatrix', 'jb2a.swirling_leaves.outburst.01.pink', 'getColor(data)'],
                'scaleToObject': 1,
                'playbackRate': 1.25,
                'zIndex': 1
            }
        ]
    },
    {
        'name': 'critWeaponDamage',
        'call': 'damage',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.isCritical': true},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.liquid.splash.blue',
                'fileUsage': 'single',
                'atLocation': 'i',
                'belowTokens': true,
                'delay': 970,
                'filter': ['ColorMatrix', 'jb2a.liquid.splash.blue', '`piercing`', {'brightness': 0.75}],
                'scaleToObject': 1.5,
                'zIndex': 2
            }
        ]
    },
    {
        'name': 'critColorDamage',
        'call': 'damage',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.isCritical': true, 'needsColor(data)': true},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.particle_burst.01.circle.bluepurple',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 1000,
                'fadeOut': 500,
                'filter': ['ColorMatrix', 'jb2a.particle_burst.01.circle.bluepurple', 'getColor(data)'],
                'mirrorX': false,
                'scaleToObject': 1.75,
                'timeRange': [850, 1800],
                'playbackRate': 0.75,
                'zIndex': 1
            }
        ]
    },
    {
        'name': 'weaponDamage',
        'call': 'damage',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.hitTargetsIds.includes(i.id)': 'postLoop'},
        'targetType': 'multiple',
        'effects': [
            {
                'files': 'jb2a.liquid.splash_side.blue',
                'fileUsage': 'single',
                'atLocation': 'i',
                'delay': 1100,
                'filter': ['ColorMatrix', 'jb2a.liquid.splash.blue', '"piercing"', {'brightness': 0.6}],
                'rotateTowards': ['data.token', {'offset': {'x': 0.25}, 'gridUnits': true, 'local': true, 'rotationOffset': 180}],
                'scaleToObject': 1.35,
                'zIndex': 2
            }
        ]
    },
    {
        'name': 'weaponColorDamage',
        'call': 'damage',
        'actionType': ['mwak', 'rwak'],
        'itemType': 'weapon',
        'requirements': {'data.hitTargetsIds.includes(i.id)': 'postLoop', 'needsColor(data)': true, 'data?.otherDamageHalfDamage != false': true},
        'targetType': 'multiple',
        'async': true,
        'effects': [
            {
                'files': 'jb2a.particle_burst.01.circle.bluepurple',
                'fileUsage': 'single',
                'async': true,
                'atLocation': 'i',
                'fadeOut': 500,
                'filter': ['ColorMatrix', 'jb2a.particle_burst.01.circle.bluepurple', 'getColor(data)'],
                'scaleToObject': 1.25,
                'timeRange': [850, 1800],
                'playbackRate': 0.75,
                'zIndex': 1
            }
        ]
    },
    {
        'name': 'saveFailFade',
        'call': 'save',
        'actionType': ['mwak', 'rwak', 'save'],
        'itemType': 'weapon',
        'requirements': {'data.outcome === false': true, 'data?.conditions?.size > 0': true, 'defaultPreferences.conditionAbrevs[l]?.fade': 'postLoop'},
        'targetType': 'loopOf',
        'loopOf': 'data.conditions',
        'effects': [
            {
                'files': 'defaultPreferences.conditionAbrevs[i].file',
                'fileUsage': 'singleEval',
                'atLocation': 'data.targets[0]',
                'delay': 500,
                'duration': 5500,
                'fadeIn': 3000,
                'fadeOut': 2000,
                'playbackRate': 0.8,
                'scaleToObject': 1.5,
            }
        ]
    },
    {
        'name': 'saveFailNoFade',
        'call': 'save',
        'actionType': ['mwak', 'rwak', 'save'],
        'itemType': 'weapon',
        'requirements': {'data.outcome === false': true, 'data?.conditions?.size > 0': true, 'defaultPreferences.conditionAbrevs[l]?.fade === false': 'postLoop'},
        'targetType': 'loopOf',
        'loopOf': 'data.conditions',
        'effects': [
            {
                'files': 'defaultPreferences.conditionAbrevs[i].file',
                'fileUsage': 'singleEval',
                'atLocation': 'data.targets[0]',
                'delay': 500,
                'scaleToObject': 1.5,
            }
        ]
    },
    {
        'name': 'saveFailOtherDamage',
        'call': 'save',
        'actionType': ['mwak', 'rwak', 'save'],
        'itemType': 'weapon',
        'requirements': {'data.outcome === false': true, 'data?.otherDamageFlavors?.length > 0': true, '!data.otherDamageHalfDamage': true},
        'targetType': 'single',
        'async': true,
        'effects': [
            {
                'files': 'jb2a.particle_burst.01.circle.bluepurple',
                'fileUsage': 'single',
                'async': true,
                'atLocation': 'data.targets[0]',
                'delay': 800,
                'fadeOut': 500,
                'filter': ['ColorMatrix', 'jb2a.particle_burst.01.circle.bluepurple', 'getColor(data)'],
                'playbackRate': 0.75,
                'scaleToObject': 1.25,
                'timeRange': [850, 1800],
                'zIndex': 1
            }
        ]
    },
    {
        'name': 'saveSuceed',
        'call': 'save',
        'actionType': ['mwak', 'rwak', 'save'],
        'itemType': 'weapon',
        'requirements': {'data.outcome': true},
        'targetType': 'single',
        'effects': [
            {
                'files': 'jb2a.energy_field.02.above.blue',
                'fileUsage': 'single',
                'atLocation': 'data.targets[0]',
                'belowTokens': false,
                'delay': 1000,
                'duration': 3000,
                'filter': ['ColorMatrix', 'jb2a.energy_field.02.above.blue', 'getColor(data)'],
                'playbackRate': 2,
                'scaleToObject': 1,
                'startTime': 1200
            }
        ]
    }
]

export let settings = {
    'protypeSetting': prototypeSetting,
    'defaultSettings': defaultSettings
}