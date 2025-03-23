import fs from 'fs'

const importFile = async (model) => {
    const a = await import(`../models/${model}.ts`);
    return a.default;
}

var modelFiles = fs.readdirSync('./models')

const models = {}

modelFiles.forEach(async model => {
    if (model.endsWith('.js')) model = model.slice(0, -1*'.js'.length)

    var actions = await importFile(model) || await importFile('_Test-Model') || {};
    var config = actions.config
    actions.config = 'SeeParent'

    models[model] = config

    models[model].model = model
    models[model].provider = { id: config.provider.toLowerCase(), name: config.provider }
    models[model].actions = actions
})

export default models;