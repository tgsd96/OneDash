import { queryMaster } from '@/services/goapi';

export default {
    namespace : 'master',

    state : {
        list : [],
        normalized : {
            all :[]
        }
    },

    effects : {
        *fetchList(_,{ call, put }){
            const response = yield call(queryMaster);
            yield put({
                type: 'saveList',
                payload : Array.isArray(response) ? response : [],
            });
        },
    },

    reducers : {
        saveList(state, action){

            // normalize the data based on cust_id
            let tempNormalized = {
                all : []
            }

            for(let i=0;i<action.payload.length;i+=1){
                const record = action.payload[i]
                tempNormalized[record.cust_id] = record
                tempNormalized.all.push(record.cust_id)
            }
            // console.log(tempNormalized)

            return{
                ...state,
                list : action.payload,
                normalized: tempNormalized
            }
        }
    }
}