type ParamValues = Record<string, string | number | undefined>;
type Options<T> = {
    variables?: ParamValues;
    key: keyof T;
};
type CreateOptions = {
    fallback: string;
    language: string;
};
export declare function declOfNum(number: number, titles: string[]): string;
export declare function hasI18nKey<T>(content: T, options: Options<T>): boolean;
export declare function processI18N<T>(content: T, options: Options<T>): string;
export declare function mergeContent<T>(contents: Array<T>, options: CreateOptions): T[keyof T];
export {};
