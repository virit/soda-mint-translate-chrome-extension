import {Dict, DictRecord, hash, isWord, loadResource} from '../../utils/util'

const jsonStyle = (json: {[key: string]: string | number}) => {
  let css = ''
  for (let key in json) {
    css += `${key}: ${json[key]}; `
  }
  return css
}

/**
 * 提示组件
 */
class TipsElement {

  element = document.createElement('div')
  private dictRecord: DictRecord = {word: '', phonetic: '', translation: ''}
  private x = 0
  private y = 0
  private hidden = true

  constructor() {
    document.body.append(this.element)
    this.render()
  }

  /**
   * 单词样式
   */
  private wordStyle = jsonStyle({
    'font-weight': 'bold',
    'color': '#ffffff',
    'font-size': '14px',
    'margin-top': 0,
    'margin-bottom': '4px',
  })

  /**
   * 翻译样式
   */
  private translationStyle = jsonStyle({
    'white-space': 'pre-line',
    'color': '#ffffff',
    'font-size': '12px',
    'margin-top': 0,
    'margin-bottom': 0
  })

  render() {
    // 显示容器样式
    const containerStyle = jsonStyle({
      'z-index': 1000,
      'position': 'absolute',
      'background': 'rgba(50,50,50,0.9)',
      'padding': '8px',
      'border-radius': '2px',
      'display': `${this.hidden ? 'none' : 'block'}`,
      'left': `${this.x}px`,
      'top': `${this.y}px`,
    })

    this.element.setAttribute('style', containerStyle)
    this.element.innerHTML = `
      <p style="${this.wordStyle}">${this.dictRecord.word}</p>
      <p style="${this.translationStyle}">${this.dictRecord.translation}</p>
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
  if (isWord(word)) {
    tipsElement.setPos(e.pageX + 4, e.pageY - tipsElement.element.clientHeight - 4)
    if (preWord !== word) {
      preWord = word
      const hashCode = hash(word)
      loadResource<Dict>(`/dictionaries/${hashCode}.json`, dict => {
        if (word in dict) {
          tipsElement.setDictRecord(dict[word])
          tipsElement.show()
        } else {
          tipsElement.hide()
        }
      })
    }
  } else {
    preWord = ''
    tipsElement.hide()
  }
}

document!.body.onmouseout = function (e) {

}