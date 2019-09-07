import { message } from 'antd';
import { normalizer } from '@/utils/normalizing';
import { getErrors, postErrors } from '@/services/goapi';

export default {
  namespace: 'outstanding',
  state: {
    data: {},
    total: 0,
    selected: 0,
    notSelected: 0,
    selections: {},
    uploading: false,
  },
  effects: {
    *fetchErrors(_, { call, put }) {
      try {
        const response = yield call(getErrors);
        console.log('Retrieving errors: ', response.data);
        yield put({
          type: 'storeErrors',
          payload: response.data,
        });
      } catch {
        message.error('Unable to process request, check internet connection');
      }
    },
    *postErrors({ payload }, { call, put }) {
      const response = yield call(postErrors, payload);
      message.info(response.data);
      yield put({
        type: 'fetchErrors',
      });
    },
  },
  reducers: {
    storeErrors(state, action) {
      const mappedData = normalizer(action.payload, 'ID');

      console.log('Mapped Data of errors: ', mappedData);

      return {
        ...state,
        data: mappedData,
        total: mappedData.all.length,
        selected: 0,
        notSelected: mappedData.all.length,
      };
    },
    handleSelection(state, action) {
      const { name, custID } = action.payload;
      let { selections, selected, notSelected } = state;
      if (!selections[name]) {
        selections.all.push(name);
      }
      selections[name] = custID;
      selected += 1;
      notSelected -= 1;
      return {
        ...state,
        selections,
        selected,
        notSelected,
      };
    },
  },
};
