import { getHistories, deleteHistories } from '@/services/shortener/history';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { history } from 'umi';

const useStyles = createStyles(() => {
  return {
    footerToolBar: {
      fontWeight: 600,
    },
  };
});

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.HistoryResponse[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteHistories({
      ids: selectedRows.map((row) => row.id).join(','),
    });
    // await APIRemoveShorten(selectedRows[0].id);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
const TableList: React.FC = () => {
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>(null);
  const [selectedRowsState, setSelectedRows] = useState<API.HistoryResponse[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const { styles } = useStyles();

  const columns: ProColumns<API.HistoryResponse>[] = [
    {
      title: 'ID',
      sorter: true,
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '短码',
      dataIndex: 'short_code',
      copyable: true,
    },
    {
      title: '访问者 IP',
      dataIndex: 'ip_address',
    },
    {
      title: '来源 URL',
      dataIndex: 'referer',
      hideInSearch: true,
    },
    {
      title: 'User-Agent',
      dataIndex: 'user_agent',
      hideInSearch: true,
    },
    {
      title: '国家',
      dataIndex: 'country',
      hideInSearch: true,
    },
    {
      title: '区域',
      dataIndex: 'region',
      hideInSearch: true,
    },
    {
      title: '省份',
      dataIndex: 'province',
      hideInSearch: true,
    },
    {
      title: '城市',
      dataIndex: 'city',
      hideInSearch: true,
    },
    {
      title: '运营商',
      dataIndex: 'isp',
      hideInSearch: true,
    },
    {
      title: '设备类型',
      dataIndex: 'device_type',
      hideInSearch: true,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      hideInSearch: true,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      hideInSearch: true,
    },
    {
      title: '访问时间',
      dataIndex: 'accessed_at',
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
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.HistoryResponse, API.getHistoriesParams>
        headerTitle={'日志列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
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
            const res = await getHistories(query);
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
        columnsState={{
          // 配置默认隐藏的列
          defaultValue: {
            referer: { show: false },
            country: { show: false },
            region: { show: false },
            province: { show: false },
            city: { show: false },
            // browser: { show: false },
            os: { show: false },
            device_type: { show: false },
            isp: { show: false },
          },
        }}
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
    </PageContainer>
  );
};
export default TableList;
