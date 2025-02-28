import React from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import type { Rule } from 'antd/es/form'; // 导入 Rule 类型
import type { FormInstance } from 'antd/es/form'; // 导入 FormInstance 类型

// 定义表单项类型
type FormItemType = {
  name: string;
  label: string;
  component: React.ReactNode;
  rules?: Rule[]; // 使用 Ant Design 的 Rule 类型
  options?: { label: string; value: string | number }[]; // 下拉选项
};

// 定义组件 Props 类型
interface CustomFormProps {
  formItems: FormItemType[];
  onFinish: (values: any) => void;
  showReset?: boolean;
  showClear?: boolean;
  initialValues?: Record<string, any>;
}

const CustomForm: React.FC<CustomFormProps> = ({
  formItems,
  onFinish,
  showReset = true,
  showClear = true,
  initialValues
}) => {
  const [form] = Form.useForm<FormInstance>();

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // 清空表单
  const handleClear = () => {
    const emptyValues = formItems.reduce((acc, item) => {
      acc[item.name] = undefined;
      return acc;
    }, {} as Record<string, undefined>);
    form.setFieldsValue(emptyValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      {formItems.map((item) => (
        <Form.Item
          key={item.name}
          label={item.label}
          name={item.name}
          rules={item.rules}
        >
          {item.component === 'input' && <Input />}
          {item.component === 'password' && <Input.Password />}
          {item.component === 'select' && (
            <Select>
              {item.options?.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          )}
          {item.component === 'date' && <DatePicker />}
          {item.component === 'textarea' && <Input.TextArea />}
        </Form.Item>
      ))}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        {showReset && (
          <Button onClick={handleReset} style={{ marginLeft: 8 }}>
            重置
          </Button>
        )}
        {showClear && (
          <Button onClick={handleClear} style={{ marginLeft: 8 }}>
            清空
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default CustomForm;