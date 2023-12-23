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
    if (values.type === 'all') {
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
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label={'用户昵称'} field="account">
              <Input placeholder={'请输入用户昵称'} allowClear />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'邮箱号'} field="email">
              <Input allowClear placeholder={'请输入邮箱号'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'用户ID'} field="id">
              <Input allowClear placeholder={'请输入用户ID'} />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label={'推荐人'} field="recommended">
              <Input allowClear placeholder={'请输入推荐人昵称'} />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label={'接点人'} field="contract">
              <Input allowClear placeholder={'请输入接点人昵称'} />
            </Form.Item>
          </Col>

          <Col span={colSpan}>
            <Form.Item label={'地址'} field="address">
              <Input allowClear placeholder={'请输入地址'} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          搜索
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
