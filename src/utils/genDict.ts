import {DictRecord} from "./util";
import Sqlite from 'sqlite3'

console.log(123)

const db = new Sqlite.Database('test.db', () => {
    db.all('select word, phonetic, translation from stardict limit 10', function (err: Error, row: DictRecord[]) {
        console.log((row[0].word))
    })
})