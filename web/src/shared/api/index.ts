export { httpClient, HttpClientError } from "./http-client";
export type { ApiResponse, ApiError } from "./http-client";

export { queryKeys } from "./query-keys";
export { getApiErrorMessage } from "./handle-api-error";

export {
  getAuthNonce,
  verifyWalletSignature,
  getCurrentProfile,
  toAuthSession,
} from "./auth-api";
export type {
  AuthMeResponse,
  AuthNonceData,
  AuthNonceResponse,
  AuthProfile,
  AuthSession,
  VerifyWalletSignatureData,
  VerifyWalletSignatureRequest,
  VerifyWalletSignatureResponse,
} from "./auth-api";

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
