## Release 0.0.5
- Patereon animations for weapon attacks. This only includes regular weapons animations currently.
  - Default dagger animation for patereon users is now "jb2a.dagger.melee.fire.white". The regular option included in the free version isn't supposed to exsist and is not included in the patreon version.
- Replaced item macro animation finding method with title bar button to override animations per indiviual item.
  - This can override in both directions. This option will be given priority in animation checking.
  - Icon is a globe, label is "UA". There will be a *future* setting to hide this button. Menu will eventually be expanded and will be made less ugly.
- Added check for exsistence of a JB2A module.
- Fixed misname for light hammer animations,
  
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