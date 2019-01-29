import { queryOneMaster, postUpdateLedgers } from '@/services/goapi'
import { denormalizer } from '@/utils/normalizing';
import { message } from 'antd';

export default {
    namespace : 'selectedMaster',
    state : {
        master : {}
    },
    effects : {
        *fetchMaster({custID } , {call,put}){
            const response = yield call(queryOneMaster,custID)
            yield put({
                type: 'saveMaster',
                payload: response,
            });
        },
        *updateLedgers( { ledgers }, { call, put }){
            const ledgersToBeSent = denormalizer(ledgers);
            console.log("Sending Updates: ", ledgersToBeSent)
            const response = yield call(postUpdateLedgers, ledgersToBeSent)
            message.success(response.data);
            
        }
    },
    reducers: {
        saveMaster(state, action){

            let tempNormalized = {
                all : []
            }

            for(let i=0;i<action.payload.ledgers.length;i+=1){
                const record = action.payload.ledgers[i]
                // console.log(record)
                tempNormalized[record.ID] = record
                tempNormalized.all.push(record.ID)
            }

            return {
                ...state,
                master: action.payload,
                ledgerToMap: tempNormalized
            }
        }
    }
}