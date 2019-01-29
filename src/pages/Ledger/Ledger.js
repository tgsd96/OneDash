import React, { Component } from 'react';
import {
  DatePicker,
  Button,
  Card,
} from 'antd';
import { connect } from 'dva';
import uuid from 'uuid/v4';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LedgerLine from '@/components/LedgerLine';
import styles from './Ledger.less';
import moment from 'moment';


const initialState = {
  ledgers : {
    1 : {
    },
    all :[1]
  },
  generator: 2,
}

const initializeState = ()=>{
  const initId = uuid();
  return {
    ledgers : {
      [initId]: {
        cust_id: 0
      },
      all: [initId]
    },
    generator: 2,
    date: new moment(),
  }
}
@connect(({ master, ledger})=>({
  allMasters: master.normalized,
  selectedLedger : ledger.selectedLedger,
}))
class Ledger extends Component {
  
  state = initializeState();

   addLine = ()=>{
    const { ledgers, generator } = this.state;
    let newAll = ledgers.all;
    newAll.push(generator)
    const updateLedgers = { ...ledgers, [generator]:{}, all: newAll};
    this.setState({
      ledgers: updateLedgers,
      generator: generator+1 
    });
  }

  resetState = ()=>{
    this.setState(initializeState());
  }

  postLedger = ()=> {
    // change state to server parsable
    const { ledgers, date } = this.state;
    const { dispatch } = this.props;
    let ledgerArray = [];
    ledgers.all.forEach((id)=>{
      let selLedger = ledgers[id];
      selLedger['date']= date.format();
      ledgerArray.push(selLedger);
    })
    console.log("Submit Ledgers: ",ledgerArray);
    // console.log(initialState);
    dispatch({
      type: 'ledger/postNewLedgers',
      payload : ledgerArray 
    })
    dispatch({
      type: 'master/fetchList'
    })
    this.resetState();
  }

   handlePropChange = (id, propName, val)=>{

    // console.log('id:',id)
    // console.log('propName:',propName)
    // console.log('val:',val)

     const { ledgers } = this.state;
     const ledgerInFocus = ledgers[id];
     let updateLedger;

     if(propName==="debit"){
      updateLedger = {
        ...ledgerInFocus,
        amount: -parseInt(val)
      }
     }else if(propName==="credit"){
      updateLedger = {
        ...ledgerInFocus,
        amount: parseInt(val)
      }
     }else
      updateLedger =  {
       ...ledgerInFocus,
       [propName] : val
     };

     const newLedgers = { ...ledgers, [id]: updateLedger};

    //  console.log(" New ledger", newLedgers);

     this.setState( { ledgers: newLedgers });

    //  console.log("Property Updated", this.state.ledgers);
   }


  handleDateChange = (date,dateString)=>{
    console.log(date.format());
    this.setState({ date });
  }

  render() {
    const selectedCSS = {
      backgroundColor:"#e6f7ff"
    }
  
    const { allMasters, selectedLedger} = this.props;
    const { ledgers, date } = this.state;

    // console.log("Showing selected",selectedLedger);

    let debitSum=0, creditSum=0;
    ledgers.all.forEach((id)=>{
      const selLedger = ledgers[id];
      if(selLedger.amount){
        if(selLedger.amount<0)
          debitSum -= selLedger.amount
        else
          creditSum += selLedger.amount
      }
    });


    
    return (
      <PageHeaderWrapper title="Ledger">
        <Card bordered={false} tabIndex="0">
          <DatePicker 
            style={{ marginBottom: 8}}
            onChange={this.handleDateChange}
            defaultValue={date} 
          />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Account</th>
                <th>Balance</th>
                <th>Type</th>
                <th>Comments</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              {
                ledgers.all.map((id)=>
                {
                  const selLedger = ledgers[id];
                  // console.log("Checking ledger", selLedger);
                  if(selLedger)
                  return(
                    <LedgerLine 
                      ledger={selLedger}
                      id={id} 
                      key={id} 
                      names={allMasters}
                      handlePropChange={this.handlePropChange}
                    />)
                })
              }
            </tbody>
            <tfoot>
              <tr>
                <th id="total" colSpan="4">Total :</th>
                <td>{debitSum}</td>
                <td>{creditSum}</td>
              </tr>
            </tfoot> 
          </table>
          <Button onClick={this.addLine} style={{ marginTop: 8 }}>Add a line</Button>
          <Button onClick={async()=>{await this.postLedger()}} style={{ marginTop: 8, marginLeft: 8 }}>Save</Button>
        </Card>
      </PageHeaderWrapper>
      );
    }
  }
  
  export default Ledger;