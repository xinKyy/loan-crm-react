const upLoadImageUrl = '/api/upload/uploadPicUrl';

interface UploadParams {
  file: File;
  success: (result: { url: string; meta: any }) => void;
  progress: (percent: number) => void;
  error: (error: { msg: string }) => void;
}

export const myUploadFn = (param: UploadParams): void => {
  const serverURL = upLoadImageUrl;
  const xhr = new XMLHttpRequest();
  const fd = new FormData();

  const successFn = (response: any): void => {
    console.log('edit', response);
    const newResponse = JSON.parse(response.response);
    console.log(newResponse);
    param.success({
      url: newResponse.result.url,
      meta: {
        id: 'xxx',
        title: 'xxx',
        alt: 'xxx',
        loop: true,
        autoPlay: true,
        controls: true,
        poster: 'http://xxx/xx.png',
      },
    });
  };

  const progressFn = (event: ProgressEvent): void => {
    param.progress((event.loaded / event.total) * 100);
  };

  const errorFn = (response: any): void => {
    param.error({
      msg: '上传失败，文件可能过大',
    });
  };

  // xhr.addEventListener('load', successFn, false);
  // xhr.addEventListener('error', errorFn, false);
  // xhr.addEventListener('abort', errorFn, false);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        successFn(xhr);
      } else {
        errorFn(xhr);
      }
    }
  };

  fd.append('file', param.file);
  xhr.open('POST', serverURL, true);
  xhr.send(fd);
};
