import React from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import type { Rule } from 'antd/es/form'; // 导入 Rule 类型
import type { FormInstance } from 'antd/es/form'; // 导入 FormInstance 类型

// 定义表单项类型（普通字段）
type FormItemType = {
  name: string;
  label: string;
  component: 'input' | 'password' | 'select' | 'date' | 'textarea';
  rules?: Rule[];
  options?: { label: string; value: string | number }[]; // 下拉选项
};

// 定义动态表单项类型（ArrayField专用）
type ArrayFieldItemType = {
  name: string;
  label: string;
  component: 'input' | 'password' | 'select' | 'date' | 'textarea';
  rules?: Rule[];
  options?: { label: string; value: string | number }[];
};

// 定义ArrayField的配置类型
type ArrayFieldConfig = {
  fields: ArrayFieldItemType[];
  addButtonText?: string;
  removeButtonText?: string;
};

// 定义组件 Props 类型
interface CustomFormProps {
  formItems: (FormItemType | { type: 'array'; name: string; config: ArrayFieldConfig })[];
  onFinish: (values: any) => void;
  showReset?: boolean;
  showClear?: boolean;
  initialValues?: Record<string, any>;
}

// ArrayField 组件
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
                  rules={fieldConfig.rules}
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
      {formItems.map((item) =>
        'type' in item && item.type === 'array' ? (
          <ArrayField key={item.name} name={item.name} config={item.config} />
        ) : (
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
