const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

let firebaseApp = null;
let db = null;

// Function to load config from storage or use defaults
async function getFirebaseConfig() {
    const result = await browser.storage.local.get(['firebaseConfig']);
    return result.firebaseConfig || firebaseConfig;
}

async function initFirebase() {
    if (!firebaseApp && typeof firebase !== 'undefined') {
        const config = await getFirebaseConfig();
        if (!config.apiKey) {
            console.warn('Firebase API Key is missing. Please configure it.');
            return null;
        }
        firebaseApp = firebase.initializeApp(config);
        db = firebase.firestore();
    }
    return db;
}

async function generateUserId() {
    let result = await browser.storage.local.get('userId');
    let userId = result.userId;

    if (!userId) {
        userId = crypto.randomUUID();
        await browser.storage.local.set({ userId: userId });
    }

    return userId;
}

async function saveUserData(data) {
    const database = await initFirebase();
    if (!database) throw new Error('Firebase not initialized');
    
    const userId = await generateUserId();

    const userData = {
        userId: userId,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        fullName: data.fullName || null,
        email: data.email || null,
        phone: data.phone || null,
        alternatePhone: data.alternatePhone || null,
        address: data.address || null,
        address2: data.address2 || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        country: data.country || null,
        dob: data.dob || null,
        gender: data.gender || null,
        category: data.category || null,
        nationality: data.nationality || null,
        fatherName: data.fatherName || null,
        motherName: data.motherName || null,
        degree: data.degree || null,
        institution: data.institution || null,
        yearOfPassing: data.yearOfPassing || null,
        percentageCgpa: data.percentageCgpa || null,
        boardUniversity: data.boardUniversity || null,
        preferredCenter: data.preferredCenter || null,
        subjectPreference: data.subjectPreference || null,
        languagePreference: data.languagePreference || null,
        idProofType: data.idProofType || null,
        idNumber: data.idNumber || null,
        disabilityStatus: data.disabilityStatus || null,
        workExperience: data.workExperience || null,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await database.collection('userProfiles').doc(userId).set(userData, { merge: true });
        await browser.storage.local.set(data);
        return userData;
    } catch (error) {
        console.error('Firebase save error:', error);
        throw error;
    }
}

async function getUserData() {
    const database = await initFirebase();
    if (!database) {
        // Fallback to local storage if firebase not configured
        const localData = await browser.storage.local.get(null);
        return localData || null;
    }
    
    const userId = await generateUserId();

    try {
        const doc = await database.collection('userProfiles').doc(userId).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();

        const formattedData = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            alternatePhone: data.alternatePhone || '',
            address: data.address || '',
            address2: data.address2 || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
            country: data.country || '',
            dob: data.dob || '',
            gender: data.gender || '',
            category: data.category || '',
            nationality: data.nationality || '',
            fatherName: data.fatherName || '',
            motherName: data.motherName || '',
            degree: data.degree || '',
            institution: data.institution || '',
            yearOfPassing: data.yearOfPassing || '',
            percentageCgpa: data.percentageCgpa || '',
            boardUniversity: data.boardUniversity || '',
            preferredCenter: data.preferredCenter || '',
            subjectPreference: data.subjectPreference || '',
            languagePreference: data.languagePreference || '',
            idProofType: data.idProofType || '',
            idNumber: data.idNumber || '',
            disabilityStatus: data.disabilityStatus || '',
            workExperience: data.workExperience || ''
        };

        await browser.storage.local.set(formattedData);

        return formattedData;
    } catch (error) {
        console.error('Firebase fetch error:', error);
        throw error;
    }
}

async function clearUserData() {
    const database = await initFirebase();
    if (!database) {
        await browser.storage.local.clear();
        return true;
    }
    
    const userId = await generateUserId();

    try {
        await database.collection('userProfiles').doc(userId).delete();
        await browser.storage.local.clear();
        return true;
    } catch (error) {
        console.error('Firebase delete error:', error);
        throw error;
    }
}
