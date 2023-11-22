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
        wrapperCol={{ span: 21 }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={'订单状态：'} field={'status'}>
              <RadioGroup
                type="button"
                name="lang"
                defaultValue="all"
                style={{ marginRight: 20, marginBottom: 0 }}
              >
                <Radio value="all">全部</Radio>
                <Radio value="p1">待审核</Radio>
                <Radio value="p2">已审核</Radio>
                <Radio value="p3">已失效</Radio>
                <Radio value="p4">已完成</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ display: 'flex' }}>
          <Form.Item label={'时间选择：'} field={'dateStart'}>
            <RadioGroup
              type="button"
              name="lang"
              defaultValue="dateAll"
              style={{ marginBottom: 0 }}
            >
              <Radio value="dateAll">全部</Radio>
              <Radio value="d1">今天</Radio>
              <Radio value="d2">昨天</Radio>
              <Radio value="d3">最近7天</Radio>
              <Radio value="d4">最近30天</Radio>
              <Radio value="d5">本月</Radio>
              <Radio value="d6">本年</Radio>
            </RadioGroup>
          </Form.Item>
          <Form.Item field={'date'}>
            <RangePicker
              style={{ width: 360, margin: '0 0 0 0' }}
              showTime={{
                defaultValue: ['00:00', '00:00'],
                format: 'HH:mm',
              }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChange}
              onSelect={onSelect}
              onOk={onOk}
            />
          </Form.Item>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={'订单单号:'} field="id">
              <Input placeholder={'请输入订单号'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'用户ID号:'} field="userId">
              <Input allowClear placeholder={'请输入用户ID号'} />
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
