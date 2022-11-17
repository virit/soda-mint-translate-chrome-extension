import React from 'react';
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
      <h3 style={{marginTop: 0, color: '#2e2e2e'}}>翻译已开启</h3>
    </div>
  );
};

export default Popup;
