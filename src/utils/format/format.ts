export const transformArray = <T extends Record<string, any>>(
    array: T[],
    dataIndex: (keyof T)[],
): T[] =>
    array.map((item) => {
        const transformedItem: Partial<T> = {};
        dataIndex.forEach((key) => {
            if (key in item) {
                transformedItem[key] = item[key];
            }
        });
        return transformedItem as T;
    });

export const concatBySpace = (arr: (string | undefined | null)[]) => {
    return arr.filter((item) => item).join(' ');
};

export const concatBy = (arr: (string | undefined | number | null)[], separator: string) => {
    return arr
        .map((item) => String(item))
        .filter((item) => item)
        .join(separator);
};

export const removeItemFromArray = <T>(array: T[], item: T): T[] => {
    const index = array.indexOf(item);
    if (index > -1) {
        return [...array.slice(0, index), ...array.slice(index + 1)];
    }
    return array;
};
