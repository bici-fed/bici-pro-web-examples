import { Card, Col, Row } from 'antd';

import { BICI_ADMIN_PREFIX } from '@/constant';
import './index.less';

const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' };

const WorkbenchPage = () => {
  return (
    <div className={`${BICI_ADMIN_PREFIX}-workbench`}>
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 }
        ]}
      >
        <Col className="gutter-row" xs={12} md={8} lg={6}>
          <Card title="Card title" bordered={false}>
            Card content
          </Card>
        </Col>
        <Col className="gutter-row" xs={12} md={8} lg={6}>
          <Card title="Card title" bordered={false}>
            Card content
          </Card>
        </Col>
        <Col className="gutter-row" xs={12} md={8} lg={6}>
          <Card title="Card title" bordered={false}>
            Card content
          </Card>
        </Col>
        <Col className="gutter-row" xs={12} md={8} lg={6}>
          <Card title="Card title" bordered={false}>
            Card content
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default WorkbenchPage;
