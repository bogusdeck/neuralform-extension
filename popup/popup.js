const DEBUG = false;

function debugLog(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

async function loadUserData() {
    try {
        showStatus('Loading your data...', 'info');
        const userData = await getUserData();

        if (userData) {
            debugLog('Popup loaded user data', userData);
            showStatus('Data loaded successfully! ✅', 'success');
        } else {
            showStatus('No data found. Please add your details.', 'error');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showStatus('Error loading data. Click "Add Details" to add your info.', 'error');
    }
}

function fillCurrentPage() {
    browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'fillForm' }).then(function(response) {
            if (response && response.success) {
                showStatus('Form filled successfully! Fields filled: ' + response.fieldsCount, 'success');
            } else {
                showStatus('No form fields detected on this page', 'error');
            }
        }).catch(function(error) {
            console.error('Error filling form:', error);
            showStatus('Error: ' + error.message, 'error');
        });
    });
}

function openAddDetails() {
    browser.tabs.create({
        url: browser.runtime.getURL('tools/add-user-profile-firebase.html')
    }).then(function() {
        window.close();
    }).catch(function(error) {
        showStatus('Error opening form: ' + error.message, 'error');
    });
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;

    setTimeout(function() {
        statusEl.textContent = '';
        statusEl.className = 'status';
    }, 3000);
}

let currentMapping = {};

async function aiFillCurrentPage() {
    showStatus('Analyzing form with AI...', 'info');

    try {
        const userData = await getUserData();
        if (!userData) {
            showStatus('Please add your details first.', 'error');
            return;
        }

        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];

        const contextResponse = await browser.tabs.sendMessage(activeTab.id, { action: 'getFormContext' });
        
        if (!contextResponse || !contextResponse.success || contextResponse.context.length === 0) {
            showStatus('No form fields detected.', 'error');
            return;
        }

        showStatus('AI is generating data...', 'info');
        
        // Categorize fields for different AI tiers
        const simpleFields = [];
        const complexFields = [];
        
        contextResponse.context.forEach(field => {
            const type = (field.type || '').toLowerCase();
            const tagName = field.tagName.toLowerCase();
            
            if (tagName === 'textarea' || (tagName === 'input' && type === 'text' && field.name.toLowerCase().includes('cover'))) {
                complexFields.push(field);
            } else {
                simpleFields.push(field);
            }
        });

        let finalMapping = {};

        if (simpleFields.length > 0) {
            const simpleMapping = await callOllama(simpleFields, userData, 'llama3');
            finalMapping = { ...finalMapping, ...simpleMapping };
        }

        if (complexFields.length > 0) {
            showStatus('Generating complex content with Gemma...', 'info');
            const complexMapping = await callOllama(complexFields, userData, 'gemma');
            finalMapping = { ...finalMapping, ...complexMapping };
        }

        currentMapping = finalMapping;
        showReviewLayer(finalMapping, contextResponse.context);

    } catch (error) {
        console.error('AI fill error:', error);
        showStatus('AI error: ' + error.message, 'error');
    }
}

function showReviewLayer(mapping, formContext) {
    const reviewLayer = document.getElementById('reviewLayer');
    const reviewFields = document.getElementById('reviewFields');
    reviewFields.replaceChildren();

    Object.keys(mapping).forEach(idOrName => {
        const fieldInfo = formContext.find(f => f.id === idOrName || f.name === idOrName);
        const labelText = fieldInfo ? (fieldInfo.label || fieldInfo.placeholder || idOrName) : idOrName;
        
        const item = document.createElement('div');
        const label = document.createElement('label');
        const textarea = document.createElement('textarea');

        item.className = 'review-item';
        label.textContent = labelText;
        textarea.dataset.key = idOrName;
        textarea.value = mapping[idOrName];

        item.appendChild(label);
        item.appendChild(textarea);
        reviewFields.appendChild(item);
    });

    reviewLayer.style.display = 'flex';
    document.querySelector('.actions').style.display = 'none';
}

function hideReviewLayer() {
    document.getElementById('reviewLayer').style.display = 'none';
    document.querySelector('.actions').style.display = 'flex';
}

async function confirmAiFill() {
    const textareas = document.querySelectorAll('#reviewFields textarea');
    const updatedMapping = {};
    
    textareas.forEach(ta => {
        updatedMapping[ta.dataset.key] = ta.value;
    });

    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    const fillResponse = await browser.tabs.sendMessage(activeTab.id, { 
        action: 'aiFill', 
        mapping: updatedMapping 
    });

    if (fillResponse && fillResponse.success) {
        showStatus('AI Fill complete! Fields filled: ' + fillResponse.fieldsCount, 'success');
        hideReviewLayer();
    } else {
        showStatus('AI failed to fill the form.', 'error');
    }
}

async function callOllama(formContext, userData, model = 'llama3') {
    try {
        const response = await browser.runtime.sendMessage({
            action: 'proxyOllama',
            context: formContext,
            userData: userData,
            model: model
        });

        if (!response || !response.success) {
            throw new Error(response ? response.error : 'No response from background script');
        }

        return response.mapping;
    } catch (error) {
        console.error('AI proxy error:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadUserData();

    document.getElementById('fillBtn').addEventListener('click', fillCurrentPage);
    document.getElementById('aiFillBtn').addEventListener('click', aiFillCurrentPage);
    document.getElementById('addDetailsBtn').addEventListener('click', openAddDetails);
    
    document.getElementById('confirmReviewBtn').addEventListener('click', confirmAiFill);
    document.getElementById('cancelReviewBtn').addEventListener('click', hideReviewLayer);
});
