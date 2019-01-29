import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import Ledger from './Ledger';
import LedgerView from '@/components/LedgerView';


const defaultDate = {
  start_date : "2018-01-23T00:00:00Z",
  end_date : "2019-01-31T00:00:00Z"
}

@connect(({ master ,ledger })=>({
  ledgers: ledger.ledgers,
  master: master.normalized
}))
class AllLedger extends Component {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'ledger/fetchLedgers',
      payload : {
        start_date : "2018-01-23T00:00:00Z",
        end_date : "2019-01-31T00:00:00Z"
      }
    })
  }

  filterBasedOnDate=(dates = defaultDate, cust_id)=>{
    const { dispatch } = this.props;
    console.log("Filtering cust_id",cust_id)
    if(dates.start_date && dates.end_date)
    {
        dispatch({
        type:'ledger/fetchLedgers',
        payload: {...dates, cust_id: cust_id}
      });
    }else{
      dispatch({
        type:'ledger/fetchLedgers',
        payload : {
          start_date : "2018-01-23T00:00:00Z",
          end_date : "2019-01-31T00:00:00Z"
        }
      })
    }
   
  }

  createNewLedger = async()=>{
    const { dispatch } = this.props;
    await dispatch({
      type:'ledger/createLedger'
    });
  }

  deleteLedger = (ledger)=>{
    console.log("GOT THE DELETE PACKAGE", ledger)
    const { dispatch } = this.props;
    dispatch({
      type: 'ledger/deleteLedger',
      payload: ledger
    })
  }

  filterDown = (cust_id, dates )=>{
    this.filterBasedOnDate(dates,cust_id);
  }

  saveLedger = (ledger)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'ledger/updateLedger',
      ledger
    })
  }
  
  render() {
    const { ledgers, master } = this.props;
    // console.clear();
    // console.log(ledgers);
    return (
        ledgers && <LedgerView onDelete={this.deleteLedger} onNew={this.createNewLedger} filter={this.filterDown} saveLedger={this.saveLedger} ledgerToMap={ledgers} masters={master} />
    );
  }
}

export default AllLedger;