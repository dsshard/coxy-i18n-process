type ValueType = string | number | undefined;
type Options<T, V> = {
    variables?: Record<string, V>;
    key: keyof T;
};
type CreateOptions = {
    fallback: string;
    language: string;
};
declare function declOfNum(number: number, titles: string[]): string;
declare function hasI18nKey<T>(content: T, options: Options<T, ValueType>): boolean;
declare function processI18N<T, V = ValueType, R = string>(content: T, options: Options<T, V>): R;
declare function mergeContent<T>(contents: Array<T>, options: CreateOptions): T[keyof T];

export { type CreateOptions, type Options, type ValueType, declOfNum, hasI18nKey, mergeContent, processI18N };
