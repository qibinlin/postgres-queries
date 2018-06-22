export const addSuffix = (object, suffix) =>
    Object.keys(object).reduce(
        (result, key) => ({
            ...result,
            [key + suffix]: object[key],
        }),
        {},
    );
