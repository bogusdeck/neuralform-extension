const fieldIds = [
    'fullName',
    'firstName',
    'lastName',
    'dob',
    'gender',
    'category',
    'nationality',
    'fatherName',
    'motherName',
    'email',
    'phone',
    'alternatePhone',
    'address',
    'address2',
    'city',
    'state',
    'zipCode',
    'country',
    'degree',
    'institution',
    'yearOfPassing',
    'percentageCgpa',
    'boardUniversity',
    'preferredCenter',
    'subjectPreference',
    'languagePreference',
    'idProofType',
    'idNumber',
    'disabilityStatus',
    'workExperience'
];

function collectFormData() {
    const data = {};

    fieldIds.forEach((fieldId) => {
        const element = document.getElementById(fieldId);
        data[fieldId] = element.value || null;
    });

    return data;
}

function populateForm(data) {
    fieldIds.forEach((fieldId) => {
        const element = document.getElementById(fieldId);
        element.value = data && data[fieldId] ? data[fieldId] : '';
    });
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;

    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'status';
    }, 5000);
}

async function saveProfile(event) {
    event.preventDefault();
    const data = collectFormData();

    showStatus('Saving profile...', 'info');

    try {
        await saveUserData(data);
        document.getElementById('userId').textContent = await generateUserId();
        showStatus('✅ Profile saved successfully to Firebase!', 'success');
    } catch (error) {
        console.error('Error saving profile:', error);
        showStatus('❌ Error saving profile: ' + error.message, 'error');
    }
}

async function loadCurrentData() {
    showStatus('Loading current profile...', 'info');

    try {
        document.getElementById('userId').textContent = await generateUserId();
        const data = await getUserData();

        if (!data) {
            showStatus('No existing profile found. Please fill in the form.', 'info');
            return;
        }

        populateForm(data);
        showStatus('✅ Profile loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading profile:', error);
        showStatus('❌ Error loading profile: ' + error.message, 'error');
    }
}

async function clearProfile() {
    if (!confirm('Are you sure you want to delete your profile from Firebase?')) {
        return;
    }

    showStatus('Deleting profile...', 'info');

    try {
        await clearUserData();
        document.getElementById('profileForm').reset();
        document.getElementById('userId').textContent = await generateUserId();
        showStatus('✅ Profile deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting profile:', error);
        showStatus('❌ Error deleting profile: ' + error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('profileForm').addEventListener('submit', saveProfile);
    document.getElementById('loadProfileBtn').addEventListener('click', loadCurrentData);
    document.getElementById('clearProfileBtn').addEventListener('click', clearProfile);

    document.getElementById('userId').textContent = await generateUserId();
    loadCurrentData();
});
