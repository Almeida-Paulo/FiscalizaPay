export { httpClient, HttpClientError } from "./http-client";
export type { ApiResponse, ApiError } from "./http-client";

export { queryKeys } from "./query-keys";
export { getApiErrorMessage } from "./handle-api-error";

export {
  getContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getContractEvents,
  confirmShipment,
  confirmDelivery,
  validateReceipt,
  authorizePayment,
  openDispute,
  simulateFraud,
} from "./contracts-api";

export { getDashboardSummary } from "./dashboard-api";

export { getBlockchainStatus, registerOnChain } from "./blockchain-api";
