import {Dict, DictRecord, hash, isWord, loadResource} from "../../utils/util";
import React, {useCallback, useState} from "react";
import styled from "styled-components";
import {render} from "react-dom";

interface TranslationTipsState {
  x: number;
  y: number;
  dict: DictRecord;
  // 是否可见
  visible: boolean;
}

// 暴露给原生js的api
interface TranslationTipsApi {
  state?: TranslationTipsState;
  setState?: React.Dispatch<React.SetStateAction<TranslationTipsState>>;
  element?: HTMLDivElement;
}

interface TranslationTipsProps {
  api: TranslationTipsApi;
}

const StyledTranslationTips = styled.div<TranslationTipsState>`
  z-index: 9007199254740992 !important;
  position: absolute !important;
  background: rgba(50, 50, 50) !important;
  padding: 8px !important;
  border-radius: 4px !important;
  display: ${p => p.visible ? 'block' : 'none'} !important;
  left: ${p => p.x}px !important;
  top: ${p => p.y}px !important;
`;

const StyledWord = styled.p`
  font-weight: bold !important;
  color: #ffffff !important;
  font-size: 14px !important;
  margin-top: 0 !important;
  margin-bottom: 4px !important;
  line-height: normal !important;
`;

const StyledPhonetic = styled.p`
  white-space: pre-line !important;
  color: #b2b2b2 !important;
  font-size: 4px !important;
  margin-top: 0 !important;
  margin-bottom: 4px !important;
  line-height: normal !important;
`;

const StyledTranslation = styled.p`
  white-space: pre-line !important;
  color: #ffffff !important;
  font-size: 12px !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  line-height: normal !important;
`;

const TranslationTips: React.FC<TranslationTipsProps> = (props) => {

  const [state, setState] = useState<TranslationTipsState>(
    {
      x: 0,
      y: 0,
      dict: {
        word: '',
        phonetic: '',
        translation: ''
      },
      visible: false,
    }
  );

  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  props.api.setState = setState;
  props.api.state = state;

  const stateTransfer = {
    ...state,
    x: state.x + 4,
    y: state.y - 4 - height
  };

  return (
    state.visible ?
    <StyledTranslationTips {...stateTransfer} ref={measuredRef}>
      <StyledWord>{state.dict.word}</StyledWord>
      <StyledPhonetic>{state.dict.phonetic}</StyledPhonetic>
      <StyledTranslation>{state.dict.translation}</StyledTranslation>
    </StyledTranslationTips> : <></>
  );
};

const lowerCase = /^[a-z]$/;
const upperCase = /^[A-Z]$/;

function getWordUnderCursor(event: MouseEvent): string {

  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  const textNode = range?.startContainer as any;
  const offset = range?.startOffset;

  const data = textNode.data;
  if (!data) return '';
  let begin: number, end: number;
  let i = offset || 0;
  if (upperCase.test(data[i]) && i + 1 < data.length && !lowerCase.test(data[i + 1])) {
    while (i >= 0 && upperCase.test(data[i])) {
      i--;
    }
    begin = i;
    i = offset || data.length;
    while (i < data.length && upperCase.test(data[i])) {
      i++;
    }
    end = i;
    if (lowerCase.test(data[end])) {
      end--;
    }
  } else {
    while (i >= 0 && lowerCase.test(data[i])) {
      i--;
    }
    if (upperCase.test(data[i])) {
      i--;
    }
    begin = i;
    i = offset || data.length;
    while (i < data.length && lowerCase.test(data[i])) {
      i++;
    }
    end = i;
  }
  return data.substring(begin + 1, end).trim().toLowerCase();
}

const container = document.createElement('div');
document.querySelector('body')?.append(container);
const api: TranslationTipsApi = {};
render(<TranslationTips api={api}/>, container);

let preWord = '';

document!.body.onmousemove = async (e) => {
  const word = getWordUnderCursor(e);
  if (isWord(word)) {
    api.setState!({
      ...api.state!,
      x: e.pageX,
      y: e.pageY
    });
    if (preWord !== word) {
      preWord = word;
      const hashCode = hash(word);
      const dict = await loadResource<Dict>(`/dictionaries/${hashCode}.json`);
      if (word in dict) {
        api.setState!({
          ...api.state!,
          dict: dict[word],
          visible: true,
          x: e.pageX,
          y: e.pageY
        });
      } else {
        api.setState!({
          ...api.state!,
          visible: false
        });
      }
    }
  } else {
    api.setState!({
      ...api.state!,
      visible: false
    });
    preWord = '';
  }
};
