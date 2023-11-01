let animations = {
    'jb2a.template_line_piercing.generic.01.orange.15ft': {
        'hue': 36,
        'saturate': .91,
        'brightness': 0.63
    },
    'jb2a.impact.010.orange': {
        'hue': 46,
        'saturate': .68,
        'brightness': 0.65
    },
    'jb2a.cast_generic.01.yellow.0': {
        'hue': 62,
        'saturate': .93,
        'brightness': .82
    },
    'jb2a.impact.006.yellow': {
        'hue': 48,
        'saturate': 1,
        'brightness': .92
    },
    'jb2a.cast_generic.fire.side01.orange.0': {
        'hue': 49,
        'saturate': .93,
        'brightness': .63
    },
    'jb2a.cast_generic.02.blue.0': {
        'hue': 212,
        'saturate': .93,
        'brightness': .67
    },
    'jb2a.energy_strands.range.standard.purple.04': {
        'hue': 271,
        'saturate': .91,
        'brightness': .62
    },
    'jb2a.energy_strands.in.green.01.0': {
        'hue': 75,
        'saturate': .71,
        'brightness': .58
    },
    'jb2a.energy_field.02.above.blue': { 
        'hue': 189,
        'saturate': .80,
        'brightness': .75
    },
    'jb2a.particles.outward.greenyellow.02.01': {
        'hue': 84,
        'saturate': .51,
        'brightness': .69
    },
    'jb2a.markers.bubble.intro.blue': {
        'hue': 190,
        'saturate': .57,
        'brightness': .58
    },
    'jb2a.markers.bubble.outro.blue': {
        'hue': 190,
        'saturate': .57,
        'brightness': .58
    },
    'jb2a.markers.runes03.dark_orange.01': {
        'hue': 28,
        'saturate': .98,
        'brightness': .44
    },
    'jb2a.impact.008.orange': {
        'hue': 49,
        'saturate': .92,
        'brightness': .49
    },
    'jb2a.impact.water.02.blue.0': {
        'hue': 217,
        'saturate': .43,
        'brightness': .67
    },
    'jb2a.liquid.splash.blue': {
        'hue': 210,
        'saturate': .64,
        'brightness': .61
    }
};
let colors = {
    'abj': {
        'hue': 205,
        'saturate': .83,
        'brightness': .75
    },
    'con': {
        'hue': 44,
        'saturate': .89,
        'brightness': .69
    },
    'div': {
        'hue': 202,
        'saturate': .40,
        'brightness': .80
    },
    'enc': {
        'hue': 314,
        'saturate': .70,
        'brightness': .72
    },
    'evo': {
        'hue': 10,
        'saturate': .80,
        'brightness': .70
    },
    'ill': {
        'hue': 263,
        'saturate': 0.92,
        'brightness': .80
    },
    'nec': {
        'hue': 92,
        'saturate': .79,
        'brightness': .73
    },
    'trs': {
        'hue': 26,
        'saturate': .93,
        'brightness': .71
    },
    'acid': {
        'hue': 122,
        'saturate': 1,
        'brightness': .51
    },
    'bludeoning': {
        'hue': 200,
        'saturate': .15,
        'brightness': .54
    },
    'cold': {
        'hue': 207,
        'saturate': .90,
        'brightness': .54
    },
    'fire': {
        'hue': 31,
        'saturate': 1,
        'brightness': .50
    },
    'force': {
        'hue': 0,
        'saturate': 0,
        'brightness': .96
    },
    'lightning': {
        'hue': 187,
        'saturate': .71,
        'brightness': .59
    },
    'necrotic': {
        'hue': 246,
        'saturate': 1,
        'brightness': .06
    },
    'piercing': {
        'hue': 0,
        'saturate': 1,
        'brightness': .25
    },
    'poison': {
        'hue': 125,
        'saturate': 1,
        'brightness': .27
    },
    'psychic': {
        'hue': 274,
        'saturate': 1,
        'brightness': .70
    },
    'radiant': {
        'hue': 58,
        'saturate': 1,
        'brightness': .64
    },
    'slashing': {
        'hue': 0,
        'saturate': 1,
        'brightness': .5
    },
    'thunder': {
        'hue': 57,
        'saturate': 1,
        'brightness': .88
    }
};
let defaultMatrix = {
    'brightness': 1,
    'saturate': 0,
    'hue': 0    
}
export function colorMatrix(animation, color) {
    if (!Object.keys(animations).includes(animation)) return defaultMatrix;
    if (!Object.keys(colors).includes(color)) return defaultMatrix;
    let matrix = {
        'brightness': colors[color].brightness + 1,
        'saturate': colors[color].saturate - animations[animation].saturate,
        'hue': colors[color].hue - animations[animation].hue
    }
    return matrix;
}