import axios from "axios";
import config from "../../config/config.js";

// The timestamp should be in this format, YYYYMMDDHHmmss
const getTimeStamp = () => {
  function formatdate(time) {
    time = time.toString();
    return time.length < 2 ? "0" + time : time;
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = formatdate(date.getMonth() + 1);
  const day = formatdate(date.getDate());
  const hours = formatdate(date.getHours());
  const minutes = formatdate(date.getMinutes());
  const seconds = formatdate(date.getSeconds());
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const getMpesaAccessToken = async () => {
  const url = `${config.mpesa.base_url}/oauth/v1/generate?grant_type=client_credentials`;
  const consumerKey = config.mpesa.consumer_key;
  const consumerSecret = config.mpesa.consumer_secret;
  const base64String = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${base64String}`,
      "Content-Type": "application/json",
    },
  });

  const token = await response.data.access_token;
  return token;
};

const initiateStkPush = async (phoneNumber) => {
  const timestamp = getTimeStamp();
  const accessToken = await getMpesaAccessToken();
  const password = Buffer.from(
    config.mpesa.short_code + config.mpesa.pass_key + timestamp
  ).toString("base64");
  const url = `${config.mpesa.base_url}/mpesa/stkpush/v1/processrequest`;
  const response = await axios.post(
    url,
    {
      BusinessShortCode: config.mpesa.short_code,
      Password: password,
      Timestamp: timestamp,
      TransactionType: config.mpesa.transaction_type,
      Amount: config.mpesa.subscription_amount,
      PartyA: phoneNumber,
      PartyB: config.mpesa.short_code,
      PhoneNumber: phoneNumber,
      CallBackURL: `${config.mpesa.callback_url}/api/v1/donate/mpesa/callback`,
      AccountReference: "Bioafya",
      TransactionDesc: "Subscription Payment",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};


export default {getTimeStamp, getMpesaAccessToken, initiateStkPush}