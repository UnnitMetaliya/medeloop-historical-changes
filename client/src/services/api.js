import config from "../config.json";
import axios from "axios";

export const getAllLogs = async (token) => {
  try {
    const { data } = await axios.get(config.server + `/api/v1/product/logs`, {
      headers: {
        Authorization: token
      }
    });
    return data;
  } catch (error) {
    console.log("err in sign ", error);
    return error;
  }
};
export const getAllProducts = async (token) => {
  try {
    const { data } = await axios.get(config.server + `/api/v1/products`, {
      headers: {
        Authorization: token
      }
    });
    return data;
  } catch (error) {
    console.log("err in sign ", error);
    return error;
  }
};
export const login = async (email) => {
  try {
    const { data } = await axios.post(config.server + '/api/v1/user/auth/sign-in', {
      email: email
    });
    return data;
  } catch (error) {
    console.log("err in sign ", error);
    return error;
  }
};
export const updateProd = async (_id, productName, price, description, offer, oldValue, token) => {
  try {
    const { data } = await axios.post(
      config.server + '/api/v1/product/update',
      {
        _id,
        productName,
        price,
        description,
        offer,
        oldValue
      },
      {
        headers: {
          Authorization: token
        }
      }
    );
    return data;
  } catch (error) {
    console.log("err in sign ", error);
    return error;
  }
};
export const getUserDetail = async (id,token) => {
  try {
    const { data } = await axios.get(config.server + `/api/v1/user/auth/data/?id=${id}`,{
      headers: {
        Authorization: token
      }
    });
    return data;
  } catch (error) {
    console.log("err in sign ", error);
    return error;
  }
};