import React, { Component } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default ({ Item, selected, handleClick }) => {
  return (
    <Card
      className={styles.wrapper}
      onClick={() => handleClick(Item.ID)}
      style={selected ? { backgroundColor: '#69c0ff' } : null}
      key={Item.ID}
    >
      <h3>{Item.name}</h3>
      <p>
        {Item.i_code} | Rs.{Item.amount} | {moment(Item.date).format('LL')}{' '}
      </p>
    </Card>
  );
};
