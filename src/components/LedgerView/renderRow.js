import React, { Component } from 'react';
import moment from 'moment';
import styles from './renderRow.less';
import Link from 'umi/link';

export default class renderRow extends Component {
  state = {};

  render() {
    const { ledger, name, handleClick, selected } = this.props;
    // console.log("Logging the ledger", ledger)
    const key = ledger.ID || ledger.FID;
    let date;
    if (ledger.date) {
      date = new moment(ledger.date);
      date = date.format('LL');
    }
    let debit, credit;
    if (ledger.amount) {
      if (ledger.amount < 0) {
        debit = -ledger.amount;
      } else {
        credit = ledger.amount;
      }
    }
    return (
      <div
        key={key}
        style={selected ? { backgroundColor: '#bae7ff' } : null}
        onClick={() => handleClick(key)}
        className={styles.renderRow}
      >
        <div className={styles.renderCol}>{date}</div>
        <div className={styles.renderName}>
          <b>
            <Link to={`/master/details/${ledger.cust_id}`}>{name}</Link>
          </b>
        </div>
        <div className={styles.renderCol}>{ledger.comments}</div>
        <div className={styles.renderCol}>{ledger.type}</div>
        <div className={styles.renderCol}>{debit}</div>
        <div className={styles.creditCol}>{credit}</div>
      </div>
    );
  }
}
