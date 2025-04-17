import {
  ProFormText,
  ProFormTextArea,
  ModalForm,
} from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.Shorten>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.Shorten>;
};

/**
 * 更新表单组件
 *
 * @param props 表单属性
 * @returns 返回模态表单组件
 */
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
      <ModalForm
        key={props.values.code}
        initialValues={props.values}
        title={'更新短链'}
        width="400px"
        open={props.updateModalOpen}
        onOpenChange={props.onCancel}
        onFinish={props.onSubmit}
      >
        <ProFormText
          name="code"
          hidden
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '源链接为必填项',
            },
            {
              type: 'url',
              message: '请输入有效的 URL'
            },
          ]}
          width="md"
          name="original_url"
          label="源链接"
          placeholder="请输入源链接"
        />
        <ProFormTextArea
          width="md"
          name="describe"
          label="链接描述"
          placeholder="链接描述" />
      </ModalForm>
  );
};
export default UpdateForm;
