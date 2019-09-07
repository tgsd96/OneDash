import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import LedgerTable from '@/components/LedgerTable';
import LedgerEditor from '@/components/LedgerEditor';
import LedgerView from '@/components/LedgerView';

@connect(({ selectedMaster, master }) => ({
  master: selectedMaster.master,
  allMasters: master.normalized,
  ledgerToMap: selectedMaster.ledgerToMap,
}))
class MasterDetail extends Component {
  state = {
    ledgerToMap: {},
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const cust_id = match.params.id;
    dispatch({
      type: 'selectedMaster/fetchMaster',
      custID: cust_id,
    });
    this.forceUpdate();
  }

  handleOnEnter = cursor => {
    const { ledgerToMap } = this.props;
    const ledgerID = ledgerToMap.all[cursor];
    router.replace(`/ledger/${ledgerID}`);
  };

  handeEscape = () => {
    router.goBack();
  };

  handleSave = newLedgers => {
    const { dispatch } = this.props;
    dispatch({
      type: 'selectedMaster/updateLedgers',
      ledgers: newLedgers,
    });
  };

  render() {
    const { match, master, allMasters, ledgerToMap } = this.props;
    const cust_id = match.params['id'];
    const thisMaster = allMasters[cust_id];
    console.log('Selected Master', master);
    if (!thisMaster) {
      router.replace('/master');
    }
    // console.log("Mapped",ledgerToMap[14])

    return (
      <PageHeaderWrapper title={thisMaster ? thisMaster.name : ''}>
        <Card />
        {ledgerToMap && (
          <LedgerTable
            onEnter={this.handleOnEnter}
            ledgers={ledgerToMap}
            handleSave={this.handleSave}
            custID={parseInt(cust_id)}
          />
        )}
        {
          //   ledgerToMap&&
          //   <LedgerView ledgerToMap={ledgerToMap} />
        }
      </PageHeaderWrapper>
    );
  }
}

export default MasterDetail;
