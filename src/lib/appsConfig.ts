interface AppParameter {
    type: string;
    description: string;
}

interface AppParameters {
    type: string;
    required?: string[];
    properties: Record<string, AppParameter>;
}

interface AppConfig {
    clientSide: boolean;
    name: string;
    hostOnly?: boolean;
    description: {
        info: string;
        end?: string;
    };
    parameters: AppParameters;
}

const defaults = {
    description: {
        end: 'Please do not enclose the "inputs" in quotes.'
    }
};

const appsData: Record<string, AppConfig> = {
    weather: {
        clientSide: true,
        name: "weather",
        description: {
            info: 'gets the weather for any latitude and longitude. If none is provided the app will use the user\'s current location, so there is not need to ask the user for it explicitly.',
        },
        parameters: {
            type: "object",
            properties: {
                latitude: {
                    type: "number",
                    description: 'a latitude'
                },
                longitude: {
                    type: "number",
                    description: 'a longitude'
                }
            }
        }
    },
    showHTML: {
        clientSide: true,
        name: "showHTML",
        description: {
            info: 'shows a html page',
        },
        parameters: {
            type: "object",
            required: ["html"],
            properties: {
                html: {
                    type: "string",
                    description: 'a string of html'
                }
            }
        }
    },
    webPageContent: {
        clientSide: false,
        name: "webPageContent",
        description: {
            info: 'gets the content of any web page',
            end: 'Please put all the links in to a list string that can be parsed using the JavaScript "JSON.parse()" method. If only one link: return ["{link}"] without quotes around the JSON array string.'
        },
        parameters: {
            type: "object",
            required: ["links"],
            properties: {
                links: {
                    type: "string",
                    description: 'a "JSON.parse()"able list string of links, if only one: return ["{link}"]'
                }
            }
        }
    },
    wikipediaArticle: {
        clientSide: false,
        name: "wikipediaArticle",
        description: {
            info: 'gets the content of a Wikipedia article',
        },
        parameters: {
            type: "object",
            required: ["title"],
            properties: {
                title: {
                    type: "string",
                    description: 'the title of the Wikipedia article'
                }
            }
        }
    },
    searchResult: {
        clientSide: false,
        name: "searchResult",
        description: {
            info: 'gets the search results for any query',
            end: 'Please put all the queries in to a list string that can be parsed using the JavaScript "JSON.parse()" method. If only one query: return ["{query}"] without quotes around the JSON array string. After calling this, call webPageContent with the links to get the content of the web pages. Make sure to cite sources.'
        },
        parameters: {
            type: "object",
            required: ["query"],
            properties: {
                query: {
                    type: "string",
                    description: 'the search query'
                }
            }
        }
    },
    createImage: {
        clientSide: true,
        name: "createImage",
        description: {
            info: 'uses dall-e to create an image',
        },
        parameters: {
            type: "object",
            required: ["prompt"],
            properties: {
                prompt: {
                    type: "string",
                    description: 'a prompt for dall-e'
                }
            }
        }
    },
    transcribeAudio: {
        clientSide: true,
        name: "transcribeAudio",
        description: {
            info: 'uses Whisper to transcribe an audio file',
        },
        parameters: {
            type: "object",
            required: ["audioFile"],
            properties: {
                audioFile: {
                    type: "string",
                    description: 'path to the audio file'
                }
            }
        }
    },
    liveImage: {
        clientSide: true,
        name: "liveImage",
        description: {
            info: 'can be used to take a live photo of the user (ex: what the use is wearing, sign-language, etc.). Also, if the user asks you for something that would require a photo of them, just jump the gun and call this to take the photo',
        },
        parameters: {
            type: "object",
            properties: {
                prompt: {
                    type: "string",
                    description: 'optional prompt for the user about what to capture'
                }
            }
        }
    }
};

const appsList = Object.keys(appsData);

let appsStr = `Apps List:\n`;

appsList.forEach((appName, i) => {
    const appData = appsData[appName];
    if (!appData) return;
    if (appData.hostOnly) return;
    
    // Get property names from parameters
    const propNames = Object.keys(appData.parameters.properties || {});
    
    const argNames = propNames.join(',');
    let argDescs = '';
    
    propNames.forEach((propName, i2) => {
        const prop = appData.parameters.properties[propName];
        if (i2 === 0) argDescs += 'where';
        else argDescs += ', ';
        if (i2 === propNames.length-1 && propNames.length > 1) argDescs += ' and ';
        argDescs += `${propName} is ${prop.description}`;
    });

    const appDesc = `The name of this app is ${appName}. "${appName}" ${appData.description.info}. If the user asks for something that you cannot provide, but fits the intended purpose of the "${appName}" app then please call ${appName}. You can call ${appName} by the following procedure. PLEASE ONLY RETURNING A JSON OBJECT AS FOLLOWS IN PLAIN TEXT. The Format: \`\`\`json{ "isApp": true, "appName": "${appName}", "args": [${argNames}] }\`\`\`; IF YOU RETURN THE CALL ANY OTHER WAY, IT    WON'T WORK. ${argDescs}. ${appData.description.end ?? defaults.description.end}`;
    
    if (i !== 0) appsStr += '\n';
    appsStr += appDesc;
});

export { appsData, appsList, appsStr };
export type { AppConfig, AppParameter, AppParameters }; 