import { postLedgers, postGetAllLedgers, putUpdateLedger, getCreateNewLedger } from  '@/services/goapi';
import { message } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import { normalizer } from '@/utils/normalizing';


const INITIAL_STATE = {
    selectedLedger : {},
    ledgers : null
}

export default {
    namespace : 'ledger',
    state : INITIAL_STATE,
    effects : {
        *fetchLedger({ ID }, { call, put }){
            const response = yield call(postLedgers,ID);
            yield put({
                type: 'saveLedger',
                payload: response
            });

        },
        *postNewLedgers({ payload }, { call, put }){
            console.log("submitting...........")
            try{
                yield call(postLedgers,payload);
            }catch{
                message.error("Cannot connect to server")
                return
            }
            message.success("Successfully saved ledgers")
            yield put({
                type: 'master/fetchList'
            })
        },
        *fetchLedgers( { payload }, { call, put }){
            console.log("Fetch Payload:" ,payload)
            const response = yield call(postGetAllLedgers, payload);
            console.log(response.data);
            // normalize the data
            const normalizedResponse = normalizer(response.data, "ID");
            console.log(normalizedResponse);
            yield put({
                type: 'saveLedgers',
                payload: normalizedResponse
            })
        },
        *updateLedger( { ledger }, { call, put}){
            const response = yield call(putUpdateLedger, ledger);
            yield put({
                type:'postUpdateLedger',
                payload: ledger
            })
        },
        *createLedger( _ , { call, put }){
            const response = yield call(getCreateNewLedger);
            yield put({
                type: 'addLedger',
                payload: response.data
            })
        }
    },
    reducers: {
        saveLedger(state, action){
            return {
                ...state,
                selectedLedger: action.payload
            }
        },
        saveLedgers(state,action){
            return{
                ...state,
                ledgers : action.payload
            }
        },
        postUpdateLedger(state,action){
            const { ledgers } = state;
            const updateLedger = {...ledgers, [action.payload.ID]: action.payload};
            return{
                ...state,
                ledgers: updateLedger
            }
        },
        addLedger(state, action){
            const { ledgers } = state;
            let ledgerAll = ledgers.all
            const { payload } = action;
            ledgerAll = [ payload.ID, ...ledgerAll ];
            const updateLedger = { ...ledgers, [payload.ID]: payload, all: ledgerAll};
            return{
                ...state,
                ledgers: updateLedger
            }

        },
        deleteLedger(state, action){
            console.log("Deleting:",action.payload)
            const { ledgers } = state;
            const nextLedger = produce(ledgers, draftState=>{
                delete draftState[action.payload.ID]
                _.pull(draftState.all, action.payload.ID)
            });
            console.log("Delete Ledger",nextLedger)
            return{
                ...state,
                ledgers : nextLedger
            }
        }
    },
};