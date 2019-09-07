import React, { Component } from 'react';
import { Card, Select, Button, Icon } from 'antd';
import styles from './index.less';

export default class ColSelect extends Component {
  state = {
    keyToHeader: {},
    headerToKey: {},
  };

  submit = () => {
    const { handleSubmit } = this.props;
    const { keyToHeader } = this.state;
    handleSubmit(keyToHeader);
  };

  renderData = () => {
    const { headers, data } = this.props;
    let dataLength = data[headers[0]].length;
    if (dataLength > 5) {
      dataLength = 5;
    }
    let rows = [];
    for (let i = 0; i < dataLength; i += 1) {
      rows.push(
        <tr>
          {headers.map(header => {
            return <td key={header + i}>{data[header][i]}</td>;
          })}
        </tr>
      );
    }
    return rows;
  };

  handleChange = async (key, header) => {
    const { keyToHeader, headerToKey } = this.state;

    const newKTH = { ...keyToHeader, [key]: header };
    const newHTK = { ...headerToKey, [header]: key };

    await this.setState({ keyToHeader: newKTH, headerToKey: newHTK });
    console.log(this.state);
  };

  render() {
    const { headers, options } = this.props;

    return (
      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>{this.renderData()}</tbody>
          <tfoot>
            <tr>
              {headers.map(header => {
                return (
                  <td key={header + 921}>
                    <Select
                      onChange={val => {
                        this.handleChange(val, header);
                      }}
                      style={{ width: 100 }}
                    >
                      {options.map(opt => (
                        <Select.Option key={opt} value={opt}>
                          {opt}
                        </Select.Option>
                      ))}
                    </Select>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
        <Button onClick={this.submit} style={{ marginTop: 8 }}>
          Next
          <Icon type="right" />
        </Button>
      </Card>
    );
  }
}
