import React, { Component } from 'react';
import styles from './index.less';
import { Card } from 'antd';
export default class ListRow extends Component {
  render() {
    const { item } = this.props;
    return (
      <div key={item.cust_id} className={styles.rowWrapper}>
        <div>
          <input type="checkbox" />
        </div>
        <div style={{ flex: '0 0 300px' }}>{item.name}</div>
        <div>{item.area}</div>
        <div>{item.new}</div>
        <div>{item.old}</div>
        <div>{item.total}</div>
      </div>
    );
  }
}
