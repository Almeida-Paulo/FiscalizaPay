import type { UserRole } from "@/entities/profile";
import type { ApiResponse } from "@/shared/types/api";
import { httpClient, HttpClientError } from "./http-client";

const WALLET_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export type AuthProfile = {
  id: string;
  name: string;
  role: UserRole;
  walletAddress: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthNonceData = {
  walletAddress: string;
  nonce: string;
  message: string;
  expiresAt: string;
};

export type AuthNonceResponse = ApiResponse<AuthNonceData>;

export type VerifyWalletSignatureRequest = {
  walletAddress: string;
  nonce: string;
  signature: string;
};

export type VerifyWalletSignatureData = {
  accessToken: string;
  tokenType: "bearer" | string;
  expiresAt: string;
  profile: AuthProfile;
};

export type VerifyWalletSignatureResponse =
  ApiResponse<VerifyWalletSignatureData>;

export type AuthMeResponse = ApiResponse<AuthProfile>;

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  profile: AuthProfile;
  walletAddress: string;
  role: UserRole;
  isAuthenticated: boolean;
};

function authValidationError(message: string): never {
  throw new HttpClientError({
    message,
    code: "VALIDATION_ERROR",
    statusCode: 400,
  });
}

function normalizeWalletAddress(walletAddress: string): string {
  const value = walletAddress.trim();
  if (!WALLET_ADDRESS_RE.test(value)) {
    authValidationError(
      "Endereco de wallet invalido. Use uma wallet EVM no formato 0x + 40 caracteres hexadecimais.",
    );
  }
  return value;
}

function requireText(value: string, fieldName: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    authValidationError(`Campo obrigatorio ausente: ${fieldName}.`);
  }
  return trimmed;
}

export function getAuthNonce(
  walletAddress: string,
): Promise<AuthNonceResponse> {
  const normalizedWallet = normalizeWalletAddress(walletAddress);
  const query = new URLSearchParams({ walletAddress: normalizedWallet });

  return httpClient.get<AuthNonceData>(`/auth/nonce?${query.toString()}`);
}

export function verifyWalletSignature(
  payload: VerifyWalletSignatureRequest,
): Promise<VerifyWalletSignatureResponse> {
  const walletAddress = normalizeWalletAddress(payload.walletAddress);
  const nonce = requireText(payload.nonce, "nonce");
  const signature = requireText(payload.signature, "signature");

  return httpClient.post<VerifyWalletSignatureData>("/auth/verify", {
    walletAddress,
    nonce,
    signature,
  });
}

export function getCurrentProfile(accessToken: string): Promise<AuthMeResponse> {
  const token = requireText(accessToken, "accessToken");

  return httpClient.get<AuthProfile>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function toAuthSession(
  data: VerifyWalletSignatureData,
): AuthSession {
  return {
    accessToken: data.accessToken,
    tokenType: data.tokenType,
    expiresAt: data.expiresAt,
    profile: data.profile,
    walletAddress: data.profile.walletAddress,
    role: data.profile.role,
    isAuthenticated: true,
  };
}
