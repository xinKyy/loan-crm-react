
import 'braft-editor/dist/index.css';
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('./components/editor'), { ssr: false });

const CreatePost = () => {
  return <Editor></Editor>
}

export default CreatePost;
