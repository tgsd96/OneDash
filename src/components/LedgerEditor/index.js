import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Select, DatePicker, Input, Button, Icon} from 'antd';
import TextField from '@material-ui/core/TextField';
import NameSelect from '@/components/NameSelect';
import moment from 'moment';
import styles from './index.less';
import { connect } from 'dva';


class LedgerEditor extends Component {

  state = {
    ledger: {
    }
  }

  componentDidMount(){
    const { ledger } = this.props;
    if(ledger)
    this.setState({ ledger });
  }

  componentWillReceiveProps(props){

    const { ledger } = this.state;

    if(props.ledger){
      this.setState({ ledger: props.ledger })
    }
  }

  handleNameSelect=(master)=>{
    console.log("Master selected:",master);
    this.handleChanges('cust_id', master.cust_id);
  }

  handleChanges = (propName, val)=>{
    const { ledger } = this.state;
    const newLedger = { ...ledger, [propName]: val};
    this.setState({ ledger: newLedger});
    console.log("Setting ledger: ", newLedger);
  }

  handleSave = ()=>{
    const { ledger } = this.state;
    const { handleClose, onSave } = this.props;
    onSave(ledger);
    handleClose();
  } 

  deleteLedger = ()=>{
    console.log("Deleting ledger")
    const { deleteIt, handleClose } = this.props;
    const { ledger } = this.state;
    console.log(deleteIt);
    deleteIt(ledger);
    handleClose();
  }

  render() {
    const { ledger } = this.state;
    const { handleClose } = this.props;
    let debit, credit;
    if(ledger.amount){
      if(ledger.amount<0){
        debit = -ledger.amount
      }else{
        credit = ledger.amount
      }
    }

    return (
      <div style={{ backgroundColor:"#e8e8e8", padding: 8 }}>
        <Button onClick={handleClose} style={{position:'absolute', top:'4px', right:'4px'}} type="ghost"><Icon type="close" /></Button>
        <h3 className="buttonSpan">Edit Ledger</h3>
        <form className={styles.formStyle}>
          <Col span={24}>
            <Row style={{ marginBottom: 8 }}>
              <Col span={24}>
                <NameSelect master={ledger.cust_id} onSelect={this.handleNameSelect} />
              </Col>
            </Row>
            <Row style={{ marginBottom: 8 }}>
              <Col span={24}>
                <Input 
                  placeholder="Description"
                  value={ledger.comments}
                  onChange={(e)=>this.handleChanges('comments',e.target.value)}
                  style={{ backgroundColor: "#fff"}}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 8,}}>
              <Col span={12}>
                <Select 
                  placeholder="Type"
                  style={{ height: 60}}
                  onChange={(e)=>this.handleChanges('type',e)}
                  value={ledger.type}
                >
                  <Select.Option value="pay:cash">Payment Cash</Select.Option>
                  <Select.Option value="pay:chq">Payment Cheque</Select.Option>
                  <Select.Option value="MARG">Bill Marg</Select.Option>
                  <Select.Option value="COL">Bill Colgate</Select.Option>
                </Select>
              </Col>
              <Col span={12}>
                <DatePicker 
                  style={{width:"100%", height:"100%"}} 
                  defaultValue={moment(ledger.date)} 
                  onChange={(date,_)=>this.handleChanges('date',date && date.format())}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 8 }}>
              <Col span={12}>
                <Input 
                  value={debit}
                  onChange={(e)=>{this.handleChanges('amount',-parseInt(e.target.value))}}
                  placeholder="Debit"
                />
              </Col>
              <Col span={12}>
                <Input 
                  value={credit}
                  onChange={(e)=>{this.handleChanges('amount',parseInt(e.target.value))}}
                  placeholder="Credit"
                />
              </Col>
            </Row>
            <Row>
              <Col span={16} />
              <Col span={8}>
                <Row>
                  <Button style={{float: "left"}} type="ghost" onClick={()=>{this.deleteLedger()}}><Icon type="delete" /></Button>
                  <Button style={{float: "right"}} onClick={this.handleSave} type="primary">Save</Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </form>
      </div>
      
    );
  }
}

LedgerEditor.propTypes = {
  ledger : PropTypes.object,
  onSave: PropTypes.func.isRequired,  
}

LedgerEditor.defaultProps = {
  ledger: {}
}

export default LedgerEditor;