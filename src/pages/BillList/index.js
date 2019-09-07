import React, { Component } from 'react';
import { Card, Row, Col, Input, Select, Switch, DatePicker, Modal } from 'antd';
import { connect } from 'dva';
import ListRow from '@/components/ListRow';
import LedgerBox from '@/components/LedgerBox';
import LedgerEditor from '@/components/LedgerEditor';

const Beats = [
  {
    name: 'All',
    value: 'all',
  },

  {
    name: 'Monday',
    value: 'MON',
  },
  {
    name: 'Tuesday',
    value: 'TUE',
  },
  {
    name: 'Wednesday',
    value: 'WED',
  },
  {
    name: 'Thursday',
    value: 'THU',
  },
  {
    name: 'Friday',
    value: 'FRI',
  },
  {
    name: 'Saturday',
    value: 'SAT',
  },
  {
    name: 'Sunday',
    value: 'SUN',
  },
];

@connect(({ billList }) => ({
  data: billList.billList,
  list: billList.minBillList,
  selected: billList.selected,
  ledger: billList.ledgers,
  selLedger: billList.selectedLedger,
  modalVisible: billList.modalVisible,
  newLedger: billList.newLedger,
}))
class BillList extends Component {
  state = {
    ledger: [
      {
        amount: 100,
        date: '2019-02-07 21:46:06.835506+05:30',
        type: 'MARG',
      },
      {
        amount: -100,
        date: '2019-02-07 21:46:06.835506+05:30',
        type: 'CASH',
      },
    ],
    old: 0,
    total: 0,
    newV: 0,
    selectedID: 0,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'billList/fetchBillList',
    });
    dispatch({
      type: 'billList/fetchMinList',
    });
  }

  handleClick = cust_id => {
    const { dispatch } = this.props;
    this.setState({ selectedID: cust_id });
    dispatch({
      type: 'billList/fetchLedgers',
      cust_id,
    });
  };

  handleZero = checked => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billList/updateZeroFilter',
      value: checked,
    });
  };

  handleLedgerClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billList/hideDialog',
    });
  };

  handleSearch = e => {
    console.log('Handle Search', e.target.value);
    const name = e.target.value;
    const { dispatch } = this.props;
    dispatch({ type: 'billList/updateNameFilter', name: name });
  };

  handleRouteChange = val => {
    console.log('Handle Route', val);
    const { dispatch } = this.props;
    dispatch({ type: 'billList/updateRouteFilter', route: val });
  };

  handleDateChange = date => {
    const newDate = date.format('YYYY-MM-DD');
    const { dispatch } = this.props;
    dispatch({
      type: 'billList/fetchMinList',
      date: newDate,
    });
  };

  closeModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billList/closeModal',
    });
  };
  createNew = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billList/createNewLedger',
    });
  };

  updateLedger = ledger => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billList/updateLedger',
      ledger,
    });
  };

  render() {
    const {
      data,
      list,
      selected,
      ledger,
      selLedger,
      dispatch,
      modalVisible,
      newLedger,
    } = this.props;
    console.log(this.props);
    const { selectedID } = this.state;
    console.log('Ledgers are here', ledger);
    return (
      <Card style={{ width: '100%' }}>
        <Modal style={{ overflow: 'none' }} closable={false} visible={modalVisible} footer={null}>
          <LedgerEditor
            onSave={this.updateLedger}
            ledger={newLedger}
            handleClose={this.closeModal}
          />
        </Modal>
        <Row>
          <DatePicker onChange={this.handleDateChange} style={{ marginBottom: 10 }} />
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={12}>
            <Input onChange={this.handleSearch} placeholder="Search" />
          </Col>
          <Col span={3}>
            <Select
              onChange={this.handleRouteChange}
              defaultValue={'all'}
              style={{ width: 100, marginLeft: 10 }}
            >
              {Beats.map(beat => (
                <Select.Option key={beat.name} value={beat.value}>
                  {beat.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            hide 0 Balances
            <Switch onChange={this.handleZero} />
          </Col>
        </Row>
        <Row style={{ width: '100%', border: '2px solid #fef', borderRadius: 4 }}>
          <Col span={selected ? 18 : 24} style={{ overflowX: 'scroll' }}>
            <div
              style={{
                height: 60,
                fontWeight: 'bold',
                width: '100%',
                backgroundColor: '#D8DCDB',
                padding: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
              }}
            >
              <div style={{ flex: '0 0 300px' }}>Checked</div>
              <div style={{ flex: '0 0 300px' }}>Name</div>
              <div style={{ flex: '0 0 100px' }}>Area</div>
              <div style={{ flex: '0 0 100px' }}>New</div>
              <div style={{ flex: '0 0 100px' }}>Old</div>
              <div style={{ flex: '0 0 100px' }}>Total</div>
            </div>
            <div style={{ height: 400, overflowY: 'scroll', overflowX: 'hidden' }}>
              {list.all.map(id => {
                return (
                  <div
                    style={id == selectedID ? { backgroundColor: '#bae7ff' } : {}}
                    onClick={() => this.handleClick(id)}
                  >
                    <ListRow item={list[id]} />
                  </div>
                );
              })}
            </div>
          </Col>
          {selected ? (
            <Col span={6}>
              <LedgerBox
                createNew={this.createNew}
                close={this.handleLedgerClose}
                ledgers={ledger}
                ledger={selLedger}
              />
            </Col>
          ) : null}
        </Row>
      </Card>
    );
  }
}
export default BillList;
