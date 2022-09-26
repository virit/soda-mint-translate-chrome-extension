import React from 'react';
import CheckBox from '../../components/Switch'
import styled from "styled-components";

const SettingLine = styled.div`
  line-height: 35px;
  vertical-align: middle;
  color: #515151;
  user-select: none;
`

const Popup = () => {
  return (
    <div>
      <h3 style={{marginTop: 0, color: '#2e2e2e'}}>苏打薄荷翻译</h3>
      <SettingLine><b>即时翻译</b>&nbsp;<CheckBox checked={false}/></SettingLine>
      <SettingLine><b>选词翻译</b>&nbsp;<CheckBox checked={false}/></SettingLine>
    </div>
  );
};

export default Popup;
