import { toSelectTree } from '@/utils/menu';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTreeSelect
} from '@bicitech-design/pro-components';
import { Button, message } from 'antd';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

const waitTime = (time: number = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const COMPONENTS: any = {};
PAGE_PATHS.map((item: any) => {
  COMPONENTS[item] = item;
});

const MenuEditModal = (props: any) => {
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="新建菜单"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建菜单
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        onCancel: () => console.log('run')
      }}
      layout="horizontal"
      submitTimeout={2000}
      onFinish={async values => {
        await waitTime(2000);
        console.log(values);
        message.success('提交成功');
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormTreeSelect
          name="parentId"
          label="上级菜单"
          placeholder="选择上级菜单"
          allowClear
          width="md"
          secondary
          request={async () => {
            return toSelectTree(toJS(props.user.authorities), 0);
          }}
          // tree-select args
          fieldProps={{
            showArrow: false,
            filterTreeNode: true,
            showSearch: true,
            dropdownMatchSelectWidth: false,
            labelInValue: true,
            autoClearSearchValue: true,
            multiple: false,
            treeNodeFilterProp: 'title',
            fieldNames: {
              label: 'title'
            }
          }}
        />

        <ProFormRadio.Group
          name="menuType"
          label="菜单类型"
          width="sm"
          options={[
            {
              label: '菜单',
              value: 0
            },
            {
              label: '按钮',
              value: 1
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="title"
          label="菜单名称"
          placeholder="请输入名称"
        />
        <ProFormRadio.Group
          name="target"
          label="打开方式"
          width="sm"
          options={[
            {
              label: '组件',
              value: '_self'
            },
            {
              label: '内链',
              value: 1
            },
            {
              label: '外链',
              value: 2
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="icon"
          label="菜单图标"
          placeholder="请输入图标"
        />
        <ProFormText
          width="sm"
          name="authority"
          label="权限标识"
          placeholder="sys:user:update"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="path"
          label="路由地址"
          placeholder="请输入路由"
        />
        <ProFormDigit
          width="sm"
          name="sortNumber"
          label="排序号"
          placeholder="请输入排序号"
          min={1}
          max={10}
          fieldProps={{ precision: 0 }}
        />
      </ProForm.Group>
      <ProForm.Group style={{ flex: 1 }}>
        <ProFormSelect
          width="md"
          name="component"
          label="组件路径"
          tooltip="最长为 24 位"
          placeholder="请输入组件路径"
          showSearch
          valueEnum={COMPONENTS}
        />
        <ProFormSwitch width="sm" name="hide" label="是否展示" />
      </ProForm.Group>
    </ModalForm>
  );
};
export default inject('user')(observer(MenuEditModal));
