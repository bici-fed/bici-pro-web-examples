import IconFont from '@/components/IconFont';
import { queryMenuList } from '@/pages/features/system/apis/menu';
import MenuEditModal from '@/pages/features/system/pages/menu/MenuEditModal';
import { toTableTree } from '@/utils/menu';
import {
  ActionType,
  ProColumns,
  ProTable,
  TableDropdown
} from '@bicitech-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef, useState } from 'react';

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  menuType: number;
  state: string;
  comments: number;
  createTime: string;
  updateTime: string;
  closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: '菜单名称',
    dataIndex: 'title',
    width: 200,
    render: (text, record) => {
      return <span>{record.title}</span>;
    }
  },
  {
    title: '路由地址',
    dataIndex: 'path'
  },
  {
    title: '组件路径',
    dataIndex: 'component'
  },
  {
    title: '权限标识',
    dataIndex: 'authority'
  },
  {
    disable: true,
    title: '可见',
    dataIndex: 'hide',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '是',
        status: 'Error'
      },
      1: {
        text: '否',
        status: 'Success',
        disabled: true
      }
    }
  },
  {
    disable: true,
    title: '类型',
    dataIndex: 'menuType',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Tag
        key={record.menuType}
        title={'aaa'}
        color={record.menuType === 0 ? 'blue' : 'purple'}
      >
        {record.menuType === 0 ? '菜单' : '按钮'}
      </Tag>
    )
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    search: false,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' }
        ]}
      />
    ]
  }
];

const MenuTable = () => {
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const fetchMenuList = async params => {
    const menus = await queryMenuList(params);
    const treeData = toTableTree(menus.data, 0);
    setDataSource(treeData);
    return [];
  };

  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      dataSource={dataSource}
      expandable={{
        defaultExpandAllRows: true,
        expandedRowKeys: expandedRowKeys,
        onExpandedRowsChange: expandedRows => {
          console.log(expandedRows);
          setExpandedRowKeys(expandedRows);
        }
      }}
      cardBordered
      request={async (params = {}, sort, filter) => {
        return fetchMenuList(params);
      }}
      editable={{
        type: 'multiple'
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        }
      }}
      rowKey="menuId"
      search={{
        labelWidth: 'auto'
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime]
            };
          }
          return values;
        }
      }}
      pagination={false}
      dateFormatter="string"
      headerTitle={
        <Space>
          <MenuEditModal />
          <Button
            key="open"
            type="dashed"
            icon={<IconFont type="icon-javascript" spin={true} />}
          >
            展开全部
          </Button>
          <Button key="close" type="dashed">
            折叠全部
          </Button>
        </Space>
      }
    />
  );
};

export default MenuTable;
