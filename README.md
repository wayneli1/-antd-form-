📝 CustomForm
基于React和Ant Design实现的自定义表单组件，使用TypeScript作为开发语言，主要功能是通过配置生成表单项，支持多种表单元素类型和表单验证，提供重置和清空功能。

简单易用的API
支持多种表单元素（Input、Select、DatePicker等）
支持表单验证
提供重置和清空功能
基于TypeScript，提供完整类型定义
完全兼容Ant Design表单规范

组件
CustomForm: 自定义表单组件（通过配置快速生成表单，支持多种表单元素和验证规则）

安装
安装组件
bashCopynpm i custom-form --save
# OR
yarn add custom-form
安装依赖
bashCopynpm i antd --save
# OR
yarn add antd
引入组件
tsxCopyimport React from 'react';
import CustomForm from 'custom-form';
import 'antd/dist/antd.css';
import type { Rule } from 'antd/es/form';

// 定义表单项（例子）
const formItems = [
  {
    name: 'username',
    label: '用户名',
    component: 'input',
    rules: [{ required: true, message: '请输入用户名' }] as Rule[]
  },
  {
    name: 'role',
    label: '角色',
    component: 'select',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '用户', value: 'user' }
    ]
  }
];

// 使用组件
const App = () => (
  <CustomForm 
    formItems={formItems} 
    onFinish={(values) => console.log(values)} 
  />
);
使用示例
tsxCopyimport React from 'react';
import CustomForm from 'custom-form';
import type { Rule } from 'antd/es/form';

const BasicExample = () => {
  // 定义表单项
  const formItems = [
    {
      name: 'username',
      label: '用户名',
      component: 'input',
      rules: [{ required: true, message: '请输入用户名' }] as Rule[]
    },
    {
      name: 'password',
      label: '密码',
      component: 'password',
      rules: [{ required: true, message: '请输入密码' }] as Rule[]
    },
    {
      name: 'role',
      label: '角色',
      component: 'select',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' }
      ]
    },
    {
      name: 'birthday',
      label: '生日',
      component: 'date'
    },
    {
      name: 'description',
      label: '描述',
      component: 'textarea'
    }
  ];

  // 表单提交处理
  const handleFinish = (values: any) => {
    console.log('表单数据:', values);
  };

  return (
    <CustomForm
      formItems={formItems}
      onFinish={handleFinish}
      showReset={true}
      showClear={true}
      initialValues={{ role: 'user' }}
    />
  );
};
API
CustomForm
参数说明类型默认值formItems表单项配置FormItemType[][]onFinish提交表单且数据验证成功后回调事件(values: any) => void-showReset是否显示重置按钮booleantrueshowClear是否显示清空按钮booleantrueinitialValues表单默认值Record<string, any>-
FormItemType
参数说明类型默认值name表单项名称string-label表单项标签string-component表单项组件类型'input' | 'password' | 'select' | 'date' | 'textarea'-rules表单项验证规则Rule[]-options下拉选项（仅当component为'select'时有效）{ label: string; value: string | number }[]-
