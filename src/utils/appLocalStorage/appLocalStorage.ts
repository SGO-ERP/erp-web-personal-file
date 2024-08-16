export type Success = boolean

export const appLocalStorage = {
    getItem: <T>(key: string): T | null => {
        try {
            const value = localStorage.getItem(key)
            if (value == null) {
                return null
            }
            const encodedValue: T = JSON.parse(value)
            return encodedValue
        } catch (error) {
            return null
        }
    },
    setItem: <T>(key: string, value: T): Success => {
        try {
            const decodedValue = JSON.stringify(value)
            localStorage.setItem(key, decodedValue)
            return true
        } catch (error) {
            return false
        }
    },
    removeItem: (key: string): Success => {
        try {
            localStorage.removeItem(key)
            return true
        } catch (error) {
            return false
        }
    },
    clearAll: (): Success => {
        try {
            localStorage.clear()
            return true
        } catch (error) {
            return false
        }
    }
}