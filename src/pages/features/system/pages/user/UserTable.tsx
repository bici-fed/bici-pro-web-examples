import { queryUserPageList } from '@/pages/features/system/apis/account';
import { DownOutlined } from '@ant-design/icons';
import type { ColumnsState, ProColumns } from '@bicitech-design/pro-components';
import { ProTable } from '@bicitech-design/pro-components';
import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import UserEditModal from './UserEditModal';

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error'
};

export type TableListItem = {
  key: number;
  name: string;
  containers: number;
  creator: string;
  status: string;
  createdAt: number;
  memo: string;
};

const columns: ProColumns<TableListItem>[] = [
  {
    title: '用户账号',
    width: 180,
    dataIndex: 'account',
    fixed: 'left',
    render: _ => <a>{_}</a>
  },
  {
    title: '员工编号',
    dataIndex: 'workerNumber',
    width: 80,
    align: 'right',
    sorter: (a, b) => a.containers - b.containers
  },
  {
    title: '姓名',
    width: 80,
    dataIndex: 'name'
  },
  {
    title: '性别',
    width: 80,
    dataIndex: 'sex',
    valueEnum: {
      1: { text: '男 ' },
      0: { text: '女' }
    }
  },
  {
    title: '手机号',
    width: 180,
    dataIndex: 'phone',
    render: _ => <a>{_}</a>
  },
  {
    title: '邮箱',
    width: 180,
    dataIndex: 'email',
    render: _ => <a>{_}</a>
  },
  {
    title: '岗位信息',
    width: 180,
    dataIndex: 'jobInfo',
    render: _ => <a>{_}</a>
  },
  {
    title: '所属部门',
    width: 180,
    dataIndex: 'deptName',
    render: _ => <a>{_}</a>
  },
  {
    title: '角色信息',
    width: 180,
    dataIndex: 'roleName',
    render: _ => <a>{_}</a>
  },
  {
    title: '用户状态',
    width: 180,
    dataIndex: 'disable',
    render: _ => <a>{_}</a>
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    search: false,
    fixed: 'right',
    render: () => [
      <a key="link">编辑</a>,
      <a key="link2">禁用</a>,
      <a key="link3">删除</a>,
      <a key="link4">重设密码</a>
    ]
  }
];

const UserTable = () => {
  /**设置列显示*/
  const [columnsStateMap, setColumnsStateMap] = useState<{
    [key: string]: ColumnsState;
  }>({
    name: { show: false },
    disable: { show: false },
    memo: { show: false },
    jobInfo: { show: false },
    phone: { show: false }
  });

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    const users = await queryUserPageList({ deptCode: '01' });
    console.log(users);
  };

  return (
    <>
      <ProTable<TableListItem>
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [1]
        }}
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          return queryUserPageList(params);
        }}
        defaultRowExpandableConfig={{
          columnCount: 2,
          rowExpandable: record => {
            console.log(record);
            return true;
          },
          mode: 'all'
        }}
        rowPreviewMode="drawer"
        scroll={{ y: 'calc(100vh - 310px)' }}
        rowKey="key"
        pagination={{
          showQuickJumper: true
        }}
        columns={columns}
        search={false}
        dateFormatter="string"
        headerTitle="中行上大"
        columnsState={{
          value: columnsStateMap,
          onChange: map => {
            setColumnsStateMap(map);
          }
        }}
        // columnsStateMap={columnsStateMap}
        // onColumnsStateChange={map => setColumnsStateMap(map)}
        toolBarRender={() => [
          <Button key="show">删除</Button>,
          <Button key="out">
            excel导入
            <DownOutlined />
          </Button>,
          <UserEditModal
            trigger={
              <Button type="primary" key="primary">
                新增用户
              </Button>
            }
          />
        ]}
      />
    </>
  );
};

export default UserTable;
