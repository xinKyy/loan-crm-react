import {
  Form,
  Input,
  Checkbox,
  Link,
  Button,
  Space,
  Message,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useStorage from '@/utils/useStorage';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import {APIDoLogin, APILoginAdmin, APIUserAdminLogin} from '@/api/api';
import { router } from 'next/client';
import { useRouter } from 'next/router';
import cookies from 'next-cookies';
import { setCookie } from '@/utils/dateUtil';

export default function LoginForm() {
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage('loginParams');
  const t = useLocale(locale);
  const [rememberPassword, setRememberPassword] = useState(false);
  function afterLoginSuccess(params) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(params));
    } else {
      removeLoginParams();
    }
    // 记录登录状态
    localStorage.setItem('userStatus', 'login');
    localStorage.setItem('token', params.data.accessToken);
    setCookie('satoken', params.data.accessToken, 7);
    // 跳转首页
    window.location.href = '/';
  }
  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      login(values);

      // if(values.userName !== "admin" || values.password !== "admin"){
      //   return Message.error("账号或密码错误！");
      // }

      // // 记录登录状态
      // localStorage.setItem('userStatus', 'login');
      // localStorage.setItem('token', 'aaa');
      // setCookie('satoken', 'aaa', 7);
      // // 跳转首页
      // window.location.href = '/';
    });
  }

  const login = (params) => {
    setLoading(true);
    APILoginAdmin({
      ...params,
      name: params.userName,
    })
      .then((resp: any) => {
        if (resp.data) {
          afterLoginSuccess(resp);
          localStorage.setItem('adminUserName', params.userName);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const rememberPassword = !!loginParams;
    setRememberPassword(rememberPassword);
    if (formRef.current && rememberPassword) {
      const parseParams = JSON.parse(loginParams);
      formRef.current.setFieldsValue(parseParams);
    }
  }, [loginParams]);

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>登录Loan Admin</div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form className={styles['login-form']} layout="vertical" ref={formRef}>
        <Form.Item
          field="userName"
          rules={[{ required: true, message: '用户名不能为空' }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={'请输入用户名'}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={'请输入密码'}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Checkbox
              checked={rememberPassword}
              onChange={() => setRememberPassword(!rememberPassword)}
            >
              记住密码
            </Checkbox>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            登录
          </Button>
        </Space>
      </Form>
    </div>
  );
}
