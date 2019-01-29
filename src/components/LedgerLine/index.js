import React, { Component } from 'react';
import { Input, Select, Modal } from 'antd';
import NameList from '@/components/NameList';


export default class LegderLine extends Component {
  state = {
    showNameList: false,
    selectedMaster: {
      name: ""
    },
  }

  componentWillMount(){
    const { names, ledger } = this.props; 
     if(ledger.cust_id){
       this.setState({selectedMaster: names[ledger.cust_id] });
     }
  }

  componentDidMount(){
    this.resetFocus();
  }  



  handlePropChange = (propName, val) =>{
    const { id, handlePropChange } = this.props;
    handlePropChange(id, propName, val);
  }

  resetFocus = ()=>{
    this.refs.nameSelect.focus();
  }
  
  toggleList = async ()=>{
    const { showNameList } = this.state;
    await this.setState({ showNameList: !showNameList });
    if(showNameList){
      this.resetFocus();
    }
  }

  selectMaster = (cursor)=>{
    const { names } = this.props;
    const custID = names.all[cursor];
    const selectedMaster = names[custID];
    this.setState({ selectedMaster });
    // console.log(selectedMaster);
    this.handlePropChange('cust_id',selectedMaster.cust_id);
    this.toggleList();
  }

  render() {
    
    const { showNameList,  selectedMaster } = this.state;
    const { names, ledger } = this.props;

    let debit,credit;
    if(ledger.amount){
      if(ledger.amount<0) debit = -ledger.amount
      else{
        credit = ledger.amount
      }
    }
    console.log(debit,credit);

    // console.log(selectedMaster);

    return (
      <tr>
        <td>
          <Input 
            placeholder="Account" 
            onPressEnter={this.toggleList}
            value={selectedMaster.name}
            ref="nameSelect" 
            onChange={()=>this.handlePropChange('cust_id',selectedMaster.cust_id)}
          />
          <Modal
            title="Choose an account"
            visible={showNameList} 
            onCancel={this.toggleList}
            footer={null}
            destroyOnClose
          >
            <NameList
              names={names}
              selectName={this.selectMaster} 
            />
          </Modal>
        </td>
        <td>
          { selectedMaster.balance||0 + ledger.amount||0 }
        </td>
        <td>
          <Select 
            style={{width:"200px"}} 
            onChange={(val)=>this.handlePropChange('type',val)}
            placeholder="Type"
          >
            <Select.Option value="pay:cash">Payment Cash</Select.Option>
            <Select.Option value="pay:chq">Payment Cheque</Select.Option>
            <Select.Option value="MARG">Bill Marg</Select.Option>
            <Select.Option value="COL">Bill Colgate</Select.Option>
          </Select>
        </td>
        <td>
          <Input
            placeholder="Comments"
            style={{width:"100%"}} 
            value={ledger.comments}
            onChange={(e)=>this.handlePropChange('comments',e.target.value)}
          />
        </td>
        <td>
          <Input
            placeholder="Debit"
            style={{width:"100%"}} 
            value={debit}
            onChange={(e)=>this.handlePropChange('debit',e.target.value)}
          />
        </td>
        <td>
          <Input
            placeholder="Credit"
            style={{width:"100%"}} 
            value={credit}
            onChange={(e)=>this.handlePropChange('credit',e.target.value)}
          />
        </td>         
      </tr>
      );
    }
  }