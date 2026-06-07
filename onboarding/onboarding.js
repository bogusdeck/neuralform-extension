let currentStep = 1;
const extensionApi = typeof browser !== 'undefined' ? browser : chrome;

function nextStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    document.getElementById('progressFill').style.width = (step * 33) + '%';
}

function injectFields(data) {
    const container = document.getElementById('onboardingForm');
    const fields = ['firstName', 'lastName', 'email', 'phone', 'degree', 'institution'];

    container.replaceChildren();

    fields.forEach((field) => {
        const group = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');

        group.className = 'form-group';
        label.textContent = field;
        input.type = 'text';
        input.id = `ob_${field}`;
        input.value = data[field] || '';

        group.appendChild(label);
        group.appendChild(input);
        container.appendChild(group);
    });
}

function openManualEntry() {
    injectFields({});
    nextStep(3);
}

async function saveProfile() {
    const data = {};
    document.querySelectorAll('#onboardingForm input').forEach((input) => {
        data[input.id.replace('ob_', '')] = input.value;
    });

    try {
        await saveUserData(data);
        await extensionApi.storage.local.set({ onboardingComplete: true });
        nextStep(4);
    } catch (error) {
        alert('Error saving data: ' + error.message);
    }
}

function handleCvSelection(file, parseStatus) {
    if (!file) {
        return;
    }

    parseStatus.textContent = `Selected: ${file.name}. CV parsing is not implemented in this build, so continue with manual entry.`;
    injectFields({});
    nextStep(3);
}

document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const cvFileInput = document.getElementById('cvFile');
    const parseStatus = document.getElementById('parseStatus');

    document.getElementById('getStartedBtn').addEventListener('click', () => nextStep(2));
    document.getElementById('skipManualBtn').addEventListener('click', openManualEntry);
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    document.getElementById('openProfileBtn').addEventListener('click', () => {
        window.location.href = '../tools/add-user-profile-firebase.html';
    });
    document.getElementById('closeOnboardingBtn').addEventListener('click', () => {
        window.close();
    });

    dropzone.addEventListener('click', () => cvFileInput.click());
    cvFileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        handleCvSelection(file, parseStatus);
    });
});
