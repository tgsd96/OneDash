import React, { Component } from 'react';
import moment from 'moment';

export default class LedgerRow extends Component {
  render() {
    const { ledger } = this.props;

    let borderColor = '#33ddc9';

    if (ledger.amount < 0) {
      borderColor = '#dd324f';
    }
    return (
      <div style={{ padding: 8, border: `2px solid ${borderColor}`, margin: 5, borderRadius: 4 }}>
        <span>{ledger.type}</span>
        <span style={{ float: 'right', color: `${borderColor}` }}>{ledger.amount}</span>
        <p> {moment(ledger.date).format('LL')} </p>
      </div>
    );
  }
}
