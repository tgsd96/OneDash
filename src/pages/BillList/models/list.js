import {
  getList,
  getMinList,
  postGetAllLedgers,
  getCreateNewLedger,
  putUpdateLedger,
} from '@/services/goapi';
import { normalizer, denormalizer } from '@/utils/normalizing';

const filterOptions = (list, filterName, filterRoute, filterValue) => {
  const nameList = list.filter(item =>
    item.name.toLowerCase().search(filterName.toLowerCase() != -1)
  );

  return nameList;
};

export default {
  namespace: 'billList',
  state: {
    orgList: {
      all: [],
    },
    billList: {
      all: [],
    },
    minBillList: {
      all: [],
    },
    ledgers: [],
    selected: false,
    selectedLedger: {},
    nameFilter: '',
    routeFilter: 'all',
    zeroFilter: false,
    modalVisible: false,
    newLedger: {},
  },
  effects: {
    *createNewLedger(_, { call, put, select }) {
      const response = yield call(getCreateNewLedger);

      // add the cust_id from selected

      const selectedAccount = yield select(state => state.billList.selectedLedger);

      const packet = { ...response.data, cust_id: selectedAccount.cust_id };

      // log the packet..
      console.log('Recieved new Ledger', packet);

      yield put({ type: 'saveNewLedger', payload: packet });
      yield put({ type: 'openModal' });
    },

    // UPDATE LEDGERS
    *updateLedger({ ledger }, { call, put }) {
      const response = yield call(putUpdateLedger, ledger);
      yield put({ type: 'fetchMinList', date: undefined });
    },
    *fetchBillList(_, { call, put }) {
      const response = yield call(getList, { startDate: '2018-12-01', endDate: '2019-02-28' });
      console.log('Bill Lists:', response.data);
      yield put({
        type: 'saveBillList',
        payload: response.data,
      });
    },
    *fetchMinList({ date }, { call, put }) {
      const response = yield call(getMinList, date);
      console.log('Latest Data: ', response.data);
      yield put({
        type: 'saveMinBillList',
        payload: response.data,
      });
    },
    *fetchLedgers({ cust_id }, { call, put, select }) {
      yield put({
        type: 'hideDialog',
      });

      const ledger = yield select(state => state.billList.orgList[cust_id]);

      yield put({
        type: 'selectLedger',
        payload: ledger,
      });

      const response = yield call(postGetAllLedgers, {
        cust_id,
        start_date: '2018-01-23T00:00:00Z',
        end_date: '3022-03-31T00:00:00Z',
      });

      console.log('ledgers recieved: ', response.data);

      yield put({
        type: 'saveLedger',
        payload: response.data,
      });

      yield put({
        type: 'showDialog',
      });
    },
    *filterBasedOnValue({ value }, { call, put, select }) {
      if (value) {
        const billList = yield select(state => state.billList.orgList);
        let newList = [];
        billList.all.forEach(billID => {
          if (billList[billID].total != 0) {
            newList.push(billList[billID]);
          }
        });
        console.log('The newList is: ', newList);
        yield put({
          type: 'filterMinList',
          payload: newList,
        });
      } else {
        const orgList = yield select(state => state.billList.orgList);
        let newList = [];
        orgList.all.forEach(id => {
          newList.push(orgList[id]);
        });
        console.log('The newList is: ', newList);
        yield put({
          type: 'filterMinList',
          payload: newList,
        });
      }
    },
    *filterBasedOnName({ name }, { put }) {
      const billList = yield select(state => state.billList.minBillList);
    },
    *applyFilter(_, { put, select }) {
      // applying filter
      console.log('Applying filter');

      const billList = yield select(state => state.billList.orgList);
      const nameFilter = yield select(state => state.billList.nameFilter);
      // apply name filter

      console.log('Name filter:', nameFilter);

      let deList = denormalizer(billList);

      const nameList = deList.filter(
        item => item.name.toLowerCase().search(nameFilter.toLowerCase()) != -1 || nameFilter == ''
      );

      // apply beat filter
      const routeFilter = yield select(state => state.billList.routeFilter);

      const routeList = nameList.filter(
        item => item.area.toLowerCase() == routeFilter.toLowerCase() || routeFilter == 'all'
      );

      // const

      const zeroFilter = yield select(state => state.billList.zeroFilter);

      const zeroList = routeList.filter(item => item.total != 0 || !zeroFilter);

      yield put({
        type: 'filterMinList',
        payload: zeroList,
      });
    },
    *updateNameFilter({ name }, { put }) {
      yield put({
        type: 'updateNameLedger',
        payload: name,
      });

      yield put({
        type: 'applyFilter',
      });
    },
    *updateRouteFilter({ route }, { put }) {
      yield put({
        type: 'updateRoute',
        payload: route,
      });

      yield put({
        type: 'applyFilter',
      });
    },
    *updateZeroFilter({ value }, { put }) {
      yield put({
        type: 'updateZero',
        payload: value,
      });

      yield put({
        type: 'applyFilter',
      });
    },
  },
  reducers: {
    saveBillList(state, action) {
      // save the billList
      const mappedData = normalizer(action.payload, 'ID');

      return {
        ...state,
        billList: mappedData,
      };
    },
    saveMinBillList(state, action) {
      const mappedData = normalizer(action.payload, 'cust_id');
      console.log('Mapped Data: ', mappedData);

      return {
        ...state,
        minBillList: mappedData,
        orgList: mappedData,
      };
    },
    filterMinList(state, action) {
      const mappedData = normalizer(action.payload, 'cust_id');
      console.log('Mapped Data: ', mappedData);
      return {
        ...state,
        minBillList: mappedData,
      };
    },
    showDialog(state, action) {
      return {
        ...state,
        selected: true,
      };
    },
    hideDialog(state, action) {
      return {
        ...state,
        selected: false,
      };
    },
    saveLedger(state, action) {
      return {
        ...state,
        ledgers: action.payload,
      };
    },
    selectLedger(state, action) {
      return {
        ...state,
        selectedLedger: action.payload,
      };
    },
    updateNameLedger(state, action) {
      console.log('Updating name filter:', action.payload);

      return {
        ...state,
        nameFilter: action.payload,
      };
    },
    updateRoute(state, action) {
      console.log('Updating route filter: ', action.payload);
      return {
        ...state,
        routeFilter: action.payload,
      };
    },
    updateZero(state, action) {
      console.log();
      return {
        ...state,
        zeroFilter: action.payload,
      };
    },
    closeModal(state) {
      console.log();
      return {
        ...state,
        modalVisible: false,
      };
    },
    openModal(state) {
      return {
        ...state,
        modalVisible: true,
      };
    },
    saveNewLedger(state, action) {
      return {
        ...state,
        newLedger: action.payload,
      };
    },
  },
};
