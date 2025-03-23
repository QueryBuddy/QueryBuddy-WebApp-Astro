import appsConfig from './appsConfig.js'

export async function callFunction(name, args) {
    const appConfig = appsConfig.appsData[name]
    // console.log(appConfig)
    if (!appConfig) {
        console.log(`Error: Function ${name} not found`)
        return `Error: Function ${name} not found`
    }

    if (appConfig.clientSide) {
        return {result: '', callModel: false}
    }
    else {
        const func = await import(`./apps/${name}.js`)
        const result = await func.default(args)
        return {result, callModel: true}
    }

}
