import React, {useEffect, useState} from "react";
import BraftEditor from "braft-editor";
import {Card} from "@arco-design/web-react";

const Editor = () =>{

  const [editorState, setEditorState]:any = useState(BraftEditor.createEditorState(null) );
  const [loaded, setLoaded] = useState(false);

  useEffect(()=>{
    setTimeout(()=>{
      setLoaded(true);
    }, 200);
  }, []);

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  }

  const submitContent = async () => {
    const htmlContent = editorState.toHTML()
    console.log(htmlContent);
  }

  return (
    <Card>
      {
        loaded ?   <BraftEditor
          value={editorState}
          onChange={handleEditorChange}
          onSave={submitContent}
        /> : null
      }

    </Card>
  )
}

export default Editor;
