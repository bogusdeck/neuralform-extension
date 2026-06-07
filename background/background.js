const extensionApi = typeof browser !== 'undefined' ? browser : chrome;
const DEBUG = false;
const OLLAMA_CONFIG = {
    apiKey: "",
    apiUrl: "https://api.ollama.com"
};

function debugLog(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

function debugWarn(...args) {
    if (DEBUG) {
        console.warn(...args);
    }
}

// Function to get config from storage
async function getOllamaConfig() {
    const result = await extensionApi.storage.local.get(['ollamaApiKey', 'ollamaApiUrl']);
    return {
        apiKey: result.ollamaApiKey || OLLAMA_CONFIG.apiKey,
        apiUrl: result.ollamaApiUrl || OLLAMA_CONFIG.apiUrl
    };
}

async function getStoredUserData() {
    return extensionApi.storage.local.get(null);
}

async function mergeStoredUserData(data) {
    await extensionApi.storage.local.set(data);
    return getStoredUserData();
}

extensionApi.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        debugLog('NeuralForm installed successfully!');
        extensionApi.storage.local.set({
            installDate: new Date().toISOString()
        });
        extensionApi.tabs.create({
            url: extensionApi.runtime.getURL('onboarding/onboarding.html')
        });
    } else if (details.reason === 'update') {
        debugLog('NeuralForm updated to version ' + extensionApi.runtime.getManifest().version);
    }
});

function parseOllamaMapping(result, model) {
    if (!result || typeof result.response !== 'string') {
        throw new Error(`Ollama (${model}) returned an invalid payload.`);
    }

    try {
        const parsed = JSON.parse(result.response);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error('Response was not a JSON object.');
        }
        return parsed;
    } catch (error) {
        throw new Error(`Ollama (${model}) returned malformed JSON: ${error.message}`);
    }
}

async function callOllama(formContext, userData, model = 'llama3') {
    const config = await getOllamaConfig();
    
    if (!config.apiKey && model === 'gemma') {
        throw new Error('Cloud Ollama API Key is missing. Please set it in the extension settings.');
    }

    const isComplex = model === 'gemma';
    const systemPrompt = isComplex 
        ? "You are a professional content generator. Generate long-form, descriptive text (like cover letters, statements of purpose, or detailed descriptions) based on user profile data."
        : "You are an expert form filler. Map the user's data to the form fields provided.";

    const prompt = `
    ${systemPrompt}
    
    User Data:
    ${JSON.stringify(userData)}
    
    Form Fields:
    ${JSON.stringify(formContext)}
    
    Task: Return a JSON object mapping the field "id" or "name" to the generated value.
    IMPORTANT: Return ONLY valid JSON. No explanations.
    `;

    try {
        const response = await fetch(`${config.apiUrl}/api/generate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
                format: 'json'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama (${model}) failed: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        return parseOllamaMapping(result, model);
    } catch (error) {
        console.error(`Error with ${model}:`, error);
        if (!isComplex) {
            debugWarn('Cloud Ollama failed, attempting local fallback for simple fields...');
            return callLocalOllama(formContext, userData, 'mistral');
        }
        throw error;
    }
}

async function callLocalOllama(formContext, userData, model) {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: model,
            prompt: `Map user data to fields: ${JSON.stringify(userData)} ${JSON.stringify(formContext)}`,
            stream: false,
            format: 'json'
        })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Local Ollama (${model}) failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return parseOllamaMapping(result, model);
}

extensionApi.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'checkNewData') {
        getStoredUserData().then(userData => {
            if (!userData[request.field] || userData[request.field] === '') {
                debugLog('Captured new data for:', request.field);
                const newData = { [request.field]: request.value };
                return mergeStoredUserData(newData);
            }
            return null;
        }).catch(error => {
            console.error('Error storing captured field:', error);
        });
        return true;
    }

    if (request.action === 'proxyOllama') {
        callOllama(request.context, request.userData, request.model)
            .then(mapping => sendResponse({ success: true, mapping: mapping }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; 
    }
    
    if (request.action === 'getData') {
        extensionApi.storage.local.get(null).then(function(data) {
            sendResponse({ success: true, data: data });
        }).catch(function(error) {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
});

debugLog('NeuralForm: Background script loaded');
