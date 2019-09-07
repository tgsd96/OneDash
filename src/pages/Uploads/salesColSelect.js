import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import ColSelect from '@/components/ColSelect';

@connect(({ upload }) => ({
  details: upload.uploadDetails,
}))
class SColSelect extends Component {
  submitColumns = payload => {
    const { dispatch } = this.props;

    dispatch({
      type: 'upload/putKeysAndSave',
      payload,
    });
  };

  render() {
    const { details } = this.props;

    return (
      <Card>
        <h4>Select Columns for {details.file_name}</h4>
        <ColSelect
          handleSubmit={this.submitColumns}
          headers={details.keys}
          data={details.data}
          options={details.options}
        />
      </Card>
    );
  }
}

export default SColSelect;
