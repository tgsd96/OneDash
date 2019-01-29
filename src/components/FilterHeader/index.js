import React, { Component } from 'react';
import NameSelect from '../NameSelect';
import { DatePicker, Button } from 'antd';
import styles from './index.less';

export default class FilterHeader extends Component {
  state = {
    master : {},
    start_date : "2018-04-01T00:00:00Z",
    end_date : "2019-03-31T00:00:00Z",
    clear: false
  }

  onNameChange = (master)=>{
    this.setState({ master });
    console.log(master);
  }

  clear = ()=>{
    this.setState((prevState)=>({ clear: !prevState.clear, master: {}}));
  }

  resetDates = ()=>{
    const end_date = "2019-03-31T00:00:00Z";
    const start_date = "2018-04-01T00:00:00Z";

    this.setState({ start_date, end_date });
  }

  handleDates = (date,dateString)=>{
    console.log(date,dateString);
    let start_date,end_date;
    if(date[0]&&date[1]){
      start_date = date[0].format()
      end_date = date[1].format()
      this.setState({ start_date, end_date });
    }else{
      this.resetDates();
    }
    
  }

  applyFilter = ()=>{
    const { filter } = this.props;
    const { master, start_date, end_date } = this.state;
    filter(master.cust_id, { start_date, end_date});
  }

  render() {
    const { names } = this.props;
    const { clear } = this.state;
    return (
      <div className={styles.renderRow}>
        <div className={styles.rCol}><NameSelect key={clear} onSelect={this.onNameChange} names={names} /></div>
        <div className={styles.rCol}><Button type="danger" onClick={this.clear}>Clear</Button></div>
        <div className={styles.rCol}><DatePicker.RangePicker onChange={this.handleDates} /></div>
        <div className={styles.rCol}><Button type="primary" onClick={this.applyFilter}>Apply</Button></div>
      </div>
    );
  }
}