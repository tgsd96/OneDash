import React, { Component } from 'react';
import { Card, Input, DatePicker, Select, Button, Icon, Modal } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import uuid from 'uuid/v4';
import PhysicalList from '../PhysicalList';
import styles from  './index.less';



export default class LedgerTable extends Component {

    state ={
      ledgers:{},
      selectedCSS : {
        backgroundColor:"#e6f7ff",
      },
      enableNav : true,
      updated:false,
    }

    componentWillMount(){
      const { ledgers } = this.props;
      this.setState({ ledgers })
    }

    handleChanges= (ID,propName, val)=>{
      this.setState({ updated: true });
      const { ledgers } = this.state;
      const ledgerInFocus = ledgers[ID];
      // update ledger in focus
      const update = {...ledgerInFocus, [propName]: val}
      const updatedLedger = {...ledgers, [ID]: update}
      this.setState({ ledgers : updatedLedger})
    }

    enableEditing = (cursor)=>{
      const editingCss = {
        backgroundColor: '#ffccc7'
      }
      this.setState({ enableNav: false, selectedCSS: editingCss});
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.ledgers !== this.state.ledgers){
        this.setState({ ledgers: nextProps.ledgers});
      }
    }

    handeEscape = ()=>{
      const { enableNav } = this.state;
      if(!enableNav){

        const selectedCSS = {
          backgroundColor:"#e6f7ff",
        }
        this.setState({ enableNav: true, selectedCSS})
      }else
      {router.goBack()}
  }

    handleNewLedger=()=>{
      this.setState({ updated: true});
      const newID = uuid()
      const { ledgers } = this.state;
      const ledgerAll = ledgers.all;
      const { custID } = this.props;

      const updatedLedger ={
        ...ledgers,
        [newID]:{ FID: newID, cust_id: custID},
        all: [ newID, ...ledgerAll ]
      }
      this.setState({ ledgers: updatedLedger });
    }

    handleSave = ()=>{
      const { handleSave } = this.props;
      const { ledgers } = this.state;
      handleSave(ledgers);
      this.setState({ updated : false })
    }

    handleNew = (cursor, keyCode)=>{
      if(keyCode.ctrlKey)
        this.handleNewLedger()
    }

    handleCancel = ()=>{
      this.handeEscape()
    }

    renderRow = (item, selected, _)=>{
      if(item){
        let debit, credit;
        if(item.amount)
        if(item.amount<0){
          debit = -item.amount
        }else{
          credit = item.amount
        }
        let date;
        console.log(item);
        if(item.date)
        date = moment(item.date);
        const { selectedCSS, enableNav } = this.state;
        const hackID = item.ID || item.FID;
        return (
          <tr
            key={item.name+item.ID+item.FID} 
            style={selected?selectedCSS:{height: 20}}
            valign="middle"
            className={selected?styles.selectedAnt:null}
          >
            <td><DatePicker onChange={(cdate,_)=>{this.handleChanges(hackID,'date',cdate.format())}} disabled={!selected || enableNav} defaultValue={date || new moment()} /></td>
            <td><Input disabled={!selected || enableNav} value={item.name} />
            </td>
            <td><Input onChange={(e)=>this.handleChanges(hackID,'comments',e.target.value)} disabled={!selected || enableNav} value={item.comments} /></td>
            <td>
              <Select 
                style={{width:"200px"}} 
                defaultValue={item.type}
                placeholder="Type"
                disabled={!selected || enableNav}
                onChange={(e)=>this.handleChanges(hackID,'type',e)}
              >
                <Select.Option value="pay:cash">Payment Cash</Select.Option>
                <Select.Option value="pay:chq">Payment Cheque</Select.Option>
                <Select.Option value="MARG">Bill Marg</Select.Option>
                <Select.Option value="COL">Bill Colgate</Select.Option>
              </Select>
            </td>
            <td><Input disabled={!selected || enableNav } onChange={(e)=>this.handleChanges(hackID,'amount',-parseInt(e.target.value))} value={debit} /></td>
            <td><Input disabled={!selected || enableNav} value={credit} onChange={(e)=>this.handleChanges(hackID,'amount',parseInt(e.target.value))} /></td>
          </tr>
        )
      }
    }


    render() {
        const { ledgers, enableNav, updated } = this.state;
        const COLUMNS = [
            "Date",
            "Name",
            "Comments",
            "Type",
            "DEBIT",
            "CREDIT"
        ] 
        return (
          <Card style={{ marginTop: 8}}>
            <span style={{display: 'inline', padding:8}}>
              <Button onClick={this.handleNewLedger} style={{ marginRight: 8 }} type="primary">
                <Icon type="plus" />
              </Button>
              <Button disabled={!updated} onClick={this.handleSave} style={{ marginRight: 8 }} type="ghost">Save</Button>
              <Button onClick={this.handleCancel} type="danger">Cancel</Button>
            </span>
            <div style={{ marginTop : 8 }}>
            <PhysicalList
              rowHeight={20}
              numberOfRows={15}
              maxHeight={500}
              columns={COLUMNS}
              renderItem={this.renderRow}
              dataSource={ledgers}
              handleEscape={this.handeEscape}
              handleEnter={this.enableEditing}
              enableNav={enableNav}
              handleMisc={[
                {
                  keyCode : 78,
                  handler: this.handleNew 
                }
              ]}
            />
            </div>
          </Card>
        );
    }
}