import { paths } from 'API/types';
import { API_NEW_BASE_URL } from 'configs/AppConfig';
import createClient from 'openapi-fetch';
import { _fetch } from './fetch';

const PrivateServices = createClient<paths>({
    baseUrl: API_NEW_BASE_URL,
    fetch: _fetch,
});

export { PrivateServices };
