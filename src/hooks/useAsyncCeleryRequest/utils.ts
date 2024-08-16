import { AxiosResponse } from "axios"

export const checkForProgressStatus = (response: AxiosResponse): boolean => {
    return typeof response.data === 'object' &&
        response.data != null &&
        'status' in response.data &&
        response.data.status != null
}

export const checkForBodyId = (response: AxiosResponse): boolean => {
    return typeof response.data === 'object' &&
        response.data != null &&
        'id' in response.data &&
        response.data.id != null
}

export const checkForStatus = (response: AxiosResponse): boolean => {
    return response.status != null
}