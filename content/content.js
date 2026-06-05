const fieldMapping = {
    firstName: ['firstname', 'first-name', 'first_name', 'fname', 'given-name', 'givenname'],
    lastName: ['lastname', 'last-name', 'last_name', 'lname', 'surname', 'family-name', 'familyname'],
    fullName: ['fullname', 'full-name', 'full_name', 'name', 'your-name', 'yourname', 'candidate-name', 'applicant-name'],
    email: ['email', 'e-mail', 'email-address', 'emailaddress', 'user-email', 'useremail'],
    phone: ['phone', 'telephone', 'mobile', 'cell', 'phone-number', 'phonenumber', 'tel'],
    alternatePhone: ['alternate-phone', 'alt-phone', 'phone2', 'secondary-phone'],
    address: ['address', 'street', 'address1', 'address-line-1', 'street-address', 'addressline1', 'permanent-address'],
    address2: ['address2', 'address-line-2', 'addressline2', 'apt', 'suite', 'unit', 'current-address'],
    city: ['city', 'town', 'locality'],
    state: ['state', 'province', 'region', 'county', 'state-district'],
    zipCode: ['zip', 'zipcode', 'postal', 'postalcode', 'postal-code', 'postcode', 'pincode'],
    country: ['country', 'country-name', 'nationality'],
    dob: ['dob', 'date-of-birth', 'birthdate', 'birthday', 'birth-date'],
    gender: ['gender', 'sex'],
    category: ['category', 'caste', 'category-caste'],
    nationality: ['nationality', 'citizen'],
    fatherName: ['father-name', 'fathername', 'fathers-name', 'father', 'father-surname'],
    motherName: ['mother-name', 'mothername', 'mothers-name', 'mother', 'mother-maiden'],
    degree: ['degree', 'qualification', 'course', 'certificate', 'education'],
    institution: ['institution', 'university', 'college', 'school', 'institute'],
    yearOfPassing: ['year-of-passing', 'passing-year', 'year', 'graduation-year', 'completion-year'],
    percentageCgpa: ['percentage', 'cgpa', 'marks', 'grade', 'score', 'percentage-cgpa'],
    boardUniversity: ['board', 'university', 'board-university', 'exam-board'],
    preferredCenter: ['preferred-center', 'exam-center', 'center', 'centre', 'exam-venue'],
    subjectPreference: ['subject', 'subject-preference', 'paper', 'paper-preference', 'stream'],
    languagePreference: ['language', 'language-preference', 'exam-language', 'medium'],
    idProofType: ['id-proof', 'id-type', 'proof-type', 'identity-proof'],
    idNumber: ['id-number', 'id-no', 'document-number', 'aadhaar-no', 'pan-no'],
    disabilityStatus: ['disability', 'disability-status', 'pwd', 'physically-challenged'],
    workExperience: ['work-experience', 'experience', 'work-history', 'employment']
};

function matchesFieldName(inputElement, keywords) {
    const name = (inputElement.name || '').toLowerCase();
    const id = (inputElement.id || '').toLowerCase();
    const placeholder = (inputElement.placeholder || '').toLowerCase();
    const label = getAssociatedLabel(inputElement);
    const ariaLabel = (inputElement.getAttribute('aria-label') || '').toLowerCase();

    return keywords.some(function(keyword) {
        return name.includes(keyword) ||
               id.includes(keyword) ||
               placeholder.includes(keyword) ||
               label.includes(keyword) ||
               ariaLabel.includes(keyword);
    });
}

function getAssociatedLabel(inputElement) {
    if (inputElement.labels && inputElement.labels.length > 0) {
        return inputElement.labels[0].textContent.toLowerCase();
    }

    const labelFor = document.querySelector('label[for="' + inputElement.id + '"]');
    if (labelFor) {
        return labelFor.textContent.toLowerCase();
    }

    const parentLabel = inputElement.closest('label');
    if (parentLabel) {
        return parentLabel.textContent.toLowerCase();
    }

    return '';
}

function fillFormFields(userData) {
    let fieldsCount = 0;
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(function(input) {
        if (input.readOnly || input.disabled) {
            return;
        }

        for (const fieldKey in fieldMapping) {
            if (userData[fieldKey] && matchesFieldName(input, fieldMapping[fieldKey])) {
                const inputType = (input.type || '').toLowerCase();

                if (input.tagName === 'SELECT') {
                    fillSelectField(input, userData[fieldKey]);
                    fieldsCount++;
                } else if (inputType === 'radio' || inputType === 'checkbox') {
                    fillRadioOrCheckbox(input, userData[fieldKey]);
                    fieldsCount++;
                } else if (inputType === 'date') {
                    input.value = userData[fieldKey];
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    fieldsCount++;
                } else {
                    input.value = userData[fieldKey];
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    fieldsCount++;
                }

                highlightField(input);
                break;
            }
        }
    });

    return fieldsCount;
}

function fillSelectField(selectElement, value) {
    const normalizedValue = value.toLowerCase();

    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        const optionText = option.textContent.toLowerCase();
        const optionValue = option.value.toLowerCase();

        if (optionText.includes(normalizedValue) || optionValue.includes(normalizedValue)) {
            selectElement.selectedIndex = i;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            return;
        }
    }
}

function fillRadioOrCheckbox(input, value) {
    const normalizedValue = value.toLowerCase();
    const inputValue = (input.value || '').toLowerCase();

    if (inputValue === normalizedValue || inputValue.includes(normalizedValue)) {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

function highlightField(element) {
    const originalBorder = element.style.border;
    const originalBackground = element.style.backgroundColor;

    element.style.border = '2px solid #48bb78';
    element.style.backgroundColor = '#c6f6d5';

    setTimeout(function() {
        element.style.border = originalBorder;
        element.style.backgroundColor = originalBackground;
    }, 1500);
}

function getFormContext() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const formContext = [];

    inputs.forEach(function(input) {
        if (input.readOnly || input.disabled || input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
            return;
        }

        formContext.push({
            id: input.id || '',
            name: input.name || '',
            placeholder: input.placeholder || '',
            label: getAssociatedLabel(input),
            type: input.type || '',
            tagName: input.tagName,
            value: input.value || ''
        });
    });

    return formContext;
}

function fillWithMapping(mapping) {
    let fieldsCount = 0;
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(function(input) {
        const identifier = input.id || input.name;
        if (!identifier) return;

        if (mapping[identifier] !== undefined) {
            const value = mapping[identifier];
            const inputType = (input.type || '').toLowerCase();

            if (input.tagName === 'SELECT') {
                fillSelectField(input, value);
                fieldsCount++;
            } else if (inputType === 'radio' || inputType === 'checkbox') {
                fillRadioOrCheckbox(input, value);
                fieldsCount++;
            } else {
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                fieldsCount++;
            }
            highlightField(input);
        }
    });

    return fieldsCount;
}

// Smart Capture Logic
let manualEntries = {};

function startSmartCapture() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const idOrName = input.id || input.name;
            if (!idOrName) return;

            // Check if we already filled this or if it's a new manual entry
            manualEntries[idOrName] = e.target.value;
            console.log('🔍 [SMART-CAPTURE] Detected manual entry:', idOrName, e.target.value);
            
            // Send to background to check if it's new data
            browser.runtime.sendMessage({
                action: 'checkNewData',
                field: idOrName,
                value: e.target.value
            });
        });
    });
}

// Start capturing after a short delay to avoid capturing auto-filled values
setTimeout(startSmartCapture, 2000);

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'fillForm') {
        browser.storage.local.get(null).then(function(userData) {
            const fieldsCount = fillFormFields(userData);
            sendResponse({ success: true, fieldsCount: fieldsCount });
        }).catch(function(error) {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }

    if (request.action === 'getFormContext') {
        const context = getFormContext();
        sendResponse({ success: true, context: context });
        return true;
    }

    if (request.action === 'aiFill') {
        const fieldsCount = fillWithMapping(request.mapping);
        sendResponse({ success: true, fieldsCount: fieldsCount });
        return true;
    }
});

console.log('NeuralForm: Content script loaded');
