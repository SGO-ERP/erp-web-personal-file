import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';
import { protectedRoutes, publicRoutes } from 'configs/RoutesConfig';
import AppRoute from './AppRoute';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const Routes = () => {
    return (
        <RouterRoutes>
            <Route path="/" element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to={`${APP_PREFIX_PATH}/duty/data/me`} />} />
                {protectedRoutes.map((route, index) => {
                    return (
                        <Route
                            key={route.key + index}
                            path={route.path}
                            element={
                                <AppRoute
                                    routeKey={route.key}
                                    component={route.component}
                                    {...route.meta}
                                />
                            }
                        />
                    );
                })}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.map((route) => {
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <AppRoute
                                    routeKey={route.key}
                                    component={route.component}
                                    {...route.meta}
                                />
                            }
                        />
                    );
                })}
            </Route>
        </RouterRoutes>
    );
};

export default Routes;
