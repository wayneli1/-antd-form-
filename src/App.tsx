import React from 'react';
import CustomForm from './components/CustomForm';
import { checkNameAvailability } from './components/CustomForm'; // 导入校验函数

const App = () => {
  const formItems = [
    {
      name: 'username',
      label: '用户名',
      component: 'input',
      rules: [{ required: true, message: '请输入用户名' }],
      validator: checkNameAvailability, // 添加异步校验
    },
    {
      name: 'password',
      label: '密码',
      component: 'password',
      rules: [{ required: true, message: '请输入密码' }],
    },
    {
      name: 'gender',
      label: '性别',
      component: 'select',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
    {
      name: 'birthday',
      label: '出生日期',
      component: 'date',
      rules: [{ required: true, message: '请选择出生日期' }],
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>用户注册表单</h1>
      <CustomForm
        formItems={formItems}
        onFinish={(values) => console.log('提交数据:', values)}
        showReset
        showClear
      />
    </div>
  );
};

export default App;
