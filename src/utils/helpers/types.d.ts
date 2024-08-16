declare global {
    interface Window {
        getSelectedCertificate: () => { certificateBlob: string };
    }
}

export {}; // This ensures the file is treated as a module.
