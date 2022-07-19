import { Button, Result } from 'antd';
const PageNodefound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在"
      extra={<Button type="primary">回到主页</Button>}
    />
  );
};
export default PageNodefound;
