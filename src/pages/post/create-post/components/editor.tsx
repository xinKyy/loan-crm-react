import React, { useEffect, useState } from 'react';
// import BraftEditor from 'braft-editor';
import {
  Button,
  Card,
  Form,
  Grid,
  Input,
  Message,
  Radio,
  Spin,
} from '@arco-design/web-react';
import { myUploadFn } from '@/utils/uploadFn';
import { APICreatePost, APIGetPostDetail } from '@/api/api';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const { Row, Col } = Grid;
const RadioGroup = Radio.Group;
const { useForm } = Form;
let BraftEditor: any = dynamic(
  () =>
    import('braft-editor').then((module: any) => {
      BraftEditor = module.default; // 这里进行对BraftEditor 进行覆盖
      return module.default;
    }),
  { ssr: false }
);
const Editor = () => {
  const [editorState, setEditorState]: any = useState();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [form] = useForm();
  const router = useRouter();

  useEffect(() => {
    getPostDetail();
  }, []);

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const submitContent = async () => {
    const htmlContent = editorState.toHTML();
  };

  const createPost = async () => {
    setLoading(true);
    const params = form.getFieldsValue();
    const html = editorState.toHTML();
    let imgSrc = '';
    if (html.indexOf('<img') != -1) {
      imgSrc = html.split('<img')[1].split('src="')[1].split('"/>')[0];
    }

    APICreatePost({
      title: params.title,
      body: html,
      image: imgSrc,
      status: params.status,
      id: id,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success(`文章${id ? '修改' : '发布'}成功！`);
          router.push('/post/post-table');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getPostDetail = () => {
    if (router.query?.id) {
      setLoading(true);
      APIGetPostDetail({
        id: router.query.id,
      })
        .then((resp: any) => {
          if (resp.result) {
            setTimeout(() => {
              setEditorState(
                BraftEditor.createEditorState(resp.result.noticeBody)
              );
            }, 500);
            form.setFieldsValue({
              title: resp.result.noticeTitle,
              status: resp.result.status.toString(),
            });
            setId(resp.result.id);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setTimeout(() => {
        setEditorState(BraftEditor.createEditorState(null));
      }, 500);
    }
  };

  return (
    <Spin style={{ width: '100%' }} loading={loading}>
      <Card>
        <div style={{ height: 20 }}></div>
        <Row gutter={24}>
          <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} form={form}>
            <Col span={24}>
              <Form.Item label={'标题：'} field={'title'}>
                <Input placeholder={'请输入文章标题'}></Input>
              </Form.Item>
            </Col>
            <Col span={24}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '120px', textAlign: 'right' }}>内容：</div>
                <div style={{ border: '1px solid #000', borderRadius: '10px' }}>
                  <BraftEditor
                    media={{ uploadFn: myUploadFn }}
                    value={editorState}
                    onChange={handleEditorChange}
                    onSave={submitContent}
                  />
                </div>
              </div>
            </Col>
            <Col span={24}>
              <div style={{ height: 20 }}></div>
              <Form.Item initialValue={'1'} label={'语言：'} field={'status'}>
                <RadioGroup defaultValue="1">
                  <Radio value="1">英语</Radio>
                  <Radio value="2">中文简体</Radio>
                  <Radio value="3">中文繁体</Radio>
                </RadioGroup>
              </Form.Item>
            </Col>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                type={'primary'}
                onClick={createPost}
                style={{ width: '300px' }}
              >
                提交
              </Button>
            </div>
          </Form>
        </Row>
      </Card>
    </Spin>
  );
};

export default Editor;
