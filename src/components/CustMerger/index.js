import React, { Component } from 'react';
import { Card, Radio, Button, Row, Select } from 'antd';
import NameSelect from '../NameSelect';

export default class extends Component {
  state = {
    status: 'No Action Taken',
    custID: 0,
    option: '',
  };

  onAccountSelect = master => {
    this.setState({
      status: 'Account to be merged with ' + master.name + ' ' + master.cust_id,
      custID: master.cust_id,
    });
  };

  handleNew = () => {
    this.setState({ status: 'New customer ID will be assigned', custID: -1 });
  };

  handleCancel = () => {
    this.setState({ status: 'The entry will be ignored', custID: 0 });
  };

  render() {
    const { Account, names, onSave } = this.props;
    const { status, custID, option } = this.state;
    return (
      <Card>
        <h2>{Account.name}</h2>
        {custID != -1 ? <NameSelect names={names} onSelect={this.onAccountSelect} /> : null}
        <p style={{ marginTop: 5 }}>Status: {status}</p>
        <Row>
          {custID == -1 ? (
            <Select
              style={{ width: '100%' }}
              onChange={e => {
                this.setState({ option: e });
              }}
              placeholder="Select Route"
            >
              <Select.Option value={'MON'}>Monday</Select.Option>
              <Select.Option value={'TUE'}>Tuesday</Select.Option>
              <Select.Option value={'WED'}>Wednesday</Select.Option>
              <Select.Option value={'THU'}>Thursday</Select.Option>
              <Select.Option value={'FRI'}>Friday</Select.Option>
              <Select.Option value={'SAT'}>Saturday</Select.Option>
              <Select.Option value={'SUN'}>Sunday</Select.Option>
            </Select>
          ) : null}
        </Row>
        <Row style={{ marginTop: 5 }}>
          <Button type="primary" onClick={this.handleNew}>
            Create New
          </Button>
          <Button type="danger" style={{ marginLeft: 5 }} onClick={this.handleCancel}>
            Ignore
          </Button>
        </Row>
        <Row>
          <Button
            onClick={() => {
              onSave(Account.name, custID, option);
            }}
            style={{ backgroundColor: '#95de64', width: '100%', marginTop: 5 }}
          >
            Save
          </Button>
        </Row>
      </Card>
    );
  }
}
