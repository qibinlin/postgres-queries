import { Literal } from '../Configuration';

export const checkLiteralKeys = (keys: string[]) => (
    object: Literal<string | number | boolean>,
) => {
    if (
        Object.keys(object).length !== keys.length ||
        Object.keys(object).some(
            key =>
                keys.indexOf(key) === -1 ||
                object[key] === null ||
                typeof object[key] === 'undefined',
        )
    ) {
        throw new Error(
            `Given object: (${Object.keys(object)
                .filter(key => object[key])
                .join(', ')}) does not match keys: (${keys.join(', ')})`,
        );
    }

    return object;
};
