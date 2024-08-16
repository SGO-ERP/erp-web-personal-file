export const phoneNumberFormatter = {
    format: (phoneNumber) => {
        return new Promise((resolve, reject) => {
            if (typeof phoneNumber !== 'string') {
                return reject();
            }
            const formattedPhoneNumber = phoneNumber.replace(
                /(\d{1,1})(\d{1,3})(\d{1,3})(\d{1,2})(\d{0,})/,
                '+$1 ($2) $3-$4$5',
            );
            resolve(formattedPhoneNumber);
        });
    },
    formatSync: (phoneNumber) => {
        const result = {
            data: null,
            error: null,
        };
        if (typeof phoneNumber !== 'string') {
            result.error = 'Phone number is not string type';
            return result;
        }
        const formattedPhoneNumber = phoneNumber.replace(
            /(\d{1,1})(\d{1,3})(\d{1,3})(\d{1,2})(\d{0,})/,
            '+$1 ($2) $3-$4$5',
        );
        result.data = formattedPhoneNumber;
        return result;
    },
    unformat: (phoneNumber) => {
        return new Promise((resolve, reject) => {
            if (typeof phoneNumber !== 'string') {
                return reject('Phone number is not type of string');
            }
            const unformattedPhoneNumber = phoneNumber.replace(/[+\-() ]/g, '');
            resolve(unformattedPhoneNumber);
        });
    },
    unformatSync: (phoneNumber) => {
        const result = {
            data: null,
            error: null,
        };
        if (typeof phoneNumber !== 'string') {
            result.error = '';
            return result;
        }
        const unformattedPhoneNumber = phoneNumber.replace(/[+\-() ]/g, '');
        result.data = unformattedPhoneNumber;
        return result;
    },
};
