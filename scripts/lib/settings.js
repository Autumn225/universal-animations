import { UniversalAnimationsSettingsMenu } from '../applications/settingsMenu.js';
const moduleName = 'universal-animations';
function initialize() {
    game.settings.registerMenu(moduleName, 'settingsMenu', {
        name: 'UNIVERSALANIMATIONS.SettingsMenu.WindowTitle',
        hint: 'UNIVERSALANIMATIONS.SettingsMenu.Hint',
        label: 'UNIVERSALANIMATIONS.SettingsMenu.Label',
        icon: 'fa-solid fa-globe',
        type: UniversalAnimationsSettingsMenu,
        restricted: true,
    });
    game.settings.register(moduleName, 'animations', {
        name: 'UNIVERSALANIMATIONS.AnimationMenu.WindowTitle',
        hint: 'UNIVERSALANIMATIONS.AnimationMenu.Hint',
        scope: 'world',
        config: false,
        default: defaultSettings,
        type: Object,
    });
    game.settings.register(moduleName, 'migrationVersion', {
        name: 'Migration Version',
        hint: 'Internal Migration Purposes Only - Do Not Change',
        scope: 'world',
        config: false,
        default: 0,
        type: Number,
    });
}
class actionType {
    static label = 'UNIVERSALANIMATIONS.AnimationMenu.ActionType.Label';
    static get options() {return Object?.entries(CONFIG?.DND5E?.itemActionTypes ?? {}).map(([key, value]) => ({name: key, label: value}));};
    static inputType = 'selectMultiple';
    static type = 'array';
    static default = ['mwak'];
    static required = true;
}
class itemType {
    static label = 'UNIVERSALANIMATIONS.AnimationMenu.ItemType.Label';
    static get options() {return ['consumable', 'feat', 'loot', 'spell', 'tool', 'weapon'].map(i => ({name: i, label: CONFIG?.Item?.typeLabels[i]}));};
    static inputType = 'select';
    static type = 'string';
    static default = 'spell';
    static required = true;
}
let prototypeSetting = {
    name: 'prototypeSetting',
    call: {
        label: 'UNIVERSALANIMATIONS.AnimationMenu.Call.Label',
        options: [
            {name: 'attack', label: 'UNIVERSALANIMATIONS.AnimationMenu.Call.Attack.Label'},
            {name: 'postHit', label: 'UNIVERSALANIMATIONS.AnimationMenu.Call.PostHit.Label'},
            {name: 'damage', label: 'UNIVERSALANIMATIONS.AnimationMenu.Call.Damage.Label'},
            {name: 'save', label: 'UNIVERSALANIMATIONS.AnimationMenu.Call.Save.Label'}
        ],
        inputType: 'select',
        type: 'string',
        default: 'attack',
        required: true
    },
    actionType,
    itemType,
    requirements: {
        label: 'UNIVERSALANIMATIONS.AnimationMenu.Requirements.Label',
        type: 'array',
        default: [
            {
                key: 'data.isRitual',
                value: true
            }
        ],
        required: false,
        buttons: [
            {
                type: 'button',
                action: 'addRequirement',
                name: 'addRequirement',
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Requirements.Add.Label',
            }
        ]
    },
    targetType: {
        label: 'UNIVERSALANIMATIONS.AnimationMenu.TargetType.Label',
        options: [
            {
                name: 'single',
                label: 'UNIVERSALANIMATIONS.General.Single'
            },
            {
                name: 'multiple',
                label: 'UNIVERSALANIMATIONS.AnimationMenu.TargetType.Multiple.Label'
            },
            {
                name: 'multipleLoopOf',
                label: 'UNIVERSALANIMATIONS.AnimationMenu.TargetType.MultipleLoopOf.Label'
            },
            {
                name: 'multipleLoopPromise',
                label: 'UNIVERSALANIMATIONS.AnimationMenu.TargetType.MultipleLoopPromise.Label'
            },
            {
                name: 'multiplePromiseLoop',
                label: 'UNIVERSALANIMATIONS.AnimationMenu.TargetType.MultiplePromiseLoop.Label'
            }
        ],
        inputType: 'select',
        type: 'string',
        default: 'single',
        required: true
    },
    loopOf: {
        label: 'UNIVERSALANIMATIONS.AnimationMenu.LoopOf.Label',
        inputType: 'text',
        type: 'string',
        default: 'data.conditions',
        required: false
    },
    async: {
        label: 'UNIVERSALANIMATIONS.AnimationMenu.Async.Label',
        options: [{name: true, label: 'UNIVERSALANIMATIONS.General.True'}, {name: false, label: 'UNIVERSALANIMATIONS.General.False'}],
        inputType: 'radio',
        type: 'boolean',
        default: false,
        required: false
    },
    timeout: {
        label: 'UNIVERSALANIMATIONS.AnimationMenu.Timeout.Label',
        inputType: 'text',
        type: 'string',
        default: 1000,
        required: false
    },
    effects: [
        {
            files: { // may change slightly depending on how I change default preferences?
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Files.Label',
                inputType: 'text',
                type: 'string',
                default: 'jb2a.misty_step.01',
                required: true
            },
            fileUsage: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.FileUsage.Label',
                options: [
                    {name: 'single', label: 'UNIVERSALANIMATIONS.General.Single'}, 
                    {name: 'singleEval', label: 'UNIVERSALANIMATIONS.AnimationMenu.FileUsage.SingleEval.Label'}, 
                    {name: 'random', label: 'UNIVERSALANIMATIONS.AnimationMenu.FileUsage.Random.Label'}
                ],
                inputType: 'select',
                type: 'string',
                default: 'single',
                required: true
            },
            anchor: { // will be parsed to object always
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Anchor.Label',
                inputType: 'text',
                type: 'string',
                default: '{"x":0.5,"y":0.5}'
            },
            async: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Async.Label',
                options: [{name: true, label: 'UNIVERSALANIMATIONS.General.True'}, {name: false, label: 'UNIVERSALANIMATIONS.General.False'}],
                inputType: 'radio',
                type: 'boolean',
                default: false,
            },
            atLocation: { // should always be array
                label: 'UNIVERSALANIMATIONS.AnimationMenu.AtLocation.Label',
                inputType: 'multiText',
                inputAmount: 2,
                type: 'array',
                default: ['token', '{}'],
                required: true
            },
            belowTokens: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.BelowTokens.Label',
                options: [{name: true, label: 'UNIVERSALANIMATIONS.General.True'}, {name: false, label: 'UNIVERSALANIMATIONS.General.False'}],
                inputType: 'radio',
                type: 'boolean',
                default: false
            },
            delay: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Delay.Label',
                inputType: 'text',
                type: 'string',
                default: 0
            },
            duration: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Duration.Label',
                inputType: 'text',
                type: 'string',
                default: 0
            },
            endTime: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.EndTime.Label',
                inputType: 'text',
                type: 'string',
                default: 0
            },
            endTimePerc: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.EndTimePerc.Label',
                inputType: 'text',
                type: 'string',
                default: 0.25
            },
            fadeIn: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.FadeIn.Label',
                inputType: 'multiText',
                inputAmount: 2,
                type: 'array',
                default: [0, '{"ease":"linear","delay":0}']
            },
            fadeOut: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.FadeOut.Label',
                inputType: 'multiText',
                inputAmount: 2,
                type: 'array',
                default: [0, '{"ease":"linear","delay":0}']
            },
            filter: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Filter.Label',
                options: [ // These aren't localized because they're specific filters
                    {name: 'ColorMatrix', label: 'ColorMatrix'},
                    {name: 'Glow', label: 'Glow'},
                    {name: 'Blur', label: 'Blur'}
                ],
                inputType: 'combination',
                inputAmount: [{type: 'select', amount: 1}, {type: 'text', amount: 3}],
                type: 'array',
                default: ['ColorMatrix', 'jb2a.misty_step.01', 'data.spellSchool', '{"hue":100,"brightness":1,"saturation":1}']
            },
            missed: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Missed.Label',
                inputType: 'text',
                type: 'string',
                default: '!(data.hitTargetsIds.includes(i.id))'
            },
            mirrorX: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.MirrorX.Label',
                options: [{name: true, label: 'UNIVERSALANIMATIONS.General.True'}, {name: false, label: 'UNIVERSALANIMATIONS.General.False'}],
                inputType: 'radio',
                type: 'boolean',
                default: false
            },
            mirrorY: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.MirrorY.Label',
                options: [{name: true, label: 'UNIVERSALANIMATIONS.General.True'}, {name: false, label: 'UNIVERSALANIMATIONS.General.False'}],
                inputType: 'radio',
                type: 'boolean',
                default: false
            },
            moveSpeed: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.MoveSpeed.Label',
                inputType: 'text',
                type: 'string',
                default: 50
            },
            moveTowards: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.MoveTowards.Label',
                inputType: 'multiText',
                inputAmount: 2,
                type: 'array',
                default: ['data.token', '{"rotate":true}']
            },
            opacity: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.Opacity.Label',
                inputType: 'text',
                type: 'string',
                default: 1,
            },
            rotateIn: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.RotateIn.Label',
                inputType: 'multiText',
                inputAmount: 3,
                type: 'array',
                default: [90, 500, '{"ease":"easeOutCubic","delay":100}']
            },
            rotateOut: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.RotateOut.Label',
                inputType: 'multiText',
                inputAmount: 3,
                type: 'array',
                default: [90, 500, '{"ease":"easeOutCubic","delay":100}']
            },
            rotateTowards: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.RotateTowards.Label',
                inputType: 'multiText',
                inputAmount: 2,
                type: 'array',
                default: ['data.token', '{"local":true,"gridUnits":true}']
            },
            scaleIn: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.ScaleIn.Label',
                inputType: 'multiText',
                inputAmount: 3,
                type: 'array',
                default: [0, 500, '{"ease":"easeOutCubic","delay":100}']
            },
            scaleOut: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.ScaleOut.Label',
                inputType: 'multiText',
                inputAmount: 3,
                type: 'array',
                default: [0, 500, '{"ease":"easeOutCubic","delay":-100}']
            },
            scaleToObject: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.ScaleToObject.Label',
                inputType: 'text',
                type: 'string',
                default: 1,
            },
            startTime: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.StartTime.Label',
                inputType: 'text',
                type: 'string',
                default: 0.25
            },
            startTimePerc: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.StartTimePerc.Label',
                inputType: 'text',
                type: 'string',
                default: 0.25
            },
            stretchTo: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.StretchTo.Label',
                inputType: 'multiText',
                inputAmount: 2,
                default: ['data.token', '{"local":true,"gridUnits":true}']
            },
            timeRange: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.TimeRange.Label',
                inputType: 'multiText',
                inputAmount: 2,
                default: [200, 700],
            },
            playbackRate: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.PlaybackRate.Label',
                inputType: 'text',
                type: 'string',
                default: 1
            },
            waitUntilFinished: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.WaitUntilFinished.Label',
                options: [{name: true, label: 'UNIVERSALANIMATIONS.General.True'}, {name: false, label: 'UNIVERSALANIMATIONS.General.False'}],
                inputType: 'radio',
                type: 'boolean',
                default: false
            },
            zIndex: {
                label: 'UNIVERSALANIMATIONS.AnimationMenu.ZIndex.Label',
                inputType: 'text',
                type: 'string',
                default: 1
            }
        }
    ]
};
let exampleSetting = {
    name: 'My Custom Setting',
    call: 'attack',
    actionType: ['other'],
    itemType: 'spell',
    targetType: 'multiple',
    requirements: [
        {
            key: 'data.item?.name === `Lightning Strike`',
            value: true
        }
    ],
    effects: [
        {
            files: 'jb2a.lightning_strike.blue.0',
            fileUsage: 'single',
            atLocation: ['i'],
            scaleToObject: 1
        }
    ]
};
let defaultSettings = { // Spells
    spellAttackCast: {
        name: 'Spell Attack Cast',
        call: 'attack',
        actionType: ['msak', 'rsak'],
        itemType: 'spell',
        targetType: 'single',
        async: true,
        effects: [
            {
                files: 'jb2a.cast_generic.01.yellow.0',
                fileUsage: 'single',
                atLocation: ['data.token'],
                filter: ['ColorMatrix', 'jb2a.cast_generic.01.yellow.0', 'data.spellSchool'],
                scaleToObject: 1.25,
                playbackRate: 0.75,
                waitUntilFinished: true
            }
        ]
    },
    ritualCast: {
        name: 'Ritual Cast',
        call: 'attack',
        actionType: ['mwak', 'msak', 'rwak', 'rsak', 'util', 'save', 'heal', 'other'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data.isRitual',
                value: true
            }
        ],
        targetType: 'single',
        effects: [
            {
                files: 'jb2a.particles.outward.greenyellow.02.01',
                fileUsage: 'single',
                atLocation: ['data.token'],
                delay: 500,
                duration: 5500,
                fadeIn: [3000],
                fadeOut: [2000],
                filter: ['ColorMatrix', 'jb2a.particles.outward.greenyellow.02.01', 'data.spellSchool'],
                opacity: 0.5,
                scaleIn: [0, 2000],
                scaleToObject: 3,
                playbackRate: 0.8,
            },
            {
                files: '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.intro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                fileUsage: 'singleEval',
                async: true,
                atLocation: ['data.token'],
                belowTokens: true,
                scaleToObject: 2.5,
                playbackRate: 1,
                waitUntilFinished: -1000
            },
            {
                files: '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                fileUsage: 'singleEval',
                async: true,
                atLocation: ['data.token'],
                belowTokens: true,
                scaleToObject: 2.5,
                playbackRate: 1,
            }
        ]
    },
    cast: {
        name: 'Cast',
        call: 'attack',
        actionType: ['mwak', 'rwak', 'util', 'save', 'heal', 'other'],
        itemType: 'spell',
        targetType: 'single',
        requirements: [
            {
                key: 'data.isRitual',
                value: false
            }
        ],
        async: true,
        effects: [
            {
                files: 'jb2a.cast_generic.02.blue.0',
                fileUsage: 'single',
                atLocation: ['data.token'],
                filter: ['ColorMatrix', 'jb2a.cast_generic.02.blue.0', 'data.spellSchool'],
                scaleToObject: 1.25,
                playbackRate: 0.75,
                waitUntilFinished: true
            }
        ]
    },
    saveCast: {
        name: 'Save Cast',
        call: 'attack',
        actionType: ['save'],
        itemType: 'spell',
        targetType: 'multiplePromiseLoop',
        timeout: 1250,
        effects: [
            {
                files: 'jb2a.energy_strands.range.standard.purple.04',
                fileUsage: 'single',
                atLocation: ['data.token'],
                filter: ['ColorMatrix', 'jb2a.energy_strands.range.standard.purple.04', 'data?.damageFlavors?.[0] ?? data.spellSchool'],
                stretchTo: ['i', '{"offset": {"x": -0.5}, "local": true, "gridUnits": true}'],
                playbackRate: 1,
            },
            {
                files: 'jb2a.energy_strands.in.green.01.0',
                fileUsage: 'single',
                atLocation: ['i'],
                delay: 500,
                filter: ['ColorMatrix', 'jb2a.energy_strands.in.green.01.0', 'data?.damageFlavors?.[0] ?? data.spellSchool'],
                scaleToObject: 1.5,
                playbackRate: 1,
                waitUntilFinished: true
            }
        ]
    },
    utilityCast: {
        name: 'Utility Cast',
        call: 'attack',
        actionType: ['util', 'other'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data?.targets?.length > 0',
                value: true
            },
            {
                key: 'data.isRitual',
                value: false
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.intro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                fileUsage: 'singleEval',
                atLocation: ['i'],
                belowTokens: true,
                scaleToObject: 1.5,
                playbackRate: 1,
                waitUntilFinished: -1000
            },
            {
                files: '`jb2a.magic_signs.circle.02.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color',
                fileUsage: 'singleEval',
                atLocation: ['i'],
                belowTokens: true,
                scaleToObject: 1.5,
                playbackRate: 1,
            }
        ]
    },
    conditionCast: {
        name: 'Condition Cast',
        call: 'attack',
        actionType: ['util', 'other'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data?.targets?.length > 0',
                value: true
            },
            {
                key: 'data?.conditions?.size > 0',
                value: true
            }
        ],
        targetType: 'multipleLoopOf',
        loopOf: 'data.conditions',
        effects: [
            {
                files: 'defaultPreferences.conditionAbrevs[condition].file',
                fileUsage: 'singleEval',
                atLocation: ['i'],
                delay: 500,
                duration: 'defaultPreferences.conditionAbrevs[condition].fade === true ? 5500 : false',
                fadeIn: ['defaultPreferences.conditionAbrevs[condition].fade === true ? 3000 : false'],
                fadeOut: ['defaultPreferences.conditionAbrevs[condition].fade === true ? 2000 : false'],
                scaleToObject: 1.5,
                playbackRate: 'defaultPreferences.conditionAbrevs[condition].fade === true ? 0.8 : 1',
            }
        ]
    },
    utilityCastFriendly: {
        name: 'Utility Cast Friendly',
        call: 'attack',
        actionType: ['util', 'other'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data?.targets?.length > 0',
                value: true
            },
            {
                key: 'i.document.disposition === data.token.document.disposition',
                value: 'postLoop'
            },
            {
                key: 'data.isRitual',
                value: false
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.markers.bubble.intro.blue',
                fileUsage: 'single',
                atLocation: ['i'],
                filter: ['ColorMatrix', 'jb2a.markers.bubble.intro.blue', 'data.spellSchool'],
                scaleToObject: 1,
                playbackRate: 0.8,
                waitUntilFinished: -1000
            },
            {
                files: 'jb2a.markers.bubble.outro.blue',
                fileUsage: 'single',
                atLocation: ['i'],
                filter: ['ColorMatrix', 'jb2a.markers.bubble.outro.blue', 'data.spellSchool'],
                scaleToObject: 1,
                playbackRate: 0.8,
            }
        ]
    },
    utilityCastHostile: {
        name: 'Utility Cast Hostile',
        call: 'attack',
        actionType: ['util', 'other'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data?.targets?.length > 0',
                value: true
            },
            {
                key: 'i.document.disposition != data.token.document.disposition',
                value: 'postLoop'
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.markers.runes03.dark_orange.01',
                fileUsage: 'single',
                atLocation: ['i'],
                delay: 500,
                duration: 5500,
                fadeIn: [3000],
                fadeOut: [2000],
                filter: ['ColorMatrix', 'jb2a.markers.runes03.dark_orange.01', 'data.spellSchool'],
                scaleToObject: 1.5,
                playbackRate: 0.8,
            }
        ]
    },
    meleeSpellAttack: {
        name: 'Melee Spell Attack',
        call: 'attack',
        actionType: ['mwak', 'msak', 'rwak', 'rsak'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data.distance <= 5',
                value: true
            }
        ],
        targetType: 'multipleLoopPromise',
        timeout: 750,
        effects: [
            {
                files: 'jb2a.cast_generic.fire.side01.orange.0',
                fileUsage: 'single',
                anchor: '{"x":0.15}',
                atLocation: ['i', '{"local":true,"gridUnits":true}'],
                filter: ['ColorMatrix', 'jb2a.cast_generic.fire.side01.orange.0', 'data.spellSchool'],
                rotateTowards: ['data.token'],
                scaleToObject: 2,
                playbackRate: 1,
            }
        ]
    },
    rangedSpellAttack: {
        name: 'Ranged Spell Attack',
        call: 'postHit',
        actionType: ['msak', 'rsak'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data?.distance > 5',
                value: true
            }
        ],
        targetType: 'multiplePromiseLoop',
        timeout: 250,
        effects: [
            {
                files: 'jb2a.template_line_piercing.generic.01.orange.15ft',
                fileUsage: 'single',
                atLocation: ['data.token'],
                filter: ['ColorMatrix', 'jb2a.template_line_piercing.generic.01.orange.15ft', 'data?.damageFlavors[0]'],
                missed: '!(data.hitTargetsIds.includes(i.id))',
                stretchTo: ['i', '{"local":true, "gridUnits":true, "onlyX": true}'],
                playbackRate: 0.75,
            }
        ]
    },
    healDamage: {
        name: 'Heal Damage',
        call: 'damage',
        actionType: ['heal'],
        itemType: 'spell',
        targetType: 'multipleLoopPromise',
        async: true,
        timeout: 'resolve',
        effects: [
            {
                files: 'jb2a.energy_strands.in.green.01.2',
                fileUsage: 'single',
                atLocation: ['i'],
                filter: ['ColorMatrix', 'jb2a.energy_strands.in.green.01.0', 'data.spellSchool'],
                scaleToObject: 2,
                playbackRate: 1,
                waitUntilFinished: -300
            },
            {
                files: 'jb2a.healing_generic.burst.greenorange',
                fileUsage: 'single',
                atLocation: ['i'],
                filter: ['ColorMatrix', 'jb2a.energy_strands.in.green.01.0', 'data.spellSchool'],
                scaleToObject: 2.5,
                playbackRate: 1,
                waitUntilFinished: -2000
            },
            {
                files: 'jb2a.energy_field.02.above.blue',
                fileUsage: 'single',
                atLocation: ['i'],
                duration: 2300,
                filter: ['ColorMatrix', 'jb2a.energy_field.02.above.blue', 'data.spellSchool'],
                scaleToObject: 1,
                startTime: 1200,
                playbackRate: 2.5,
            }
        ]
    },
    spellAttackDamage: {
        name: 'Spell Attack Damage',
        call: 'damage',
        actionType: ['msak', 'rsak'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            }
        ],
        targetType: 'multiplePromiseLoop',
        async: true,
        timeout: 'resolve',
        effects: [
            {
                files: 'jb2a.impact.010.orange',
                fileUsage: 'single',
                atLocation: ['i'],
                async: true,
                //endTime: 500,
                filter: ['ColorMatrix', 'jb2a.impact.010.orange', 'data?.damageFlavors[0]'],
                scaleToObject: 2,
                playbackRate: 0.5
            }
        ]
    },
    spellAttackDamageCritical: {
        name: 'Spell Attack Damage Critical',
        call: 'damage',
        actionType: ['msak', 'rsak'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data.isCritical',
                value: true
            },
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            }
        ],
        targetType: 'multiplePromiseLoop',
        async: true,
        timeout: 'resolve',
        effects: [
            {
                files: 'jb2a.impact.006.yellow',
                fileUsage: 'single',
                atLocation: ['i'],
                async: true,
                filter: ['ColorMatrix', 'jb2a.impact.006.yellow', 'data?.damageFlavors[0]'],
                scaleToObject: 3.5,
                playbackRate: 0.65,
            }
        ]
    },
    saveFail: {
        name: 'Save Fail',
        call: 'save',
        actionType: ['save'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data.outcome',
                value: false
            }
        ],
        targetType: 'single',
        effects: [
            {
                files: '`jb2a.magic_signs.rune.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.intro.` + defaultPreferences.spellSchools[data.spellSchool].color;',
                fileUsage: 'singleEval',
                atLocation: ['data.targets[0]'],
                delay: 200,
                scaleToObject: 1,
                playbackRate: 0.75,
            },
            {
                files: '`jb2a.magic_signs.rune.` + defaultPreferences.spellSchools[data.spellSchool].name  + `.outro.` + defaultPreferences.spellSchools[data.spellSchool].color;',
                fileUsage: 'singleEval',
                atLocation: ['data.targets[0]'],
                delay: 1500,
                scaleToObject: 1,
                playbackRate: 0.75,
            }
        ]
    },
    saveSuceed: {
        name: 'Save Suceed',
        call: 'save',
        actionType: ['save'],
        itemType: 'spell',
        requirements: [
            {
                key: 'data.outcome',
                value: true
            }
        ],
        targetType: 'single',
        effects: [
            {
                files: 'jb2a.energy_field.02.above.blue',
                fileUsage: 'single',
                atLocation: ['data.targets[0]'],
                duration: 5500, // zero clue why this lags
                filter: ['ColorMatrix', 'jb2a.energy_field.02.above.blue', 'data.spellSchool'],
                scaleToObject: 1,
                startTime: 2000,
                playbackRate: 2,
            }
        ]
    },
    weaponAttackMelee: {
        name: 'Weapon Attack Melee',
        call: 'attack',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'Object?.keys(defaultPreferences?.baseWeapons?.[data.baseItem] ?? {}).length > 0',
                value: true
            },
            {
                key: 'data.distance <= 5',
                value: true
            }
        ],
        targetType: 'single',
        effects: [
            {
                files: 'baseWeapons',
                fileUsage: 'random',
                atLocation: ['data.token'],
                filter: ['Glow'],
                rotateTowards: ['data.targets[0]', '{"offset":{"x":-1.5},"gridUnits":true,"local":true}'],
                scaleToObject: 3.5,
                zIndex: 10
            }
        ]
    },
    weaponAttackRanged: {
        name: 'Weapon Attack Ranged',
        call: 'attack',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'Object?.keys(defaultPreferences?.baseWeapons?.[data.baseItem] ?? {})?.length > 0',
                value: true
            },
            {
                key: 'data.distance > 5',
                value: true
            }
        ],
        targetType: 'single',
        effects: [
            {
                files: 'baseWeapons',
                fileUsage: 'random',
                atLocation: ['data.token'],
                filter: ['Glow'],
                stretchTo: ['data.targets[0]'],
                zIndex: 10
            }
        ]
    },
    netAttack: {
        name: 'Net Attack',
        call: 'attack',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.baseItem',
                value: 'net'
            }
        ],
        targetType: 'single',
        async: true,
        effects: [
            {
                files: 'jb2a.web.01',
                fileUsage: 'single',
                async: true,
                atLocation: ['data.token'],
                filter: ['ColorMatrix', 'jb2a.web.01', '`net`'],
                moveSpeed: 400,
                moveTowards: ['data.targets[0]'],
                rotateIn: [800, 2000],
                scaleToObject: 1,
                waitUntilFinished: true,
                zIndex: 10
            }
        ]
    },
    unarmedStrike: {
        name: 'Unarmed Strike',
        call: 'attack',
        actionType: ['mwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.distance <= 5',
                value: true
            },
            {
                key: 'data.baseItem === \'\'',
                value: true
            }
        ],
        targetType: 'single',
        effects: [
            {
                files: 'jb2a.unarmed_strike.physical.01.blue',
                fileUsage: 'single',
                atLocation: ['data.token'],
                delay: 300,
                rotateTowards: ['data.targets[0]', '{"offset":{"x":-1.5},"gridUnits":true,"local":true}'],
                scaleToObject: 3.5,
                zIndex: 10
            }
        ]
    },
    netPostHit: {
        name: 'Net Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.baseItem',
                value: 'net'
            },
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.web.01',
                fileUsage: 'single',
                atLocation: ['i'],
                fadeOut: [6500, '{"ease":"easeInOutBack"}'],
                filter: ['ColorMatrix', 'jb2a.web.01', '`net`'],
                moveSpeed: 400,
                playbackRate: 0.5,
                scaleToObject: 1,
                zIndex: 10
            }
        ]
    },
    slashingPostHit: {
        name: 'Slashing Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            },
            {
                key: 'data?.damageFlavors?.includes(`slashing`)',
                value: true
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.melee_attack.04.trail.01.orangered.1',
                fileUsage: 'single',
                atLocation: ['data.token', '{"offset":{"x":-0.25},"gridUnits":true,"local":true}'],
                delay: 650,
                rotateTowards: ['i'],
                scaleToObject: 2,
                playbackRate: 0.65,
                zIndex: 2
            }
        ]
    },
    piercingPostHit: {
        name: 'Piercing Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            },
            {
                key: 'data?.damageFlavors?.includes(`piercing`)',
                value: true
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.impact.008.orange',
                fileUsage: 'single',
                filter: ['ColorMatrix', 'jb2a.impact.008.orange', '`piercing`', '{"brightness":0.7}'],
                atLocation: ['i', '{"offset":{"x":-0.5},"gridUnits":true,"local":true}'],
                delay: 970,
                rotateTowards: ['data.token'],
                scaleToObject: 1.3,
                playbackRate: 0.5,
                zIndex: 2
            }
        ]
    },
    bludgeoningPostHit: {
        name: 'Bludgeoning Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            },
            {
                key: 'data?.damageFlavors?.includes(`bludgeoning`)',
                value: true
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.smoke.puff.ring.01.white.1',
                fileUsage: 'single',
                atLocation: ['i'],
                delay: 800,
                scaleToObject: 1.5,
                zIndex: 2
            }
        ]
    },
    coloredWeaponPostHit: {
        name: 'Colored Weapon Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            },
            {
                key: 'needsColor(data)',
                value: true
            }
        ],
        targetType: 'multipleLoopPromise',
        async: true,
        timeout: 900,
        effects: [
            {
                files: 'Sequencer.Database.getEntry(`jb2a.eldritch_blast.purple`).file[`05ft`]',
                fileUsage: 'singleEval',
                async: true,
                atLocation: ['i'],
                delay: 1000,
                endTimePerc: 0.23,
                fadeOut: [800],
                filter: ['ColorMatrix', 'jb2a.eldritch_blast.purple', 'getColor(data)'],
                scaleToObject: 1.5,
                zIndex: 1
            }
        ]
    },
    conditionPostHit: {
        name: 'Condition Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            },
            {
                key: 'data?.conditions?.size > 0',
                value: true
            }
        ],
        targetType: 'multiple',
        async: true,
        effects: [
            {
                files: 'Sequencer.Database.getEntry(`jb2a.eldritch_blast.purple`).file[`05ft`]',
                fileUsage: 'singleEval',
                async: true,
                atLocation: ['i'],
                delay: 1000,
                endTimePerc: 0.23,
                fadeOut: [800],
                filter: ['ColorMatrix', 'jb2a.eldritch_blast.purple', 'getColor(data)'],
                scaleToObject: 1.5,
                zIndex: 1
            }
        ]
    },
    netMissPostHit: {
        name: 'Net Miss Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.baseItem',
                value: 'net'
            },
            {
                key: '!data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.smoke.puff.ring.01.white.1',
                fileUsage: 'single',
                atLocation: ['i'],
                scaleToObject: 1.5,
                zIndex: 1
            }
        ]
    },
    missPostHit: {
        name: 'Miss Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: '!data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            },
            {
                key: 'data.baseItem != `net`',
                value: true
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.smoke.puff.side.grey.4',
                fileUsage: 'single',
                atLocation: ['i'],
                delay: 950,
                filter: ['ColorMatrix', '`none`', '`none`', '{"brightness":2,"saturate":1}'],
                rotateTowards: ['data.token', '{"offset":{"x":0.5},"gridUnits":true,"local":true,"rotationOffset":180}'],
                scaleToObject: 1,
                zIndex: 1
            }
        ]
    },
    missColorPostHit: {
        name: 'Miss Color Post Hit',
        call: 'postHit',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: '!data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            },
            {
                key: 'needsColor(data)',
                value: true
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.swirling_leaves.outburst.01.pink',
                fileUsage: 'single',
                atLocation: ['i'],
                delay: 1100,
                filter: ['ColorMatrix', 'jb2a.swirling_leaves.outburst.01.pink', 'getColor(data)'],
                scaleToObject: 1,
                playbackRate: 1.25,
                zIndex: 1
            }
        ]
    },
    critWeaponDamage: {
        name: 'Crit Weapon Damage',
        call: 'damage',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.isCritical',
                value: true
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.liquid.splash.blue',
                fileUsage: 'single',
                atLocation: ['i'],
                belowTokens: true,
                delay: 970,
                filter: ['ColorMatrix', 'jb2a.liquid.splash.blue', '`piercing`', '{"brightness":0.75}'],
                scaleToObject: 1.5,
                zIndex: 2
            }
        ]
    },
    critColorDamage: {
        name: 'Crit Color Damage',
        call: 'damage',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.isCritical',
                value: true
            },
            {
                key: 'needsColor(data)',
                value: true
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.particle_burst.01.circle.bluepurple',
                fileUsage: 'single',
                atLocation: ['i'],
                delay: 1000,
                fadeOut: [500],
                filter: ['ColorMatrix', 'jb2a.particle_burst.01.circle.bluepurple', 'getColor(data)'],
                mirrorX: false,
                scaleToObject: 1.75,
                timeRange: [850, 1800],
                playbackRate: 0.75,
                zIndex: 1
            }
        ]
    },
    weaponDamage: {
        name: 'Weapon Damage',
        call: 'damage',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            }
        ],
        targetType: 'multiple',
        effects: [
            {
                files: 'jb2a.liquid.splash_side.blue',
                fileUsage: 'single',
                atLocation: ['i'],
                delay: 1100,
                filter: ['ColorMatrix', 'jb2a.liquid.splash.blue', '`piercing`', '{"brightness":0.6}'],
                rotateTowards: ['data.token', '{"offset":{"x":0.25},"gridUnits":true,"local":true,"rotationOffset":180}'],
                scaleToObject: 1.35,
                zIndex: 2
            }
        ]
    },
    weaponColorDamage: {
        name: 'Weapon Color Damage',
        call: 'damage',
        actionType: ['mwak', 'rwak'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.hitTargetsIds.includes(i.id)',
                value: 'postLoop'
            },
            {
                key: 'needsColor(data)',
                value: true
            },
            {
                key: 'data?.otherDamageHalfDamage != false',
                value: true
            }
        ],
        targetType: 'multiple',
        async: true,
        effects: [
            {
                files: 'jb2a.particle_burst.01.circle.bluepurple',
                fileUsage: 'single',
                async: true,
                atLocation: ['i'],
                fadeOut: [500],
                filter: ['ColorMatrix', 'jb2a.particle_burst.01.circle.bluepurple', 'getColor(data)'],
                scaleToObject: 1.25,
                timeRange: [850, 1800],
                playbackRate: 0.75,
                zIndex: 1
            }
        ]
    },
    saveFailFade: {
        name: 'Save Fail Fade',
        call: 'save',
        actionType: ['mwak', 'rwak', 'save'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.outcome === false',
                value: true
            },
            {
                key: 'data?.conditions?.size > 0',
                value: true
            },
            {
                key: 'defaultPreferences.conditionAbrevs[l]?.fade',
                value: 'postLoop'
            }
        ],
        targetType: 'loopOf',
        loopOf: 'data.conditions',
        effects: [
            {
                files: 'defaultPreferences.conditionAbrevs[i].file',
                fileUsage: 'singleEval',
                atLocation: ['data.targets[0]'],
                delay: 500,
                duration: 5500,
                fadeIn: [3000],
                fadeOut: [2000],
                playbackRate: 0.8,
                scaleToObject: 1.5,
            }
        ]
    },
    saveFailNoFade: {
        name: 'Save Fail No Fade',
        call: 'save',
        actionType: ['mwak', 'rwak', 'save'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.outcome === false',
                value: true
            },
            {
                key: 'data?.conditions?.size > 0',
                value: true
            },
            {
                key: 'defaultPreferences.conditionAbrevs[l]?.fade === false',
                value: 'postLoop'
            }
        ],
        targetType: 'loopOf',
        loopOf: 'data.conditions',
        effects: [
            {
                files: 'defaultPreferences.conditionAbrevs[i].file',
                fileUsage: 'singleEval',
                atLocation: ['data.targets[0]'],
                delay: 500,
                scaleToObject: 1.5,
            }
        ]
    },
    saveFailOtherDamage: {
        name: 'Save Fail Other Damage',
        call: 'save',
        actionType: ['mwak', 'rwak', 'save'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.outcome === false',
                value: true
            },
            {
                key: 'data?.otherDamageFlavors?.length > 0',
                value: true
            },
            {
                key: '!data.otherDamageHalfDamage',
                value: true
            }
        ],
        targetType: 'single',
        async: true,
        effects: [
            {
                files: 'jb2a.particle_burst.01.circle.bluepurple',
                fileUsage: 'single',
                async: true,
                atLocation: ['data.targets[0]'],
                delay: 800,
                fadeOut: [500],
                filter: ['ColorMatrix', 'jb2a.particle_burst.01.circle.bluepurple', 'getColor(data)'],
                playbackRate: 0.75,
                scaleToObject: 1.25,
                timeRange: [850, 1800],
                zIndex: 1
            }
        ]
    },
    saveSuceedWeapon: {
        name: 'Save Suceed Weapon',
        call: 'save',
        actionType: ['mwak', 'rwak', 'save'],
        itemType: 'weapon',
        requirements: [
            {
                key: 'data.outcome',
                value: true
            }
        ],
        targetType: 'single',
        effects: [
            {
                files: 'jb2a.energy_field.02.above.blue',
                fileUsage: 'single',
                atLocation: ['data.targets[0]'],
                belowTokens: false,
                delay: 1000,
                duration: 3000,
                filter: ['ColorMatrix', 'jb2a.energy_field.02.above.blue', 'getColor(data)'],
                playbackRate: 2,
                scaleToObject: 1,
                startTime: 1200
            }
        ]
    }
};

export let settings = {
    'initialize': initialize,
    'prototypeSetting': prototypeSetting,
    'exampleSetting': exampleSetting,
    'defaultSettings': defaultSettings
};