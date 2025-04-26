type ParamValues = Record<string, string | number | undefined>;
type Options<T> = {
    variables?: ParamValues;
    key: keyof T;
};
type CreateOptions = {
    fallback: string;
    language: string;
};
declare function declOfNum(number: number, titles: string[]): string;
declare function hasI18nKey<T>(content: T, options: Options<T>): boolean;
declare function processI18N<T>(content: T, options: Options<T>): string;
declare function mergeContent<T>(contents: Array<T>, options: CreateOptions): T[keyof T];

export { declOfNum, hasI18nKey, mergeContent, processI18N };
