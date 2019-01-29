import React, { Component } from 'react';
import { Card, Col, Row, Button, Icon} from 'antd';
import moment from 'moment';
import LedgerEditor from '../LedgerEditor';
import RenderRow from './renderRow';
import styles from './index.less';
import FilterHeader from '../FilterHeader';
import cstyles from './renderRow.less';


export default class LedgerView extends Component {

  state = {
    showDialog: false,
    span: 24,
    ledger: null,
    selectedID: null
  }

  toggleDialog =()=>{
    const { showDialog } = this.state;
    let span;
    if(showDialog){
       span = 24;
    }else{
      span = 16;
    }
    this.setState({ span, showDialog: !showDialog});
  }

  createNewLedger = async()=>{
    const { onNew } = this.props;
    await onNew();
    const { ledgerToMap } = this.props;
    const ID = ledgerToMap.all[0];
    this.selectLedgerForEditing(ID);
  }

  selectLedgerForEditing = (id)=>{
    const { ledgerToMap } = this.props;
    const { showDialog } = this.state;
    const ledger = ledgerToMap[id]
    // console.clear()
    console.log("Selected Ledger: :D", ledger)
    this.setState({ ledger, selectedID: id })
    if(!showDialog)
      this.toggleDialog();
  }

  render() {
    const { span, showDialog, ledger, selectedID } = this.state;
    const { ledgerToMap, masters, saveLedger, filter, onDelete } = this.props;
    // console.log(ledgerToMap);

    return (
      <Card bordered={false}>
        <Col span={24}>
          <Button shape="circle" onClick={this.createNewLedger}><Icon type="plus-circle" /></Button>
          <FilterHeader filter={filter} names={masters} />
          <Row style={{ border: "1px solid #D8DCDB", borderRadius: 4}}>
            <Col span={span}>
              <div style={{ backgroundColor: 'white'}}>
              <div style={{height: 60, width: '100%', backgroundColor:"#D8DCDB", padding: 8, display:"flex",flexDirection: "row", justifyContent:"space-between", alignContent:"center"}}>
                <div className={cstyles.renderCol}>Date</div>
                <div className={cstyles.renderName}>Name</div>
                <div className={cstyles.renderCol}>Desc</div>
                <div className={cstyles.renderCol}>Type</div>
                <div className={cstyles.renderCol}>Debit</div>
                <div className={cstyles.renderCol}>Credit</div>
              </div>  
              <div style={{ height: 400, overflowY: 'scroll'}}>
                {ledgerToMap.all.map((id)=>{
                    const cledger = ledgerToMap[id]
                    return <RenderRow key={id} selected={id===selectedID} ledger={cledger} handleClick={this.selectLedgerForEditing} name={masters[cledger.cust_id] && masters[cledger.cust_id].name} />
                  })}
              </div>
              </div>
            </Col>
            { showDialog&&
              <Col span={24-span} style={{ backgroundColor:"#e8e8e8", padding: 8, borderLeft: "1px solid #D8DCDB", height:"500px" }}>
                {<LedgerEditor deleteIt={onDelete} onSave={saveLedger} ledger={ledger} handleClose={this.toggleDialog} />}
              </Col>
            }
          </Row>
        </Col>
      </Card>
    );
  }
}