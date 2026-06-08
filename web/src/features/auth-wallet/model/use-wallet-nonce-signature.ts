"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import type { Connector } from "wagmi";

import { refreshAuthenticatedProfile } from "@/entities/auth/model/session";
import { useAuthStore } from "@/entities/auth/model/store";
import {
  getAuthNonce,
  toAuthSession,
  type AuthNonceData,
  verifyWalletSignature,
  type VerifyWalletSignatureData,
} from "@/shared/api/auth-api";
import { getApiErrorMessage, HttpClientError } from "@/shared/api";
import { env } from "@/shared/config/env";

type ConnectedWallet = {
  address: string;
  chainId: number | null;
};

export type WalletNonceSignatureResult = {
  walletAddress: string;
  nonce: string;
  message: string;
  expiresAt: string;
  signature: string;
};

export type WalletVerifyResult = WalletNonceSignatureResult & {
  auth: VerifyWalletSignatureData;
};

function hasInjectedWallet(): boolean {
  return typeof window !== "undefined" && Reflect.has(window, "ethereum");
}

function isUserRejected(error: unknown): boolean {
  const maybeError = error as { code?: number | string; message?: string; shortMessage?: string };
  const code = Number(maybeError.code);
  const text = `${maybeError.shortMessage ?? ""} ${maybeError.message ?? ""}`.toLowerCase();

  return (
    code === 4001 ||
    text.includes("user rejected") ||
    text.includes("user denied") ||
    text.includes("request rejected") ||
    text.includes("rejected by user")
  );
}

function mapWalletError(
  error: unknown,
  fallback: string,
  rejectedMessage = "Assinatura ou conexao recusada pelo usuario.",
): string {
  if (isUserRejected(error)) {
    return rejectedMessage;
  }
  return getApiErrorMessage(error) || fallback;
}

function mapVerifyError(error: unknown): string {
  if (error instanceof HttpClientError) {
    const message = error.apiError.message.toLowerCase();

    if (error.apiError.statusCode === 400 || error.apiError.statusCode === 422) {
      return error.apiError.message || "Payload de autenticacao invalido.";
    }
    if (error.apiError.statusCode === 401 && message.includes("nonce expir")) {
      return "Nonce expirado. Solicite uma nova assinatura.";
    }
    if (error.apiError.statusCode === 401 && message.includes("nonce")) {
      return "Nonce invalido ou ja utilizado. Solicite uma nova assinatura.";
    }
    if (error.apiError.statusCode === 401 && message.includes("assin")) {
      return "Assinatura invalida. Tente novamente.";
    }
    if (error.apiError.statusCode === 403 && message.includes("wallet autenticada")) {
      return "Carteira autenticada, mas sem perfil cadastrado.";
    }
  }

  return getApiErrorMessage(error) || "Nao foi possivel validar a assinatura.";
}

export function useWalletNonceSignature() {
  const { address, chainId, isConnected } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  const [nonceData, setNonceData] = useState<AuthNonceData | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [verifyData, setVerifyData] = useState<VerifyWalletSignatureData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isRequestingNonce, setIsRequestingNonce] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const expectedChainId = env.chainId || 80002;
  const selectedConnector = useMemo(
    () =>
      connectors.find((connector) => connector.id === "injected") ??
      connectors[0] ??
      null,
    [connectors],
  );

  const walletAddress = address ?? null;
  const isCorrectNetwork = !chainId || chainId === expectedChainId;
  const isBusy = isConnecting || isRequestingNonce || isSigning || isVerifying;

  const resetSignature = useCallback(() => {
    setNonceData(null);
    setSignature(null);
    setVerifyData(null);
    setError(null);
    setVerifyError(null);
  }, []);

  const connectWallet = useCallback(async (): Promise<ConnectedWallet> => {
    setError(null);

    if (!selectedConnector) {
      const message = "Nenhum conector de wallet esta disponivel.";
      setError(message);
      throw new Error(message);
    }

    if (selectedConnector.id === "injected" && !hasInjectedWallet()) {
      const message = "Wallet nao instalada. Instale MetaMask ou uma wallet EVM compativel.";
      setError(message);
      throw new Error(message);
    }

    try {
      const result = await connectAsync({ connector: selectedConnector as Connector });
      const connectedAddress = result.accounts[0];

      if (!connectedAddress) {
        throw new Error("Wallet conectada sem address disponivel.");
      }

      return {
        address: connectedAddress,
        chainId: result.chainId ?? null,
      };
    } catch (connectError) {
      const message = mapWalletError(
        connectError,
        "Nao foi possivel conectar a wallet.",
        "Conexao recusada pelo usuario.",
      );
      setError(message);
      throw connectError;
    }
  }, [connectAsync, selectedConnector]);

  const signNonceMessage = useCallback(async (): Promise<WalletNonceSignatureResult> => {
    setError(null);
    setVerifyError(null);
    setSignature(null);
    setVerifyData(null);
    setNonceData(null);

    if (env.useMocks) {
      const message = "Modo mock ativo. Desative NEXT_PUBLIC_USE_MOCKS para usar wallet real.";
      setError(message);
      throw new Error(message);
    }

    let currentWallet: ConnectedWallet;
    try {
      currentWallet =
        isConnected && walletAddress
          ? { address: walletAddress, chainId: chainId ?? null }
          : await connectWallet();
    } catch (connectError) {
      if (!error) {
        setError(mapWalletError(connectError, "Nao foi possivel conectar a wallet."));
      }
      throw connectError;
    }

    if (!currentWallet.address) {
      const message = "Conecte sua wallet para continuar.";
      setError(message);
      throw new Error(message);
    }

    if (currentWallet.chainId && currentWallet.chainId !== expectedChainId) {
      const message = `Rede incorreta. Conecte sua wallet na chain ${expectedChainId}.`;
      setError(message);
      throw new Error(message);
    }

    setIsRequestingNonce(true);

    try {
      const nonceResponse = await getAuthNonce(currentWallet.address);
      const nextNonceData = nonceResponse.data;

      if (!nextNonceData?.message) {
        throw new Error("Mensagem de autenticacao invalida ou ausente.");
      }

      setNonceData(nextNonceData);
      const nextSignature = await signMessageAsync({
        message: nextNonceData.message,
      });

      if (!nextSignature) {
        throw new Error("Assinatura nao retornada pela wallet.");
      }

      setSignature(nextSignature);

      return {
        walletAddress: nextNonceData.walletAddress,
        nonce: nextNonceData.nonce,
        message: nextNonceData.message,
        expiresAt: nextNonceData.expiresAt,
        signature: nextSignature,
      };
    } catch (signError) {
      const message = mapWalletError(
        signError,
        "Nao foi possivel assinar a mensagem.",
        "Assinatura recusada pelo usuario.",
      );
      setError(message);
      throw signError;
    } finally {
      setIsRequestingNonce(false);
    }
  }, [
    chainId,
    connectWallet,
    error,
    expectedChainId,
    isConnected,
    signMessageAsync,
    walletAddress,
  ]);

  const verifySignedNonce = useCallback(
    async (signed: WalletNonceSignatureResult): Promise<VerifyWalletSignatureData> => {
      setVerifyError(null);
      setVerifyData(null);
      setIsVerifying(true);

      try {
        const verifyResponse = await verifyWalletSignature({
          walletAddress: signed.walletAddress,
          nonce: signed.nonce,
          signature: signed.signature,
        });

        const nextVerifyData = verifyResponse.data;
        if (!nextVerifyData?.accessToken) {
          throw new Error("Sessao nao foi iniciada porque o token nao foi retornado.");
        }

        setVerifyData(nextVerifyData);
        useAuthStore.getState().setSession(toAuthSession(nextVerifyData));
        await refreshAuthenticatedProfile();
        return nextVerifyData;
      } catch (verifyError) {
        const message = mapVerifyError(verifyError);
        setVerifyError(message);
        throw verifyError;
      } finally {
        setIsVerifying(false);
      }
    },
    [],
  );

  const signAndVerifyNonceMessage = useCallback(async (): Promise<WalletVerifyResult> => {
    const signed = await signNonceMessage();
    const auth = await verifySignedNonce(signed);

    return {
      ...signed,
      auth,
    };
  }, [signNonceMessage, verifySignedNonce]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    useAuthStore.getState().clearSession();
    resetSignature();
  }, [disconnect, resetSignature]);

  return {
    walletAddress,
    chainId: chainId ?? null,
    expectedChainId,
    isConnected,
    isCorrectNetwork,
    isConnecting,
    isRequestingNonce,
    isSigning,
    isVerifying,
    isBusy,
    nonceData,
    signature,
    verifyData,
    error,
    verifyError,
    selectedConnector,
    connectWallet,
    disconnectWallet,
    resetSignature,
    signNonceMessage,
    verifySignedNonce,
    signAndVerifyNonceMessage,
  };
}
