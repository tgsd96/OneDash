import React, { Component } from 'react';
import { connect } from 'dva';
import OutItem from '@/components/OutItem';
import { Row, Col } from 'antd';
import CustMerger from '@/components/CustMerger';

@connect(({ outstanding, master }) => ({
  outMap: outstanding.data,
  names: master.normalized,
}))
class Outstanding extends Component {
  state = {
    selected: null,
    account: null,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'outstanding/fetchErrors',
    });
  }

  selectRecord = ID => {
    const { outMap } = this.props;
    this.setState({ selected: ID, account: outMap[ID] });
  };

  saveError = (name, cust_id, option) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'outstanding/postErrors',
      payload: { name, cust_id, option },
    });
    this.setState({ selected: null });
  };

  render() {
    const { outMap, names } = this.props;
    const { selected, account } = this.state;
    console.log('GOT DATA:', outMap);
    return (
      <Row gutter={8}>
        <Col span={12} style={{ height: 500, overflowY: 'auto' }}>
          {outMap.all &&
            outMap.all.map(errID => {
              return (
                <OutItem
                  handleClick={this.selectRecord}
                  Item={outMap[errID]}
                  selected={selected === errID}
                />
              );
            })}
        </Col>
        <Col span={12}>
          {selected && (
            <CustMerger onSave={this.saveError} key={account.ID} Account={account} names={names} />
          )}
        </Col>
      </Row>
    );
  }
}

export default Outstanding;
