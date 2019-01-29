import React, { Component } from 'react';
import PhysicalList from '../PhysicalList';
import './index.less';

const styles = {
  wrapper : {
    width : '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
  }

}

export default class NameList extends Component {
  state = {
    filterString: "",
    cursor: 0,
  }
  
  selectName = (cursor)=>{
    // console.log("Cursor:", cursor);
    // console.log(this.state.filtered)
    // console.log("User: ", this.state.filtered[this.state.filtered.all[cursor]])

    const { selectName } = this.props;
    selectName(cursor);
  }
  
  filterData = async (filName)=>{
    
    if(filName===""){
      this.setState({ cursor: 0});
    }
    // console.log(filName);
    // var newAll = [];
    const { names } = this.props;
    // console.log(names);
    for( let i=0; i<names.all.length;i+=1){
      // console.log(names[names.all[i]].name.toLowerCase(), filName.toLowerCase())
      if(names[names.all[i]].name.toLowerCase().startsWith(filName.toLowerCase())){
        // console.log("Setting cursor to:",i)
        this.setState({cursor : i});
        break;
      }
    }
    // names.all.forEach((fake_id)=>{
    //     if(names[fake_id].name.toLowerCase()[filName.length] === filName.toLowerCase()){
    //         this.setState({cursor: fake_id});
    //         break;
    //     }
    // })
  }
  
  handleKey = async (_, key) =>{
    const { filterString } = this.state; 
    const filKey = filterString + key;
    // console.log(filKey);
    await this.filterData(filKey);
    this.setState({ filterString : filKey});
  }
  
  handleBackKey = async(_, key)=>{
    const { filterString } = this.state; 
    const filKey = filterString.slice(0,-1);
    // console.log(filKey);
    await this.filterData(filKey);
    this.setState({ filterString : filKey });
  }

  render() {  
    const Columns = ["Name","Area","Balance"];
    const selectedCSS = {
      backgroundColor:"#e6f7ff"
    }
    const { filterString, cursor } = this.state;
    const { names } = this.props;

    return ( 
      <div 
        style={styles.wrapper}>
        <p>Search Parameter: {filterString}</p>
      
        <PhysicalList 
          rowHeight={10}
          numberOfRows={10}
          maxHeight={400}
          cursor={cursor}
          columns={Columns}
          style={{overflow: 'scroll'}}
          renderItem = { 
            (item, selected, _)=>
              item?
                <tr 
                  key={item.name+item.cust_id} 
                  style={selected?selectedCSS:{}}
                >
                  <td>
                    {item.name}
                  </td>
                  <td>
                    {item.area}
                  </td>
                  <td>
                    {item.balance}
                  </td>
                </tr>
          :null}
          dataSource={names} 
          handleCharacter={this.handleKey}
          handleEnter={this.selectName}
          handleMisc={[{keyCode:8, handler: this.handleBackKey}]}
          enableNav
        />
      </div>
          );
        }
      }