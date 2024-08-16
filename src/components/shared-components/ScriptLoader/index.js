import { useEffect } from 'react';

const ScriptLoader = ({ scripts, onScriptsLoaded }) => {
    useEffect(() => {
        const loadScript = (url) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        const loadScriptsSequentially = async () => {
            for (const script of scripts) {
                await loadScript(script).catch((error) =>
                    console.error('Error loading script:', error),
                );
            }

            onScriptsLoaded();
        };

        void loadScriptsSequentially();
    }, [scripts, onScriptsLoaded]);

    return null;
};

export default ScriptLoader;
