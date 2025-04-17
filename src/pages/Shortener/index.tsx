import {
  getShortens,
  addShorten,
  updateShorten,
  deleteShorten,
} from '@/services/shortener/shorten';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { createStyles } from 'antd-style';
import { history } from 'umi';

const useStyles = createStyles(() => {
  return {
    footerToolBar: {
      fontWeight: 600,
    },
  };
});

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<API.ShortenResponse>();
  const [selectedRowsState, setSelectedRows] = useState<API.ShortenResponse[]>([]);
  const addFormRef = useRef<ProFormInstance>(null); // 创建表单引用
  const [messageApi, contextHolder] = message.useMessage();

  const { styles } = useStyles();

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.Shorten) => {
    const hide = messageApi.loading('正在添加');
    try {
      await addShorten({
        ...fields,
      });
      hide();
      messageApi.success('添加成功');
      return true;
    } catch (error) {
      hide();
      messageApi.error('添加失败，请重试！');
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: FormValueType) => {
    const hide = messageApi.loading('更新中');
    try {
      await updateShorten(
        {
          code: fields.code as string,
        },
        {
          original_url: fields.original_url as string,
          describe: fields.describe,
        },
      );
      hide();
      messageApi.success('更新成功');
      return true;
    } catch (error) {
      hide();
      messageApi.error('更新失败，请重试');
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: API.ShortenResponse[]) => {
    const hide = messageApi.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteShorten({
        ids: selectedRows.map((row) => row.id).join(','),
      });
      // await APIRemoveShorten(selectedRows[0].id);
      hide();
      messageApi.success('删除成功，即将刷新');
      return true;
    } catch (error) {
      hide();
      messageApi.error('Delete failed, please try again');
      return false;
    }
  };

  const columns: ProColumns<API.ShortenResponse>[] = [
    {
      title: 'ID',
      sorter: true,
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '短码',
      dataIndex: 'code',
      copyable: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              window.open(entity.short_url, '_blank');
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '源地址',
      dataIndex: 'original_url',
      copyable: true,
      render(dom, entity) {
        return (
          <a
            onClick={() => {
              window.open(entity.original_url, '_blank');
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'describe',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '启用',
          status: 'Success',
        },
        1: {
          text: '禁用',
          status: 'Error',
        },
        2: {
          text: '未知',
          status: 'Processing',
        },
      },
    },
    {
      title: '最后更新时间',
      sorter: true,
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          更新
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.ShortenResponse, API.getShortensParams>
        headerTitle={'短址列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          let data: any = [];
          let total = 0;
          let success = false;

          try {
            const { current: page, pageSize: page_size, ...rest } = params;
            // console.log(page, page_size, params, sorter, filter, rest);
            const query: API.getShortensParams = {
              page: page || 1,
              page_size: page_size || 10,
              ...rest,
            };
            const orderBy = Object.entries(sorter)[0];
            if (orderBy && orderBy.length === 2) {
              query.sort_by = orderBy[0];
              query.order = orderBy[1] === 'ascend' ? 'asc' : 'desc';
            }
            const res = await getShortens(query);
            data = res.data || [];
            total = res.meta?.total_items || 0;
            success = true;
          } catch (error: any) {
            let { errinfo } = error?.response?.data;
            messageApi.error(errinfo ?? '数据获取失败');

            const { status } = error?.response;
            if (status === 401) {
              history.replace({
                pathname: '/account/login',
              });
            }
          }
          return {
            data: data,
            success: success,
            total: total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a className={styles.footerToolBar}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        title={'新建短链'}
        width="400px"
        formRef={addFormRef}
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.Shorten);
          if (success) {
            handleModalOpen(false);
            addFormRef.current?.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText width="sm" name="code" label="短码" placeholder="请输入短码。可选" />
        <ProFormText
          rules={[
            {
              required: true,
              message: '源链接为必填项',
            },
          ]}
          width="md"
          name="original_url"
          label="源链接"
          placeholder="请输入源链接"
        />
        <ProFormTextArea width="md" name="describe" label="描述" placeholder="链接描述" />
      </ModalForm>

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={(value) => {
          handleUpdateModalOpen(value ?? false);
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};
export default TableList;
