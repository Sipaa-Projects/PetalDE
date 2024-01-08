petalde.fs = {};

(function () {
    const DB_NAME = 'PetaldeFSDB';
    const DB_VERSION = 1;
    const FILE_STORE_NAME = 'files';
    const DIR_STORE_NAME = 'directories';

    let db;

    function initDB() {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(FILE_STORE_NAME)) {
                db.createObjectStore(FILE_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }

            if (!db.objectStoreNames.contains(DIR_STORE_NAME)) {
                db.createObjectStore(DIR_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            console.log('Filesystem DB initialized successfully');
        };

        request.onerror = function (event) {
            console.error('Error initializing filesystem DB');
        };
    }

    function getFileStore() {
        const transaction = db.transaction([FILE_STORE_NAME], 'readwrite');
        return transaction.objectStore(FILE_STORE_NAME);
    }

    function getDirStore() {
        const transaction = db.transaction([DIR_STORE_NAME], 'readwrite');
        return transaction.objectStore(DIR_STORE_NAME);
    }

    petalde.fs.createFile = function (fileName, fileContent, callback) {
        const store = getFileStore();
        const fileData = { name: fileName, content: fileContent };

        const addRequest = store.add(fileData);

        addRequest.onsuccess = function (event) {
            console.log('File created successfully');
            if (callback) callback(null, event.target.result);
        };

        addRequest.onerror = function (event) {
            console.error('Error creating file');
            if (callback) callback(event.target.error, null);
        };
    };

    petalde.fs.readFile = function (fileId, callback) {
        const store = getFileStore();
        const getRequest = store.get(fileId);

        getRequest.onsuccess = function (event) {
            const fileData = event.target.result;
            console.log('File read successfully');
            if (callback) callback(null, fileData);
        };

        getRequest.onerror = function (event) {
            console.error('Error reading file');
            if (callback) callback(event.target.error, null);
        };
    };

    petalde.fs.writeFile = function (fileId, newContent, callback) {
        const store = getFileStore();
        const getRequest = store.get(fileId);

        getRequest.onsuccess = function (event) {
            const fileData = event.target.result;
            fileData.content = newContent;

            const updateRequest = store.put(fileData, fileId);

            updateRequest.onsuccess = function (event) {
                console.log('File updated successfully');
                if (callback) callback(null, event.target.result);
            };

            updateRequest.onerror = function (event) {
                console.error('Error updating file');
                if (callback) callback(event.target.error, null);
            };
        };

        getRequest.onerror = function (event) {
            console.error('Error reading file for update');
            if (callback) callback(event.target.error, null);
        };
    };

    petalde.fs.createDirectory = function (dirName, callback) {
        const store = getDirStore();
        const dirData = { name: dirName };

        const addRequest = store.add(dirData);

        addRequest.onsuccess = function (event) {
            console.log('Directory created successfully');
            if (callback) callback(null, event.target.result);
        };

        addRequest.onerror = function (event) {
            console.error('Error creating directory');
            if (callback) callback(event.target.error, null);
        };
    };

    petalde.fs.getDirectoryContents = function (dirId, callback) {
        const store = getDirStore();
        const getRequest = store.get(dirId);

        getRequest.onsuccess = function (event) {
            const dirData = event.target.result;
            console.log('Directory contents retrieved successfully');
            if (callback) callback(null, dirData);
        };

        getRequest.onerror = function (event) {
            console.error('Error getting directory contents');
            if (callback) callback(event.target.error, null);
        };
    };

    // Initialization
    initDB();
})();
