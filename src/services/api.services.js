/*!
 * API services (Vue)
 * File: api.services.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PA_APPS_API_URL,
  headers: {
    "Content-Type": "application/json",
    dataType: "json",
  },
  withCredentials: true,
});

/**
 * Helper utility for removing async/await try/catch litter
 * - encapsulates API errors to avoid cascading fallbacks
 */

/* Native Error types https://mzl.la/2Veh3TR */

const nativeExceptions = [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
].filter((except) => typeof except === "function");

/* Throw native errors. ref: https://bit.ly/2VsoCGE */
function throwNative(error) {
  for (const Exception of nativeExceptions) {
    if (error instanceof Exception) throw error;
  }
}

function asyncWrapper(promise, finallyFunc) {
  return promise
    .then((data) => {
      if (data instanceof Error) {
        throwNative(data);
        return [data];
      }
      return [undefined, data];
    })
    .catch((error) => {
      throwNative(error);
      return [error];
    })
    .finally(() => {
      if (finallyFunc && typeof finallyFunc === "function") {
        finallyFunc();
      }
    });
}

/**
 * Process API result
 */

const handleResult = (error, result) => {
  const { data = [] } = result || {};
  if (error && error.response) {
    // extract specific error message (if exists)
    const { data = "" } = error.response || {};
    const { message = "" } = data || {};
    const { msg = "" } = message || {};
    if (error.response.status === 403 || error.response.status === 401) {
      return msg
        ? [{ text: msg, type: "error" }, null]
        : [messageHandler.get("notAuthorized"), null];
    } else if (error.response.status === 422) {
      return msg
        ? [{ text: msg, type: "error" }, null]
        : [messageHandler.get("invalidData"), null];
    } else
      return msg
        ? [{ text: msg, type: "error" }, null]
        : [messageHandler.get("serverError"), null];
  }
  return [error, data];
};

/**
 * Get method
 *
 * @return users
 */

export const get = async (route) => {
  const [error, result] = await asyncWrapper(api.get(route));
  return handleResult(error, result);
};

/**
 * Post method
 *
 * @return response
 */

export const post = async (route, data) => {
  const [error, result] = await asyncWrapper(api.post(route, data));
  return handleResult(error, result);
};

/**
 * Upload method
 *
 * @return response
 */

export const upload = async (route, formData) => {
  const apiUpload = axios.create({
    baseURL: import.meta.env.PA_APPS_API_URL,
    withCredentials: true,
  });

  const [error, result] = await asyncWrapper(apiUpload.post(route, formData));
  return handleResult(error, result);
};

/**
 * Download method
 *
 * @return response
 */

export const download = async (route, filename) => {
  return axios
    .get(route, {
      responseType: "blob",
      baseURL: import.meta.env.PA_APPS_API_URL,
      withCredentials: true,
    })
    .then((res) => {
      saveAs(res.data, filename);
      return handleResult(null, res);
    })
    .catch(handleResult);
};

export default api;
