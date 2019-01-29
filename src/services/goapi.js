import request from '@/utils/request';
import axios from 'axios';
import { async } from 'q';

const SERVER_URL = 'http://localhost:8080'

export async function queryMaster(){
    return request(`${SERVER_URL}/api/master`)
} 

export async function queryOneMaster(custID){
    return request(`${SERVER_URL}/api/master/${custID}`)
}

export async function queryLedger(ledgerID){
    return request(`${SERVER_URL}/api/ledgers/${ledgerID}`)
}

export async function postLedgers(params){
    console.log("Sending:",params)
    return axios.post(`${SERVER_URL}/api/mledgers`,params);
};

export async function postUpdateLedgers(ledgerArray){
    return axios.put(`${SERVER_URL}/api/ledgers`, ledgerArray)
}

export async function postGetAllLedgers(dateObject){
    return axios.post(`${SERVER_URL}/api/ledgers`, dateObject)
}

export async function putUpdateLedger(ledger){
    return axios.put(`${SERVER_URL}/api/ledger`,ledger)
}

export async function getCreateNewLedger(){
    return axios.get(`${SERVER_URL}/api/ledger`);
}