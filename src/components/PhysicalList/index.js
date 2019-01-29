import React, { Component } from 'react';
import lstyles from './index.less';

export default class PhysicalList extends Component {
    state = {
        cursor: 0
    }

    handleMouse = (cursor)=>{
      this.setState({ cursor });
    }
    
    handleKeyDown = async (e)=>{
        e.persist();
        const kCode = e.keyCode;
        const cursor = this.state.cursor;
        const len = this.props.dataSource.all.length;
        
        const { handleEnter, handleEscape, handleCharacter, handleMisc, enableNav } = this.props;
        
        // console.log(e.keyCode)
        
        // logic for up down
        if (kCode === 38 && cursor > 0 && enableNav) {
            e.preventDefault();
            this.setState( prevState => ({
                cursor: prevState.cursor - 1
            }))
        } else if (kCode === 40 && cursor < len - 1 && enableNav) {
            e.preventDefault();
            this.setState( prevState => ({
                cursor: prevState.cursor + 1
            }))
        }
        
        // enter logic
        if(kCode === 13){
            console.log(cursor);
            if(handleEnter)
            await handleEnter(cursor);
        }
        
        // escape logic
        if(kCode === 27){
            // TODO
            if(handleEscape)
            {
              e.preventDefault();
              await handleEscape(cursor);    
            }
            
        }
        
        // character key logic
        if(kCode > 47 && kCode < 91 || kCode == 32){
            
            // TODO
            if(handleCharacter){
                const val = e.key.toString();
                await handleCharacter(cursor,val);
            }
            
        }
        
        // handle misc logic
        if(handleMisc){
            handleMisc.map(async (each_pair)=>{
                if(kCode === each_pair.keyCode){
                    await each_pair.handler(cursor, e);
                }
            })
        }
    }
    
    componentDidMount(){
        this.refs.wind.focus();
    }

    async componentWillReceiveProps(nextProps){
        // console.log("Received cursor", nextProps.cursor)
        if(nextProps.cursor || nextProps.cursor===0)
        await this.setState({ cursor : nextProps.cursor})
        // console.log("Cursor update: ", this.state.cursor);
    }

    checkIfVisible = index => {

        const { cursor } = this.state;
        // if(this.props.dataSource.all.length<this.props.numberOfRows){
        //     return true;
        // }
        // if( index >= cursor ){
        //     return( index - cursor <= this.props.numberOfRows);
        // }else{
        //     return(cursor - index <1);
        // }
        if( Math.abs(cursor - index) >= this.props.numberOfRows) return false
        return true;
    }
    
    render() {
        const { cursor } = this.state;
        const { renderItem , columns, rowHeight, numberOfRows, maxHeight} = this.props;

        // const currentCursor = cursorUpdate || 0;
        // this.setState({cursor: currentCursor});
        
        const totalHeight = rowHeight * numberOfRows;

        const styles = {
            wrapper : {
                height: maxHeight
            },
            listWrapper: {
                top: 0,
                left: 0,
                right:0,
                bottom:0,
                overflowY: 'hidden',
                position: 'absoute',
                height: maxHeight,
            },
            list: height => ({
                height,
                position: 'relative',
                overflow: 'scroll'
            }),
            item : (index, height)=>({
                height,
                left:0,
                right:0,
                top: height * index,
                position: 'absolute'
            })
        }

        
        
        return (
            <div style={styles.wrapper}>
            <div className={lstyles.wrapper} 
            ref="wind"
            onKeyDown={(e)=>this.handleKeyDown(e)} tabIndex="0"
            style={styles.listWrapper}  >
            <table  className={lstyles.table}>
            <thead>
            <tr>
            {columns.map((column_name)=>
                <th key={column_name}>{column_name}</th>)}
                </tr>
                </thead>
                {
                    this.props.dataSource.all.map(
                        (itemid, i)=>{
                            return <tbody>{this.checkIfVisible(i)?
                            renderItem(this.props.dataSource[itemid],cursor===i?true:false, styles.item(i,rowHeight))
                            :null}</tbody>
                        }
                        )
                    }
                </table>
                </div>
                </div>
                    );
                }
            }
