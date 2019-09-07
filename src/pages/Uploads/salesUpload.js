import React, { Component } from 'react';
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import ColSelect from '@/components/ColSelect';

const Fake_options = [
  {
    name: 'Colgate',
    val: 'col',
  },
  {
    name: 'Marg',
    val: 'marg',
  },
];

const Fake_Data = {
  PARTY: ['Tushar'],
  'BILL VALUE': [1232],
  'BILL DATE': ['20180910'],
  BEAT: ['Dadri'],
};

@connect()
class salesUpload extends Component {
  uploadFile = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'upload/uploadSales',
      payload,
    });
  };

  render() {
    return (
      <div>
        <FileUpload
          handleSubmit={this.uploadFile}
          heading="Give us your sales"
          options={Fake_options}
        />
      </div>
    );
  }
}

export default salesUpload;
