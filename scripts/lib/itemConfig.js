export function createHeaderButton(config, buttons) {
    if (config.object instanceof Item) {
        buttons.unshift({
            'icon': 'fa-solid fa-globe',
            'class': 'universalAnimations',
            'title': 'Universal Animations Item Config',
            'label': 'UA',
            'onclick': () => itemConfig(config.object)
        });
    }
}
async function itemConfig(itemDocument) {
    let currentConfig = itemDocument.flags?.universalAnimations?.override ?? 'default'
    let currentCheck = {
        'default': currentConfig === 'default' ? `checked` : ``,
        'neverPlay': currentConfig === 'neverPlay' ? `checked` : ``,
        'alwaysPlay': currentConfig === 'alwaysPlay' ? `checked` : ``,
    }
    new Promise(async (resolve) => {
        new Dialog({
            title: 'Configure Override of Universal Animation',
            content: `
                <div style="display: flex; flex-direction: column; padding: 5px; gap: 10px; margin-bottom: 10px; font-size: 16px">
                    <label>
                        <input type = 'radio' name = 'override' value = 'default' ` + currentCheck.default + `> Default
                    </label>
                    <label>
                        <input type = 'radio' name = 'override' value = 'neverPlay' ` + currentCheck.neverPlay + `> Never Play
                    </label>
                    <label>
                        <input type = 'radio' name = 'override' value = 'alwaysPlay' ` + currentCheck.alwaysPlay + `> Always Play
                    </label>
                </div>`,
            buttons: {
                cancel: {
                    label: `Cancel`, 
                    callback: () => resolve(false)
                }, 
                save: {
                    label: `Save`, 
                    callback: async (html) => resolve(await updateItem(itemDocument, html)),
                },
            },
            close: () => resolve(false)
        }).render(true);
    })
    async function updateItem(itemDocument, html) {
        let option = html.find('[name="override"]:checked').val()
        let updates = {'flags.universalAnimations.override': option}
        await itemDocument.update(updates);
    }
}