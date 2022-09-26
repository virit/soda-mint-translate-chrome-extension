// @ts-ignore
import {Dict, DictRecord, hash, HASH_SIZE, isWord} from "./util.ts"
import Sqlite from 'sqlite3'
import * as fs from 'fs'

const {Database} = Sqlite

// 字典数据库路径
const dictFile = './stardict.db'

const db = new Database(dictFile, () => {
  const sql = 'select word, phonetic, translation from stardict'
  db.all(sql, (err: Error, row: DictRecord[]) => {
    const dictArray: Array<Dict> = new Array<Dict>(HASH_SIZE)
    row.forEach(record => {
      if (isWord(record.word)) {
        // 根据单词名称进行hash
        const hashCode = hash(record.word)
        if (!dictArray[hashCode]) dictArray[hashCode] = {}
        dictArray[hashCode][record.word] = record
      }
    })
    const dirName = './build/dictionaries'
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName)
    }
    for (let i = 0; i < HASH_SIZE; i++) {
      if (dictArray[i]) {
        fs.writeFileSync(`${dirName}/${i}.json`, JSON.stringify(dictArray[i]), 'utf-8')
      }
    }
  })
})