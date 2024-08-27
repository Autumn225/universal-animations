## Release 0.3.4
- Fix for Midi-QOL overtimes (and any other spell-type item without a spell school)
  
## Release 0.3.3
- Fixed problem in handler for gridless midi-qol settings.
  
## Release 0.3.2
- Updated deprecated distance checking functions for v12, should now also support gridless in v11 and v12 (thanks to tposney).
- Verified module for v12 and D&D 3.X+
  
## Release 0.3.1
- Added try block around comparing item name to AA autorec settings, should stop a weird error that I've not managed to reproduce myself.
  
## Release 0.3.0
- Compatibility for D&D System 3.0.x, backwards compatible with 2.4.1.
- Beta version of settings for animations, it's functional but ugly.
  - Settings are only saved when you press confirm or yes.
  - Will also make settings menus for colorMatrix entries and color preferences (currently defaultPreferences.js).
  - Will work on the CSS of the menus after that's made.
  - Will then make documentation for how to customize settings. Animation properties are exactly as named in sequencer. Look at the current animations if you want to mess around with customizing.
  
## Release 0.2.0
- Complete refactor of animation process. 
  - Animations are systemactically played now, which paves the way for real settings and custom animations. 
  - Everything should look the same, some timing may be different. Please let me know anything that looks off or different.
- Compatibility with Midi's range checking/changing attacking token.
  
## Release 0.1.4
- Fixed effect finding to not cause deprecation warning.
- Fixed error thrown on attacks workflows without a damage type.
  
## Release 0.1.3
- Fixed (another) bug causing errors on non-weapons.
  
## Release 0.1.2
- Fixed bug causing errors on non-weapons.
  
## Release 0.1.1
- Added coloring for weapon hits based on conditions.
- Condition animations will now play from ammo as well.
- Fixed typo bug that broke post hit weapon animations.
  
# Release 0.1.0
- Animations for ranged attacks, including guns.
- Animations for unarmed strike.
- Animations for nets.
- Animations for magical weapon attacks.
  - Will use JB2A Patreon arrows/bolts/bullets when applicable.
  - Will add a glow effect to the weapon's animation.
  - Animation for secondary damage types, as well as "other" damage.
  - Animation for failed/success saves, animation based on condition applied and/or damage type.
- UA title bar button will work on all items.
- Fix for ranged weapon animations.
  
## Release 0.0.5
- Patreon animations for weapon attacks. This only includes regular weapons animations currently.
  - Default dagger animation for patreon users is now "jb2a.dagger.melee.fire.white". The regular option included in the free version isn't supposed to exist and is not included in the patreon version.
- Replaced item macro animation finding method with title bar button to override animations per individual item.
  - This can override in both directions. This option will be given priority in animation checking.
  - Icon is a globe, label is "UA". There will be a *future* setting to hide this button. Menu will eventually be expanded and will be made less ugly.
- Added check for existence of a JB2A module.
- Fixed misname for light hammer animations.
  
## Release 0.0.4
- Animations for weapon attacks, uses base item for weapon, details based on hit/miss, damage type, and if critical.
- Better recognition for other animations: 
  - UA will now play if the global match on an item is disabled.
  - UA will not play if an item macro is found on the item with "new Sequence()" anywhere in it.
- Changed how "is hit" is tracked.
### *Notes*
- Weapon animations are free version only currently, patreon versions will be added next (likely tomorrow). This means some of them are a little janky due to not having animations.
- Proper way to disable/enable UAs per item will also come soon.
  
## Release 0.0.3
- Bug fix for not installing in v11

## Release 0.0.2
- Animations for ritual spells based on spell school.
- Animations for 'Other' and 'Utility' spells based on conditions, or disposition colored by spell school.
- Bug fix for save animation for spells without damage.
- Bug fix for save animation outro file.
  
## Alpha Release (v0.0.1)
- All initial content, see [ReadMe](README.md)
