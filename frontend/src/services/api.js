import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api/auth/";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}register/`, userData);
    return response.data;
  } catch (error) {
    const respData = error?.response?.data;
    let msg = null;
    if (respData) {
      if (typeof respData === "string") {
        msg = respData;
      } else if (respData.error) {
        msg = respData.error;
      } else if (respData.detail) {
        msg = respData.detail;
      } else if (respData.email) {
        // common DRF validation shape: { "email": ["..."] }
        msg = Array.isArray(respData.email)
          ? respData.email.join(" ")
          : String(respData.email);
      } else {
        msg = JSON.stringify(respData);
      }
    }
    if (!msg) msg = error.message || "Registration failed";
    const err = new Error(msg);
    // attach raw response data for callers to map field errors
    err.response = respData;
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${baseURL}login/`, credentials);
    return response.data;
  } catch (error) {
    const respData = error?.response?.data;
    let msg = null;
    if (respData) {
      if (typeof respData === "string") {
        msg = respData;
      } else if (respData.error) {
        msg = respData.error;
      } else if (respData.detail) {
        msg = respData.detail;
      } else if (respData.non_field_errors) {
        msg = Array.isArray(respData.non_field_errors)
          ? respData.non_field_errors.join(" ")
          : String(respData.non_field_errors);
      } else {
        msg = JSON.stringify(respData);
      }
    }
    if (!msg) msg = error.message || "Login failed";
    const err = new Error(msg);
    err.response = respData;
    throw err;
  }
};

export const getAccounts = async (token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/my-accounts/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const respData = error?.response?.data;
    let msg = null;
    if (respData) {
      if (typeof respData === "string") {
        msg = respData;
      } else if (respData.error) {
        msg = respData.error;
      } else if (respData.detail) {
        msg = respData.detail;
      } else {
        msg = JSON.stringify(respData);
      }
    }
    if (!msg) msg = error.message || "Failed to fetch accounts";
    const err = new Error(msg);
    err.response = respData;
    throw err;
  }
};

export const getTransactions = async (token, accountId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/accounts/${accountId}/transactions/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const respData = error?.response?.data;
    let msg = null;
    if (respData) {
      if (typeof respData === "string") {
        msg = respData;
      } else if (respData.error) {
        msg = respData.error;
      } else if (respData.detail) {
        msg = respData.detail;
      } else {
        msg = JSON.stringify(respData);
      }
    }
    if (!msg) msg = error.message || "Failed to fetch transactions";
    const err = new Error(msg);
    err.response = respData;
    throw err;
  }
};

export async function transferMoney(transferData, token) {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/transfer/`,
      transferData,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const respData = error?.response?.data;
    let msg = null;
    if (respData) {
      if (typeof respData === "string") {
        msg = respData;
      } else if (respData.error) {
        msg = respData.error;
      } else if (respData.detail) {
        msg = respData.detail;
      } else {
        msg = JSON.stringify(respData);
      }
    }
    if (!msg) msg = error.message || "Transfer failed";
    const err = new Error(msg);
    err.response = respData;
    throw err;
  }
}

export function getProfile(token) {
  return axios
    .get(`http://127.0.0.1:8000/api/auth/profile/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      const respData = error?.response?.data;
      let msg = null;
      if (respData) {
        if (typeof respData === "string") {
          msg = respData;
        } else if (respData.error) {
          msg = respData.error;
        } else if (respData.detail) {
          msg = respData.detail;
        } else {
          msg = JSON.stringify(respData);
        }
      }
      if (!msg) msg = error.message || "Failed to fetch profile";
      const err = new Error(msg);
      err.response = respData;
      throw err;
    });
};

export function updateProfile(token, profileData) {
  return axios
    .put(`http://127.0.0.1:8000/api/auth/profile/`, profileData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      const respData = error?.response?.data;
      let msg = null;
      if (respData) {
        if (typeof respData === "string") {
          msg = respData;
        } else if (respData.error) {
          msg = respData.error;
        } else if (respData.detail) {
          msg = respData.detail;
        } else {
          msg = JSON.stringify(respData);
        }
      }
      if (!msg) msg = error.message || "Failed to update profile";
      const err = new Error(msg);
      err.response = respData;
      throw err;
    });
};

// Provide default export for backward-compatible imports
const api = {
  registerUser,
  loginUser,
  getAccounts,
  getTransactions,
  transferMoney,
};

export default api;
