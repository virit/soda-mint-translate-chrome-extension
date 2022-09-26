export const HASH_SIZE = 3000

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

export const isWord = (str: string): boolean => {
  if (!str) return false
  return /^[a-zA-Z]+$/.test(str)
}

/**
 * hash函数，根据输入字符串进行散列
 * @param str
 */
export const hash = (str: string): number => {

  let code = 0
  for (let i = 0; i < str.length; i++) {
    const num = str.charCodeAt(i) - 'a'.charCodeAt(0)
    code = (code * i + num) + num * i + num
  }
  return code % HASH_SIZE
}

export const loadResource = async <T>(resource: string): Promise<T> => {

  return new Promise<T>(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText) as T)
      }
    }
    xhr.open("GET", chrome.runtime.getURL(resource).toString(), true);
    xhr.send();
  })
}
