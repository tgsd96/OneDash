import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';
import Result from '@/components/Result';

@connect(({ upload }) => ({
  success: upload.successCount,
  failed: upload.failedCount,
}))
class SResult extends Component {
  render() {
    const { success, failed } = this.props;
    return (
      <Card>
        <Row>
          <Col span={12}>
            <Result type="success" title={`${success} entries added`} />
          </Col>
          <Col span={12}>
            <Result type="error" title={`${failed} entries failed`} />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default SResult;
