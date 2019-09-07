import request from '@/utils/request';
import axios from 'axios';

const SERVER_URL = 'http://localhost:8080';

export async function queryMaster() {
  return request(`${SERVER_URL}/api/master`);
}

export async function queryOneMaster(custID) {
  return request(`${SERVER_URL}/api/master/${custID}`);
}

export async function queryLedger(ledgerID) {
  return request(`${SERVER_URL}/api/ledgers/${ledgerID}`);
}

export async function postLedgers(params) {
  console.log('Sending:', params);
  return axios.post(`${SERVER_URL}/api/mledgers`, params);
}

export async function postUpdateLedgers(ledgerArray) {
  return axios.put(`${SERVER_URL}/api/ledgers`, ledgerArray);
}

export async function postGetAllLedgers(dateObject) {
  return axios.post(`${SERVER_URL}/api/ledgers`, dateObject);
}

export async function putUpdateLedger(ledger) {
  return axios.put(`${SERVER_URL}/api/ledger`, ledger);
}

export async function getCreateNewLedger() {
  return axios.get(`${SERVER_URL}/api/ledger`);
}

export async function postSalesUpload(filePacket) {
  const { company, fileForm } = filePacket.payload;
  console.log('Sending Packets: ', filePacket);
  return axios.post(`${SERVER_URL}/api/fileupload/${company}`, fileForm, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function putSaveToDB(fRequest) {
  console.log('Putting request: ', fRequest);
  return axios.put(`${SERVER_URL}/api/savefile/${fRequest.company}`, fRequest.payload);
}

export async function getErrors() {
  return axios.get(`${SERVER_URL}/api/errors`);
}

export async function postErrors(payload) {
  return axios.post(`${SERVER_URL}/api/errors`, payload);
}

export async function getList(dates) {
  return axios.get(
    `${SERVER_URL}/api/download?startDate=${dates.startDate}&endDate=${dates.endDate}`
  );
}

export async function getMinList(date) {
  return axios.get(`${SERVER_URL}/api/downloadMin?startDate=${date}`);
}
