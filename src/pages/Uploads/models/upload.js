import { postSalesUpload, putSaveToDB } from '@/services/goapi';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'upload',
  state: {
    uploadDetails: {},
    selection: '',
    successCount: 0,
    failedCount: 0,
  },

  effects: {
    *uploadSales({ payload }, { call, put }) {
      const fileForm = new FormData();
      fileForm.append('upload', payload.file, payload.file.name);
      const pLoad = {
        company: payload.selection,
        fileForm,
      };
      // console.log("SENDING SELECTION:",payload)
      yield put({
        type: 'saveSelection',
        payload: payload.selection,
      });
      try {
        const response = yield call(postSalesUpload, { payload: pLoad });
        console.log(response);
        yield put({
          type: 'saveResponse',
          payload: response.data,
        });
        yield put(routerRedux.push('/uploads/sales/columns'));
      } catch {
        message.error('Unable to procees file');
        return;
      }
      // message.success(response.data)
    },

    *putKeysAndSave({ payload }, { call, put, select }) {
      const company = yield select(state => state.upload.selection);
      const fileName = yield select(state => state.upload.uploadDetails.file_name);
      console.log('State are as follows', company);

      // const fileName = "COLGATE.csv2019-02-07T19:57:24+05:30.json"
      console.log('File Selected:', fileName);
      try {
        const response = yield call(putSaveToDB, {
          company,
          payload: { file_name: fileName, keys: payload },
        });
        console.log(response.data);
        yield put({
          type: 'saveResult',
          ...response.data,
        });
        yield put(routerRedux.push('/uploads/sales/result'));
      } catch {
        message.error('Error while parsing the request');
        return;
      }
    },
  },

  reducers: {
    saveResponse(state, action) {
      console.log('Saving response', action.payload);
      return {
        ...state,
        uploadDetails: action.payload,
      };
    },
    saveSelection(state, action) {
      return {
        ...state,
        selection: action.payload,
      };
    },
    saveResult(state, action) {
      console.log('Logging action:', action);
      return {
        ...state,
        successCount: action.success,
        failedCount: action.errors,
      };
    },
  },
};
