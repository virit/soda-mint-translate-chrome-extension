import {Dict, hash, isWord} from "../../utils/util"

class TipsElement {

  element = document.createElement('div')

  constructor() {
    this.element.style.position = 'absolute'
    this.setPos(0, -100)
    this.setText('default')
    this.element.style.background = '#323232'
    this.element.style.color = '#ffffff'
    this.element.style.padding = '8px'
    this.element.style.borderRadius = '2px'
    // this.hide()
    document.body.append(this.element)
  }

  setPos(x: number, y: number) {
    this.element.style.left = x + 'px'
    this.element.style.top = y + 'px'
  }

  setText(text: string) {
    this.element.innerText = text
  }

  show() {
    this.element.style.display = 'block'
  }

  hide() {
    this.element.style.display = 'none'
  }

  bindTo(target: HTMLElement) {
    if (!target.parentElement) return
    this.element.parentElement?.removeChild(this.element)
    target.parentElement.appendChild(this.element)
    const left = target.offsetLeft
    const top = target.offsetTop
    this.setPos(left, top - target.clientHeight - this.element.clientHeight - 4)
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

document!.body.onmousemove = async function (e) {
  const word = getWordUnderCursor(e)
  if (word && preWord !== word) {
    preWord = word
    const hashCode = hash(word)
    console.log(`${word}-${hashCode}`)
    tipsElement.setText(hashCode + '')
    tipsElement.setPos(e.pageX + 4, e.pageY - tipsElement.element.clientHeight - 4)
    tipsElement.show()
    // const jsonText = await loadResource(`/dict/${hashCode}.json`)
    // const dict = JSON.parse(jsonText) as Dict
    const dict: Dict = {word: {word: word, phonetic: '', translation: ''}}
    if (word in dict) {
      tipsElement.setPos(e.pageX + 4, e.pageY - tipsElement.element.clientHeight - 4)
      tipsElement.setText(dict[word].word)
      tipsElement.show()
    }
  } else {
    tipsElement.hide()
  }
}

document!.body.onmouseout = function (e) {

}