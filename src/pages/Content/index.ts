import {Dict, DictRecord, hash, isWord, loadResource} from "../../utils/util"

class TipsElement {

  element = document.createElement('div')
  dictRecord: DictRecord = {word: '', phonetic: '', translation: ''}
  x = 0
  y = 0
  hidden = true

  constructor() {
    document.body.append(this.element)
    this.render()
  }

  render() {
    const staticStyles = 'z-index: 1000; position: absolute; background: #323232; color: #ffffff; padding: 8px; border-radius: 2px;'
    const display = `display: ${this.hidden ? 'none' : 'block'};`
    const pos = `left: ${this.x}px; top: ${this.y}px`

    this.element.setAttribute('style', `${staticStyles} ${display} ${pos}`)
    this.element.innerHTML = `
      <p style="color: #ffffff; font-size: 12px; margin-top: 0; margin-bottom: 4px;">${this.dictRecord.word}</p>
      <p style="color: #ffffff; font-size: 12px; margin-top: 0; margin-bottom: 0;">${this.dictRecord.translation}</p>
    `
  }

  setPos(x: number, y: number) {
    this.x = x
    this.y = y
    this.render()
  }

  setDictRecord(record: DictRecord) {
    this.dictRecord = record
    this.render()
  }

  show() {
    this.hidden = false
    this.render()
  }

  hide() {
    this.hidden = true
    this.render()
  }
}

const tipsElement = new TipsElement()


function getWordUnderCursor(event: MouseEvent): string {

  const range = document.caretRangeFromPoint(event.clientX, event.clientY)
  const textNode = range?.startContainer as any
  const offset = range?.startOffset

  const data = textNode.data
  if (!data) return ''
  let begin, end
  let i = offset || 0
  while (i > 0 && /^[a-zA-Z]$/d.test(data[i]) && data[i] !== '') {
    i--
  }
  begin = i
  i = offset || data.length
  while (i < data.length && /^[a-zA-Z]$/d.test(data[i]) && data[i] !== '') {
    i++
  }
  end = i
  return data.substring(begin, end).trim().toLowerCase()
}

let preWord = ''

document!.body.onmousemove = function (e) {
  const word = getWordUnderCursor(e)
  if (word) {
    if (preWord !== word) {
      preWord = word
      const hashCode = hash(word)
      console.log(`${word}-${hashCode}`)
      tipsElement.show()
      loadResource<Dict>(`/dictionaries/${hashCode}.json`, dict => {
        if (word in dict) {
          tipsElement.setDictRecord(dict[word])
        }
      })
    }
    tipsElement.setPos(e.pageX + 4, e.pageY - tipsElement.element.clientHeight - 4)
    tipsElement.show()
  } else {
    tipsElement.hide()
  }
}

document!.body.onmouseout = function (e) {

}