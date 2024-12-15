"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declOfNum = declOfNum;
exports.hasI18nKey = hasI18nKey;
exports.processI18N = processI18N;
exports.mergeContent = mergeContent;
function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}
function hasI18nKey(content, options) {
    const { key } = options;
    return !!content[key];
}
function processI18N(content, options) {
    const { variables, key } = options;
    let response = content[key];
    if (!variables) {
        return response;
    }
    Object.keys(variables).forEach((variable) => {
        const reg = new RegExp(`{{${variable}}}`, 'g');
        response = response.replace(reg, String(variables[variable]));
    });
    const testMatch = response.match(/(\[.+])/);
    if (testMatch && testMatch[0]) {
        const replaceString = testMatch[0];
        const parseExpression = replaceString.match(/\[(.+)]/);
        if (parseExpression && parseExpression[1] && parseExpression[1].indexOf('|') > -1) {
            const [counter, ...strings] = parseExpression[1].split('|');
            if ((strings === null || strings === void 0 ? void 0 : strings.length) > 0) {
                const counterData = Number(counter);
                response = response.replace(replaceString, declOfNum(counterData, strings));
            }
        }
    }
    return response;
}
function mergeContent(contents, options) {
    const response = {};
    contents.forEach((obj) => {
        Object.assign(response, obj[options.fallback] || {}, obj[options.language] || {});
    });
    return response;
}
