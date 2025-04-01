import React from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import type { Rule } from 'antd/es/form';
import type { FormInstance } from 'antd/es/form';

// 统一表单项类型
interface FormItemType {
  name: string;
  label: string;
  component: 'input' | 'password' | 'select' | 'date' | 'textarea';
  rules?: Rule[];
  options?: { label: string; value: string | number }[];
  validator?: (value: any) => Promise<void>;
  dependencies?: string[]; // 用于条件渲染
  renderWhen?: (values: any) => boolean; // 条件渲染逻辑
}

// 动态字段配置
interface ArrayFieldConfig {
  fields: FormItemType[];
  addButtonText?: string;
  removeButtonText?: string;
}

// 组件 Props 类型
interface CustomFormProps {
  formItems: (FormItemType | { type: 'array'; name: string; config: ArrayFieldConfig })[];
  onFinish: (values: any) => void;
  showReset?: boolean;
  showClear?: boolean;
  initialValues?: Record<string, any>;
}

// 异步校验函数（示例）
const checkNameAvailability = async (value: string) => {
  if (!value) throw new Error('请输入名称');
  const response = await new Promise<{ isAvailable: boolean }>((resolve) =>
    setTimeout(() => resolve({ isAvailable: value !== 'admin' }), 500)
  );
  if (!response.isAvailable) throw new Error('名称已被占用');
};

// 渲染单个表单项的通用组件
const RenderFormItem: React.FC<{
  item: FormItemType;
  prefix?: string | number; // 用于动态字段的 name 前缀
}> = ({ item, prefix }) => {
  const name = prefix !== undefined ? [prefix, item.name] : item.name;
  const rules = item.validator ? [...(item.rules || []), { validator: (_, v) => item.validator!(v) }] : item.rules;

  return (
    <Form.Item name={name} label={item.label} rules={rules} dependencies={item.dependencies}>
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
  );
};

// 动态字段组件
const ArrayField: React.FC<{ name: string; config: ArrayFieldConfig }> = ({ name, config }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <div style={{ marginBottom: 16 }}>
          {fields.map((field) => (
            <div key={field.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              {config.fields.map((fieldConfig) => (
                <div key={fieldConfig.name} style={{ flex: 1, marginRight: 16 }}>
                  {fieldConfig.renderWhen ? (
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, curr) =>
                        fieldConfig.dependencies?.some(
                          (dep) => prev[name]?.[field.key]?.[dep] !== curr[name]?.[field.key]?.[dep]
                        )
                      }
                    >
                      {({ getFieldValue }) =>
                        fieldConfig.renderWhen?.(getFieldValue([name, field.name])) ? (
                          <RenderFormItem item={fieldConfig} prefix={field.name} />
                        ) : null
                      }
                    </Form.Item>
                  ) : (
                    <RenderFormItem item={fieldConfig} prefix={field.name} />
                  )}
                </div>
              ))}
              <Button type="link" onClick={() => remove(field.name)}>
                {config.removeButtonText || '删除'}
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={() => add()} style={{ width: '100%' }}>
            {config.addButtonText || '添加'}
          </Button>
        </div>
      )}
    </Form.List>
  );
};

// 主表单组件
const CustomForm: React.FC<CustomFormProps> = ({
  formItems,
  onFinish,
  showReset = true,
  showClear = true,
  initialValues,
}) => {
  const [form] = Form.useForm<FormInstance>();

  const handleReset = () => form.resetFields();

  const handleClear = () => {
    const emptyValues = formItems.reduce((acc, item) => {
      acc['type' in item ? item.name : item.name] = 'type' in item ? [] : undefined;
      return acc;
    }, {} as Record<string, any>);
    form.setFieldsValue(emptyValues);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
      {formItems.map((item) =>
        'type' in item ? (
          <ArrayField key={item.name} name={item.name} config={item.config} />
        ) : (
          <RenderFormItem key={item.name} item={item} />
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
