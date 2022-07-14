import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText
} from '@bicitech-design/pro-components';
import { Col, message, Row, Space } from 'antd';
import { useState } from 'react';

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';

const waitTime = (time: number = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default ({ trigger }) => {
  const [formLayoutType, setFormLayoutType] = useState<LayoutType>(
    LAYOUT_TYPE_HORIZONTAL
  );

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      : null;

  return (
    <DrawerForm<{
      name: string;
      company?: string;
      useMode?: string;
    }>
      {...formItemLayout}
      layout={formLayoutType}
      trigger={trigger}
      width={500}
      submitter={{
        render: (props, doms) => {
          return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
            <Row>
              <Col span={14} offset={4}>
                <Space>{doms}</Space>
              </Col>
            </Row>
          ) : (
            doms
          );
        }
      }}
      onFinish={async values => {
        await waitTime(2000);
        console.log(values);
        message.success('提交成功');
      }}
      params={{}}
      request={async () => {
        await waitTime(100);
        return {
          name: '蚂蚁设计有限公司',
          useMode: 'chapter'
        };
      }}
    >
      <ProFormRadio.Group
        style={{
          margin: 16
        }}
        label="标签布局"
        radioType="button"
        fieldProps={{
          value: formLayoutType,
          onChange: e => setFormLayoutType(e.target.value)
        }}
        options={['horizontal', 'vertical', 'inline']}
      />
      <ProFormText
        width="md"
        name="account"
        label="用户账号"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      <ProFormText
        width="md"
        name="workerNumber"
        label="员工编号"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      <ProFormText
        width="md"
        name="name"
        label="姓名"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      <ProFormText
        width="md"
        name="sex"
        label="性别"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      <ProFormText
        width="md"
        name="deptName"
        label="所属部门"
        placeholder="请输入名称"
      />
      <ProFormSelect
        width="md"
        mode="multiple"
        label="角色信息"
        name="roleName"
        valueEnum={{
          1: 'front end',
          2: 'back end',
          3: 'full stack'
        }}
      />
      <ProFormDigit
        width="md"
        name="phone"
        label="手机号"
        placeholder="请输入名称"
      />
      <ProFormText
        width="md"
        name="email"
        label="邮箱"
        placeholder="请输入名称"
      />
      <ProFormText
        width="md"
        name="jobInfo"
        label="岗位信息"
        placeholder="请输入名称"
      />
      <ProFormText
        name={['contract', 'name']}
        width="md"
        label="合同名称"
        placeholder="请输入名称"
      />
    </DrawerForm>
  );
};
