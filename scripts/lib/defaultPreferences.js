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
};
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
            'ranged': ['jb2a.dagger.throw.01.white'],
            'patreon': {
                'melee': ['jb2a.dagger.melee.fire.white'],
                'ranged': ['jb2a.dagger.throw.02.white']
            }
        }
    },
    'greatclub': {
        'animations': ['jb2a.greatclub.standard.white']
    },
    'handaxe': {
        'animations': {
            'melee': ['jb2a.handaxe.melee.standard.white'],
            'ranged': ['jb2a.throwable.launch.cannon_ball.01.black'],
            'patreon': {
                'melee': ['jb2a.handaxe.melee.standard.white'],
                'ranged': ['jb2a.handaxe.throw.02']
            }
        }
    },
    'javelin': {
        'animations': {
            'ranged': ['jb2a.arrow.physical.white.01'],
            'melee': [
                'jb2a.spear.melee.01.white.0',
                'jb2a.spear.melee.01.white.1',
                'jb2a.spear.melee.01.white.2',
                'jb2a.spear.melee.01.white.3',
                'jb2a.spear.melee.01.white.4',
                'jb2a.spear.melee.01.white.5'
            ],
            'patreon': {
                'melee': [
                    'jb2a.spear.melee.01.white.0',
                    'jb2a.spear.melee.01.white.1', // Actual Melee options don't exsist...
                    'jb2a.spear.melee.01.white.2',
                    'jb2a.spear.melee.01.white.3',
                    'jb2a.spear.melee.01.white.4',
                    'jb2a.spear.melee.01.white.5'
                ],
                'ranged': ['jb2a.javelin.01.throw']
            }
        }
    },
    'lighthammer': {
        'animations': {
            'ranged': ['jb2a.throwable.launch.cannon_ball.01.black'],
            'melee': [
                'jb2a.hammer.melee.01.white.0',
                'jb2a.hammer.melee.01.white.1',
                'jb2a.hammer.melee.01.white.2',
                'jb2a.hammer.melee.01.white.3',
                'jb2a.hammer.melee.01.white.4',
                'jb2a.hammer.melee.01.white.5'
            ],
            'patreon': {
                'melee': [
                    'jb2a.hammer.melee.01.white.0',
                    'jb2a.hammer.melee.01.white.1',
                    'jb2a.hammer.melee.01.white.2',
                    'jb2a.hammer.melee.01.white.3',
                    'jb2a.hammer.melee.01.white.4',
                    'jb2a.hammer.melee.01.white.5'
                ],
                'ranged': ['jb2a.hammer.throw']
            }
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
            'ranged': ['jb2a.arrow.physical.white.01'],
            'melee': [
                'jb2a.spear.melee.01.white.0',
                'jb2a.spear.melee.01.white.1',
                'jb2a.spear.melee.01.white.2',
                'jb2a.spear.melee.01.white.3',
                'jb2a.spear.melee.01.white.4',
                'jb2a.spear.melee.01.white.5'
            ],
            'patreon': {
                'melee': [
                    'jb2a.spear.melee.01.white.0',
                    'jb2a.spear.melee.01.white.1',
                    'jb2a.spear.melee.01.white.2',
                    'jb2a.spear.melee.01.white.3',
                    'jb2a.spear.melee.01.white.4',
                    'jb2a.spear.melee.01.white.5'
                ],
                'ranged': ['jb2a.spear.throw']
            }
        }
    },
    'lightcrossbow': {
        'animations': {
            'ranged': ['jb2a.bolt.physical.orange'],
            'melee': ['jb2a.bolt.physical.orange'],
            'patreon': {
                'ranged': ['jb2a.bolt.physical.white02']
            }
        }
    },
    'dart': {
        'animations': {
            'ranged': ['jb2a.arrow.physical.white.01'],
            'melee': ['jb2a.arrow.physical.white.01'],
            'patreon': {
                'ranged': ['jb2a.dart.01.throw.physical.white']
            }
        }
    },
    'shortbow': {
        'animations': ['jb2a.arrow.physical.white.01']
    },
    'sling': {
        'animations': {
            'ranged': ['jb2a.throwable.launch.cannon_ball.01.black'],
            'melee': ['jb2a.throwable.launch.cannon_ball.01.black'],
            'patreon': {
                'ranged': ['jb2a.slingshot']
            }
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
        'animations': {
            'melee': ['jb2a.maul.melee.standard.white'],
            'ranged': ['jb2a.maul.melee.standard.white'],
            'patreon': [
                'jb2a.melee_attack.03.maul.01.0',
                'jb2a.melee_attack.03.maul.01.1',
                'jb2a.melee_attack.03.maul.01.2',
                'jb2a.melee_attack.03.maul.01.3'
            ]
        }
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
    },
    'handcrossbow': {
        'animations': {
            'ranged': ['jb2a.bolt.physical.orange'],
            'melee': ['jb2a.bolt.physical.orange'],
            'patreon': {
                'ranged': ['jb2a.bolt.physical.white02']
            }
        }
    },
    'heavycrossbow': {
        'animations': {
            'ranged': ['jb2a.bolt.physical.orange'],
            'melee': ['jb2a.bolt.physical.orange'],
            'patreon': {
                'ranged': ['jb2a.bolt.physical.white02']
            }
        }
    },
    'longbow': {
        'animations': ['jb2a.arrow.physical.white.01'],
    },
    'firearmRenaissance': {
        'animations': ['jb2a.bullet.02.orange']
    },
    'firearmModern': {
        'animations': ['jb2a.bullet.01.orange']
    },
    'firearmFuturistic': {
        'animations': ['jb2a.lasershot.blue']
    }
};
const patreonArrows = {
    'acid': {
        'animations': ['jb2a.arrow.physical.green']
    },
    'cold': {
        'animations': ['jb2a.arrow.cold.blue']
    },
    'fire': {
        'animations': ['jb2a.arrow.fire.orange']
    },
    'force': {
        'animations': ['jb2a.arrow.physical.white.02']
    },
    'lightning': {
        'animations': ['jb2a.arrow.lightning.blue']
    },
    'necrotic': {
        'animations': ['jb2a.arrow.poison.purple']
    },
    'poison': {
        'animations': ['jb2a.arrow.poison.green.02']
    },
    'psychic': {
        'animations': ['jb2a.arrow.lightning.purple']
    },
    'radiant': {
        'animations': ['jb2a.arrow.physical.orange']
    },
    'thunder': {
        'animations': ['jb2a.arrow.lightning.orange']
    },
    'uncommon': {
        'animations': ['jb2a.arrow.physical.green']
    },
    'rare': {
        'animations': ['jb2a.arrow.physical.blue']
    },
    'veryRare': {
        'animations': ['jb2a.arrow.physical.purple']
    },
    'legendary': {
        'animations': ['jb2a.arrow.physical.orange']
    },
    'artifact': {
        'animations': ['jb2a.arrow.physical.red']
    }
};
const patreonBolts = {
    'acid': {
        'animations': ['jb2a.bolt.physical.green']
    },
    'cold': {
        'animations': ['jb2a.bolt.cold.blue']
    },
    'fire': {
        'animations': ['jb2a.bolt.fire.orange']
    },
    'force': {
        'animations': ['jb2a.bolt.physical.white']
    },
    'lightning': {
        'animations': ['jb2a.bolt.lightning.blue']
    },
    'necrotic': {
        'animations': ['jb2a.bolt.poison.purple']
    },
    'poison': {
        'animations': ['jb2a.bolt.poison.green.02']
    },
    'psychic': {
        'animations': ['jb2a.bolt.lightning.purple']
    },
    'radiant': {
        'animations': ['jb2a.bolt.physical.orange']
    },
    'thunder': {
        'animations': ['jb2a.bolt.lightning.orange']
    },
    'uncommon': {
        'animations': ['jb2a.bolt.physical.green']
    },
    'rare': {
        'animations': ['jb2a.bolt.physical.blue']
    },
    'veryRare': {
        'animations': ['jb2a.bolt.physical.purple']
    },
    'legendary': {
        'animations': ['jb2a.bolt.physical.pink']
    },
    'artifact': {
        'animations': ['jb2a.bolt.physical.red']
    }
};
const pateronLasershots = {
    'uncommon': {
        'animations': ['jb2a.lasershot.green.30ft']
    },
    'rare': {
        'animations': ['jb2a.lasershot.pink']
    },
    'veryRare': {
        'animations': ['jb2a.lasershot.purple']
    },
    'legendary': {
        'animations': ['jb2a.lasershot.orange']
    },
    'artifact': {
        'animations': ['jb2a.lasershot.red']
    }
};
const patreonBullets01 = {
    'uncommon': {
        'animations': ['jb2a.bullet.01.green']
    },
    'rare': {
        'animations': ['jb2a.bullet.01.blue']
    },
    'veryRare': {
        'animations': ['jb2a.bullet.01.purple']
    },
    'legendary': {
        'animations': ['jb2a.bullet.01.orange']
    },
    'artifact': {
        'animations': ['jb2a.bullet.01.red']
    }
};
const patreonBullets02 = {
    'uncommon': {
        'animations': ['jb2a.bullet.02.green']
    },
    'rare': {
        'animations': ['jb2a.bullet.02.blue']
    },
    'veryRare': {
        'animations': ['jb2a.bullet.02.purple']
    },
    'legendary': {
        'animations': ['jb2a.bullet.02.orange']
    },
    'artifact': {
        'animations': ['jb2a.bullet.02.red']
    }
};
const glows = {
    'acid': '0x05FF0F',
    'cold': '0x2196F3',
    'fire': '0xFF8200',
    'force': '0xF5F5F5',
    'lightning': '0x4DD0E1',
    'necrotic': '0x03001D',
    'poison': '0x00880B',
    'psychic': '0xBD66FF',
    'radiant': '0xFFFA47',
    'thunder': '0xFFFCC4',
    'uncommon': '0x1FC219',
    'rare': '0x4990E2',
    'veryRare': '0x9810E0',
    'legendary': '0xFEA227',
    'artifact': '0xE34B39',
    'ada': '0x66BB6A',
    'sil': '0xB0BEC5',
    'mgc': '0x886EFF'
}
export let defaultPreferences = {
    'spellSchools': spellSchools,
    'conditionAbrevs': conditionsAbrevs,
    'baseWeapons': baseWeapons,
    'arrow': patreonArrows,
    'bolt': patreonBolts,
    'lasershot': pateronLasershots,
    'bullet01': patreonBullets01,
    'bullet02': patreonBullets02,
    'glows': glows
}