const HASH_SIZE = 1000000

export type DictRecord = {
    /**
     * 单词
     */
    word: string;
    /**
     * 音标
     */
    phonetic: string;
    /**
     * 翻译
     */
    translation: string;
}

export interface Dict {
    [key: string]: DictRecord
}

/**
 * hash函数，根据输入字符串进行散列
 * @param str
 */
export const hash = (str: string): number => {

    let code = 0
    for (let i = 0; i < str.length; i++) {
        const num = str.charCodeAt(i) - 'a'.charCodeAt(0)
        code = (code * i + num) * HASH_SIZE + num * i
    }
    return code % HASH_SIZE
}

export const loadResource = async (resource: string): Promise<string> => {

    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            resolve(xhr.responseText)
        }
        xhr.open("GET", chrome.runtime.getURL(resource), true);
        xhr.send();
    })
}
