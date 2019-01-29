import React, { Component } from 'react';
import { Input, Modal } from 'antd';
import PropTypes from 'prop-types';
import NameList from '@/components/NameList';
import { connect } from 'dva';

@connect(({ master})=>({
  names: master.normalized
}))
class NameSelect extends Component {

  state = {
    showNameList: false,
    selectedMaster: {
      name: "",
    }
  }

  componentDidMount(){
    this.refs.nameSelect.focus();
  }

  componentWillReceiveProps(props){
    const { names } = this.props;
    if(props.master){
      const selectedMaster = names[props.master]
      this.setState({ selectedMaster })
    }
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
    const { names, onSelect } = this.props;
    const custID = names.all[cursor];
    const selectedMaster = names[custID];
    this.setState({ selectedMaster });
    // console.log(selectedMaster);
    onSelect(selectedMaster);
    this.toggleList();
  }

  render() {
    const { names } = this.props;
    const { showNameList, selectedMaster } = this.state;

    return (
      <div>
        <Input 
          placeholder="Account" 
          onPressEnter={this.toggleList}
          value={selectedMaster && selectedMaster.name}
          ref="nameSelect" 
          allowClear
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
      </div>
    );
  }
}

NameSelect.propTypes = {
  names: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  master: PropTypes.object,
}

NameSelect.defaultProps = {
  master: {
    name: ""
  }
}

export default NameSelect;

