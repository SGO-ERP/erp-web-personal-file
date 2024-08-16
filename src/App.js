import { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/kk';
import 'moment/locale/ru';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { THEME_CONFIG } from './configs/AppConfig';
import './lang';
import Layouts from './layouts';
import store from './store';

const themes = {
    dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
    light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
};

function App() {
    const { i18n, t } = useTranslation();
    moment.locale(i18n.language);
    moment.updateLocale(i18n.language, {
        invalidDate: i18n.t('moment.invalidDate'),
    });

    useEffect(() => {
        window.addEventListener('error', (e) => {
            if (e.message === 'ResizeObserver loop limit exceeded') {
                const resizeObserverErrDiv = document.getElementById(
                    'webpack-dev-server-client-overlay-div',
                );
                const resizeObserverErr = document.getElementById(
                    'webpack-dev-server-client-overlay',
                );
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute('style', 'display: none');
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute('style', 'display: none');
                }
            }
        });
    }, []);

    useEffect(() => {
        document.title = t('title.log');
    }, [i18n.language]);

    return (
        <div className="App">
            <Provider store={store}>
                <BrowserRouter>
                    <ThemeSwitcherProvider
                        themeMap={themes}
                        defaultTheme={THEME_CONFIG.currentTheme}
                        insertionPoint="styles-insertion-point"
                    >
                        <Layouts />
                    </ThemeSwitcherProvider>
                </BrowserRouter>
            </Provider>
        </div>
    );
}

export default App;
