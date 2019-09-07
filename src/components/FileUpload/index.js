import React, { Component } from 'react';
import { Col, Row, DatePicker, Radio, Upload, Button, Icon, Card } from 'antd';
import styles from './index.less';

export default class FileUpload extends Component {
  state = {
    file: null,
    selection: '',
    date: '',
  };

  submit = () => {
    const { handleSubmit } = this.props;
    handleSubmit(this.state);
  };

  render() {
    const { heading, options, processing } = this.props;
    const { file } = this.state;

    return (
      <Card className={styles.wrapper}>
        <Col span={24}>
          <Row style={{ marginBottom: 8 }}>
            <Col span={12}>
              <h3>{heading || 'Upload Sales'}</h3>
            </Col>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <Col span={24}>
              <Radio.Group onChange={e => this.setState({ selection: e.target.value })}>
                {options &&
                  options.map(opt => (
                    <Radio key={opt.val + opt.name} value={opt.val}>
                      {opt.name}
                    </Radio>
                  ))}
              </Radio.Group>
            </Col>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <h4>Upload CSV</h4>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <Upload
              beforeUpload={file => {
                this.setState({ file });
                return false;
              }}
            >
              <Button>
                <Icon type="upload" />
                Click to Upload
              </Button>
            </Upload>
          </Row>
          <Row type="flex" justify="end">
            <Button onClick={this.submit} loading={processing || false}>
              Next
              <Icon type="send" />
            </Button>
          </Row>
        </Col>
      </Card>
    );
  }
}
