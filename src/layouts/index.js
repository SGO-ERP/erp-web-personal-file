import React, { lazy, memo, Suspense } from 'react';
import { useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import Views from 'views';
import ErrorBoundary from 'views/app-views/management/constructor_new/ErrorBoundary';

const AppLayout = lazy(() => import('./AppLayout'));
const AuthLayout = lazy(() => import('./AuthLayout'));

const Layouts = () => {
    const token = useSelector((state) => state.auth.token);
    const blankLayout = useSelector((state) => state.theme.blankLayout);
    const direction = useSelector((state) => state.theme.direction);
    const navType = useSelector((state) => state.theme.navType);
    const navCollapsed = useSelector((state) => state.theme.navCollapsed);

    const Layout = token && !blankLayout ? AppLayout : AuthLayout;

    return (
        <Suspense fallback={<Loading cover="content" />}>
            <Layout direction={direction} navType={navType} navCollapsed={navCollapsed}>
                <ErrorBoundary>
                    <Views />
                </ErrorBoundary>
            </Layout>
        </Suspense>
    );
};

export default memo(Layouts);
