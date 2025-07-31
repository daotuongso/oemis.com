import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || '/'
export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const getLedgerEntries = async (accountId, from, to) => {
  const params = new URLSearchParams({ from, to });
  const { data } = await api.get(`/api/accounting/ledger/${accountId}?${params}`);
  return data;
};

