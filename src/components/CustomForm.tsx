import React from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import type { Rule } from 'antd/es/form';
import type { FormInstance } from 'antd/es/form';

// 定义普通表单项类型
type FormItemType = {
  name: string;
  label: string;
  component: 'input' | 'password' | 'select' | 'date' | 'textarea';
  rules?: Rule[];
  options?: { label: string; value: string | number }[];
};

// 定义动态表单项类型
type ArrayFieldItemType = {
  name: string;
  label: string;
  component: 'input' | 'password' | 'select' | 'date' | 'textarea';
  rules?: Rule[];
  options?: { label: string; value: string | number }[];
};

// 定义ArrayField配置类型
type ArrayFieldConfig = {
  fields: ArrayFieldItemType[];
  addButtonText?: string;
  removeButtonText?: string;
};

// 定义组件Props类型
interface CustomFormProps {
  formItems: (FormItemType | { type: 'array'; name: string; config: ArrayFieldConfig })[];
  onFinish: (values: any) => void;
  showReset?: boolean;
  showClear?: boolean;
  initialValues?: Record<string, any>;
}

// 异步校验函数（用于username和name）
const checkNameAvailability = async (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error('请输入名称'));
  }
  const response = await new Promise<{ isAvailable: boolean }>((resolve) =>
    setTimeout(() => resolve({ isAvailable: value !== 'admin' }), 500) // 模拟后端延迟500ms
  );
  if (!response.isAvailable) {
    return Promise.reject(new Error('名称已被占用'));
  }
  return Promise.resolve();
};

// ArrayField组件（添加状态同步和异步校验）
const ArrayField: React.FC<{ name: string; config: ArrayFieldConfig }> = ({ name, config }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <div key={field.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              {config.fields.map((fieldConfig) => (
                <Form.Item
                  key={fieldConfig.name}
                  name={[field.name, fieldConfig.name]}
                  label={fieldConfig.label}
                  rules={
                    fieldConfig.name === 'name'
                      ? [{ required: true, message: '请输入姓名' }, { validator: checkNameAvailability }]
                      : fieldConfig.rules
                  }
                  style={{ marginRight: 16 }}
                >
                  {fieldConfig.component === 'input' && <Input />}
                  {fieldConfig.component === 'password' && <Input.Password />}
                  {fieldConfig.component === 'select' && (
                    <Select>
                      {fieldConfig.options?.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                  {fieldConfig.component === 'date' && <DatePicker />}
                  {fieldConfig.component === 'textarea' && <Input.TextArea />}
                </Form.Item>
              ))}
              {/* 状态同步：当“关系”为“家人”时显示“亲属称呼” */}
              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev[name]?.[field.name]?.relationship !== curr[name]?.[field.name]?.relationship
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue([name, field.name, 'relationship']) === 'family' ? (
                    <Form.Item
                      name={[field.name, 'familyTitle']}
                      label="亲属称呼"
                      rules={[{ required: true, message: '请输入亲属称呼' }]}
                      style={{ marginRight: 16 }}
                    >
                      <Input placeholder="请输入亲属称呼" />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
              <Button type="link" onClick={() => remove(field.name)}>
                {config.removeButtonText || '删除'}
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={() => add()} style={{ width: '100%', marginBottom: 16 }}>
            {config.addButtonText || '添加'}
          </Button>
        </>
      )}
    </Form.List>
  );
};

// CustomForm组件（添加一键清空和异步校验）
const CustomForm: React.FC<CustomFormProps> = ({
  formItems,
  onFinish,
  showReset = true,
  showClear = true,
  initialValues,
}) => {
  const [form] = Form.useForm<FormInstance>();

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // 一键清空表单
  const handleClear = () => {
    const emptyValues = formItems.reduce((acc, item) => {
      if ('type' in item && item.type === 'array') {
        acc[item.name] = []; // 动态字段清空为数组
      } else {
        acc[item.name] = undefined; // 普通字段清空为undefined
      }
      return acc;
    }, {} as Record<string, any>);
    form.setFieldsValue(emptyValues);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
      {formItems.map((item) =>
        'type' in item && item.type === 'array' ? (
          <ArrayField key={item.name} name={item.name} config={item.config} />
        ) : (
          <Form.Item
            key={item.name}
            label={item.label}
            name={item.name}
            rules={
              item.name === 'username'
                ? [{ required: true, message: '请输入用户名' }, { validator: checkNameAvailability }]
                : item.rules
            }
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
        )
      )}
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
