import React, { useContext } from 'react';
import dayjs from 'dayjs';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Grid,
  Radio,
  Space,
} from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import locale from './locale';
import useLocale from '@/utils/useLocale';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
const { RangePicker } = DatePicker;
const { Row, Col } = Grid;
const { useForm } = Form;
const RadioGroup = Radio.Group;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const { lang } = useContext(GlobalContext);

  const t = useLocale(locale);
  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    if(values.type === "all"){
      delete values.type;
    }
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  const colSpan = lang === 'zh-CN' ? 8 : 12;

  function onSelect(dateString, date) {
    console.log('onSelect', dateString, date);
  }

  function onChange(dateString, date) {
    console.log('onChange: ', dateString, date);
  }

  function onOk(dateString, date) {
    console.log('onOk: ', dateString, date);
  }

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col>
            <Row>
              <Form.Item field={"type"}>
                <RadioGroup
                  type="button"
                  name="lang"
                  defaultValue="all"
                  style={{ marginRight: 20, marginBottom: 20 }}
                >
                  <Radio value="all">全部用户</Radio>
                  <Radio value="0">普通会员</Radio>
                  <Radio value="1">钻石</Radio>
                  <Radio value="2">大使</Radio>
                  <Radio value="3">总裁</Radio>
                </RadioGroup>
              </Form.Item>
            </Row>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label={'用户昵称'} field="NickName">
              <Input placeholder={'请输入用户昵称'} allowClear />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'邮箱号'} field="email">
              <Input allowClear placeholder={'请输入邮箱号'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'用户ID'} field="userId">
              <Input allowClear placeholder={'请输入用户ID'} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          {t['searchTable.form.search']}
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          {t['searchTable.form.reset']}
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
