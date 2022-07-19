import ContentCardBody from '@/layouts/ContentCardBody';
import DeptTree from '@/pages/features/system/pages/user/DeptTree';
import UserTable from '@/pages/features/system/pages/user/UserTable';
import { MehOutlined } from '@ant-design/icons';
import { ProCard } from '@bicitech-design/pro-components';
import { Input } from 'antd';
import { useState } from 'react';
import './index.less';

const { Search } = Input;

const PREFIX = 'bici-wui';

// 过滤树并得到新树，filterArrForKey({ tree: 遍历的树, searchKey: 查询依据的key, searchValue: 查询内容 })
const filterArrForKey = ({ tree, searchKey, searchValue }) => {
  if (!(tree && tree.length)) {
    return [];
  }
  let newArr = [];
  newArr = tree.map(item => {
    if (item.childDeptList && item.childDeptList.length) {
      const newChildren = filterArrForKey({
        tree: item.childDeptList,
        searchKey,
        searchValue
      });
      const res = {
        title: item.name,
        key: item.code,
        icon: null
      };
      if (newChildren && newChildren.length) {
        res.children = newChildren;
      }
      return res;
    }
    if (item?.[searchKey]?.toString()?.includes(searchValue)) {
      return {
        title: item.name,
        key: item.code,
        icon: <MehOutlined />
      };
    }
    return null;
  });
  newArr = newArr.filter(item => item != null);
  return newArr;
};

const treeMap = (treeData, searchKey, searchValue) => {
  return filterArrForKey({ tree: treeData, searchKey, searchValue });
};

const UserManagePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const onSearch = val => {
    setSearchValue(val);
    // const deptData = treeMap(dept,"title",searchValue);
    // setDept(deptData);
  };

  const DeptCardHeader = (
    <>
      <span>组织架构</span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Search
          placeholder="按组织名称模糊查询"
          onSearch={onSearch}
          enterButton
        />
        <span>展开</span>
      </div>
    </>
  );

  return (
    <ContentCardBody>
      <ProCard split="vertical" gutter={16}>
        <ProCard
          title={DeptCardHeader}
          colSpan={{ xs: 5, sm: 6 }}
          bodyStyle={{
            height: 'calc(100vh - 230px)',
            overflowY: 'auto'
          }}
        >
          <DeptTree search={searchValue} />
        </ProCard>
        <ProCard
          colSpan={{ xs: 19, sm: 18 }}
          style={{ height: 'calc(100vh - 230px)' }}
          bodyStyle={{ padding: 0 }}
        >
          <UserTable />
        </ProCard>
      </ProCard>
    </ContentCardBody>
  );
};
export default UserManagePage;
