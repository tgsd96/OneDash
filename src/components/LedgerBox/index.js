import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import LedgerRow from './ledgerRow';
import Link from 'umi/link';

export default class LedgerBox extends Component {
  render() {
    const { ledgers, ledger, close, createNew } = this.props;

    return (
      <div>
        <Col style={{ borderLeft: '1px solid #535559' }}>
          <Row style={{ padding: 8, height: 60, backgroundColor: '#D8DCDB' }}>
            <Col span={16} style={{ overflow: 'hidden', width: 150, height: 40 }}>
              {ledger.name}
            </Col>
            <Col span={4} style={{ float: 'right', marginRight: 4 }}>
              <Button type={'danger'} onClick={close}>
                <Icon type="close" />
              </Button>
            </Col>
          </Row>
          <Row style={{ overflowY: 'scroll', height: '350px' }}>
            {Array.isArray(ledgers) &&
              ledgers.map(ledger => (
                <Row>
                  <LedgerRow ledger={ledger} />
                </Row>
              ))}
          </Row>
          <Row style={{ borderTop: '1px solid #535559', height: 50, padding: 5 }}>
            <Link to={`/master/details/${ledger.cust_id}`}>Expand</Link>
            <Button onClick={createNew} style={{ marginLeft: 10 }}>
              Add
            </Button>
          </Row>
        </Col>
      </div>
    );
  }
}
