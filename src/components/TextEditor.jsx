import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/ext-language_tools"; // Pour l'autocomplétion et les snippets

const StyledContainer = styled.div`
  display: grid;
  width: 100%;
  width: 1000px;
  grid-template-areas: "a b e" "c c c";
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  justify-content: center;
  align-items: center;
  div {
  }
  #js-container,
  #html-container,
  #css-container {
    height: 200px !important;
    width: 100% !important;
    border: 1px solid #6c6868;
    .ace_gutter {
      width: 40px !important;
      display: flex;
      justify-content: center;
    }
  }

  .iframe-container {
    grid-area: c;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 300px;
    #iframeContainer {
      width: 100%;
      height: 100%;
      border: 1px solid #6c6868;
    }
    iframe {
      border: none;
      width: 100%;
      height: 100%;
    }
    button {
      margin: 10px;
    }
  }
`;
const TextEditor = () => {
  const defaultHtmlValue = `<h1>test</h1>
<span id="test">0</span>`;

  const defaultJsValue = `const test = document.getElementById("test");
    test.innerHTML = "Reussi !"`;

  const defaultCssValue = `h1 {
    color:red;
}`;

  const hiddenCss = ` body {
    background: #272822;
    color: white;
    padding : 10px;
}`;

  //   let [code, setCode] = useState(defaultJsValue);
  let [htmlCode, setHtmlCode] = useState(defaultHtmlValue);
  let [jsCode, setJsCode] = useState(defaultJsValue);
  let [cssCode, setCssCode] = useState(defaultCssValue.toString());
  const [codeReset, setCodeReset] = useState(false);
  const iframeRef = useRef(null);

  const onChange = (newValue) => {
    setJsCode(newValue);
  };

  const onChangeHTML = (newValue) => {
    setHtmlCode(newValue);
  };

  const onChangeCSS = (newValue) => {
    setCssCode(newValue);
  };

  useEffect(() => {
    executeCode();
  }, [cssCode, jsCode, htmlCode]);

  const recreateIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.remove();
    }
    const newIframe = document.createElement("iframe");
    newIframe.title = "result";
    const container = document.getElementById("iframeContainer");
    container.appendChild(newIframe);
    iframeRef.current = newIframe;
  };

  const executeCode = () => {
    recreateIframe();
    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow.document;

    document.open();
    document.write(`<html> <head>
        <style>${cssCode}</style>
        <style>${hiddenCss}</style>
      </head><body>${htmlCode}</body></html>`); // Injecter le HTML
    document.close();

    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.text = jsCode; // 'code' est votre code JavaScript
    document.body.appendChild(scriptElement);
  };

  const resetCode = () => {
    setJsCode(defaultJsValue);
    setHtmlCode(defaultHtmlValue);
    setCssCode(defaultCssValue);
    setCodeReset(true);
  };

  useEffect(() => {
    if (codeReset) {
      executeCode();
      setCodeReset(false); // Réinitialiser le déclencheur
    }
  }, [codeReset]); // Dépendance à codeReset

  return (
    <StyledContainer>
      <div>
        <h2>HTML</h2>
        <AceEditor
          mode="html"
          theme="monokai"
          value={htmlCode}
          onChange={onChangeHTML}
          name="html-container"
          editorProps={{ $blockScrolling: true }}
        />
      </div>
      <div>
        <h2>CSS</h2>
        <AceEditor
          mode="css"
          theme="monokai"
          value={cssCode.toString()}
          onChange={onChangeCSS}
          name="css-container"
          editorProps={{ $blockScrolling: true }}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
        />
      </div>
      <div>
        <h2>JAVASCRIPT</h2>
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={onChange}
          name="js-container"
          editorProps={{ $blockScrolling: true }}
          value={jsCode}
        />
      </div>

      <div className="iframe-container">
        <div id="iframeContainer">
          <iframe title="result" ref={iframeRef} />
        </div>
        <div>
          <button onClick={executeCode}>Execute</button>
          <button onClick={resetCode}>Reset</button>
        </div>
      </div>
    </StyledContainer>
  );
};

export default TextEditor;

document.getElementById;
