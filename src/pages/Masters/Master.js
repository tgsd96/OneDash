import React, { Component } from 'react';
import {connect} from 'dva';
import { Card } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import NameList from '@/components/NameList';



@connect(({master})=>({
    normalized : master.normalized
}))
class MasterList extends Component {

    componentDidMount(){
      const { dispatch } = this.props;
      dispatch({
        type:'master/fetchList'
      })
    }

    handleSelect = (cursor)=>{
      const { normalized } = this.props;
      const custID = normalized.all[cursor];
      router.push(`/master/${custID}`)
    }

    
    
    render() {
        const { normalized } = this.props;
        // console.log(masterArray)
        return (
          <PageHeaderWrapper title="List of Masters">
            <Card bordered={false}>
              <NameList
                names={normalized}
                selectName={this.handleSelect}
              />
            </Card>
          </PageHeaderWrapper>
          );
        }
    }
    
    export default MasterList;