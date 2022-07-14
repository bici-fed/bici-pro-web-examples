import { fetchDeptTree } from '@/pages/features/system/apis/dept';
import {
  DeleteOutlined,
  EditOutlined,
  MehOutlined,
  MinusSquareOutlined,
  PlusCircleOutlined,
  PlusSquareOutlined
} from '@ant-design/icons';
import { Space, Tree } from 'antd';
import { DataNode, TreeProps } from 'antd/es/tree';
import { useEffect, useMemo, useRef, useState } from 'react';

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

interface DeptTreeProps {
  search: string;
}

const DeptTree = ({ search }: DeptTreeProps) => {
  const [dept, setDept] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState(search);

  const [expandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0']);

  let deptRef = useRef(null);

  useEffect(() => {
    requestDeptTree();
  }, []);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const requestDeptTree = async () => {
    const data = await fetchDeptTree({});
    const deptData = treeMap(data, 'name', searchValue);
    setDept(deptData);
  };

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
    setSelectedKeys(selectedKeys);
  };

  /**
   * 新增机构
   * @param e
   * @param node
   */
  const addDept = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('add Dept', node);
  };
  /**
   * 新增机构
   * @param e
   * @param node
   */
  const deleteDept = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('delete Dept', node);
  };
  /**
   * 新增机构
   * @param e
   * @param node
   */
  const editDept = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('edit Dept', node);
  };

  /**
   * 编辑按钮
   * @param node
   * @constructor
   */
  const EditTreeNode = ({ node }) => {
    console.log(node);
    return (
      <Space style={{ marginLeft: 10 }}>
        <PlusCircleOutlined onClick={e => addDept(e, node)} />
        <EditOutlined onClick={e => editDept(e, node)} />
        {node.key === '01' ? null : (
          <DeleteOutlined onClick={e => deleteDept(e, node)} />
        )}
      </Space>
    );
  };

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map(item => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className={`${PREFIX}-tree-search-value`}>
                {searchValue}
              </span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key
        };
      });
    return loop(dept);
  }, [searchValue, dept]);

  /**处理机构拖动**/
  const onDragEnter: TreeProps['onDragEnter'] = info => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = info => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...dept];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setDept(data);
  };

  return (
    <Tree
      checkable
      draggable
      autoExpandParent={true}
      blockNode
      showLine={true}
      showIcon={false}
      defaultExpandedKeys={['01']}
      onSelect={onSelect}
      treeData={treeData}
      switcherIcon={({ expanded }: any) => {
        return !expanded ? (
          <PlusSquareOutlined style={{ fontSize: 18 }} />
        ) : (
          <MinusSquareOutlined style={{ fontSize: 18 }} />
        );
      }}
      titleRender={(nodeData: any) => {
        const dom = (
          <div>
            <span key={nodeData.key}>{nodeData.title}</span>
            {selectedKeys.includes(nodeData.key) ? (
              <EditTreeNode node={nodeData} />
            ) : null}
          </div>
        );
        return dom;
      }}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
    />
  );
};

export default DeptTree;
