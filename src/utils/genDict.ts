// @ts-ignore
import {DictRecord, hash, HASH_SIZE, isWord} from "./util.ts"
import Sqlite from 'sqlite3'
import * as fs from "fs";

const {Database} = Sqlite

interface DictJson {
  [key: string]: DictRecord
}

const db = new Database('/home/virit/stardict.db', () => {

  const sql = 'select word, phonetic, translation from stardict'

  db.all(sql, (err: Error, row: DictRecord[]) => {

    const dictArray: Array<DictJson> = new Array<DictJson>(HASH_SIZE)

    row.forEach(record => {
      if (isWord(record.word)) {
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