const OLLAMA_CONFIG = {
    apiKey: "", // Add your API key in browser.storage.local.set({ ollamaApiKey: '...' })
    apiUrl: "https://api.ollama.com" 
};

// Function to get config from storage
async function getOllamaConfig() {
    const result = await browser.storage.local.get(['ollamaApiKey', 'ollamaApiUrl']);
    return {
        apiKey: result.ollamaApiKey || OLLAMA_CONFIG.apiKey,
        apiUrl: result.ollamaApiUrl || OLLAMA_CONFIG.apiUrl
    };
}

browser.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        console.log('NeuralForm installed successfully!');
        browser.storage.local.set({
            installDate: new Date().toISOString()
        });
        // Open onboarding page
        browser.tabs.create({
            url: browser.runtime.getURL('onboarding.html')
        });
    } else if (details.reason === 'update') {
        console.log('NeuralForm updated to version ' + browser.runtime.getManifest().version);
    }
});

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
        return JSON.parse(result.response);
    } catch (error) {
        console.error(`Error with ${model}:`, error);
        if (!isComplex) {
            // Fallback for simple fields to local if cloud fails
            console.warn('Cloud Ollama failed, attempting local fallback for simple fields...');
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
    const result = await response.json();
    return JSON.parse(result.response);
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'checkNewData') {
        getUserData().then(userData => {
            // Find if this field exists in our mapping
            const fieldKey = Object.keys(userData).find(key => key === request.field);
            
            // If field is missing or value is significantly different/new
            if (!userData[request.field] || userData[request.field] === '') {
                console.log('✨ [BACKGROUND] Found new data for:', request.field);
                // We could show a notification or small UI element here
                // For now, let's just save it silently to build the profile
                const newData = { [request.field]: request.value };
                saveUserData(newData);
            }
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
        browser.storage.local.get(null).then(function(data) {
            sendResponse({ success: true, data: data });
        }).catch(function(error) {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
});

console.log('NeuralForm: Background script loaded');
