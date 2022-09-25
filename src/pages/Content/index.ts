import axios from "axios";

console.log(chrome.runtime.getURL('/test.json'))

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(e) {
  console.log(xhr.responseText)
}
xhr.open("GET", chrome.runtime.getURL('/test.json'), true);
xhr.send();

axios({
  method: 'get',
  url: 'extension://plmgbamlefaijolbndmhmekfpcmbddhl/test.json',
  responseType: 'json'
}).then(response => {
  // 请求成功
  let res = response.data;
  console.log(res);
});

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
    this.element.innerText = text;
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

const transferd = [] as HTMLElement[]

function getWordUnderCursor(event: MouseEvent) {
  let range, textNode, offset;

  if (document.body.createTextRange) {           // Internet Explorer
    try {
      range = document.body.createTextRange();
      range.moveToPoint(event.clientX, event.clientY);
      range.select();
      range = getTextRangeBoundaryPosition(range, true);

      textNode = range.node;
      offset = range.offset;
    } catch(e) {
      return "";
    }
  }
  else if (document.caretPositionFromPoint) {    // Firefox
    range = document.caretPositionFromPoint(event.clientX, event.clientY);
    textNode = range.offsetNode;
    offset = range.offset;
  } else if (document.caretRangeFromPoint) {     // Chrome
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
    textNode = range.startContainer;
    offset = range.startOffset;
  }

  //data contains a full sentence
  //offset represent the cursor position in this sentence
  var data = textNode.data,
      i = offset,
      begin,
      end;

  //Find the begin of the word (space)
  while (i > 0 && data[i] !== " ") { --i; };
  begin = i;

  //Find the end of the word
  i = offset;
  while (i < data.length && data[i] !== " ") { ++i; };
  end = i;

  //Return the word under the mouse cursor
  return data.substring(begin, end);
}

document!.body.onmousemove = function(e) {

  const word = getWordUnderCursor(e)
  if (word) {
    tipsElement.setPos(e.pageX + 4, e.pageY - tipsElement.element.clientHeight - 4)
    tipsElement.setText(word)
    tipsElement.show()
  } else {
    tipsElement.hide()
  }
}

document!.body.onmouseout = function(e) {

  // tipsElement.hide()
}