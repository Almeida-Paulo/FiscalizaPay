import { useAuthStore } from "./store";
import { getCurrentProfile, type AuthProfile } from "@/shared/api/auth-api";
import { getApiErrorMessage, HttpClientError } from "@/shared/api";
import { env } from "@/shared/config/env";

const SESSION_EXPIRED_MESSAGE = "Sessao invalida ou expirada. Faca login novamente.";
const FORBIDDEN_MESSAGE = "Voce nao tem permissao para acessar este recurso.";
const PROFILE_NOT_FOUND_MESSAGE = "Perfil autenticado nao encontrado.";

type RefreshAuthenticatedProfileOptions = {
  ignoreMissingToken?: boolean;
};

function isProfileNotFound(error: HttpClientError): boolean {
  return error.apiError.message.toLowerCase().includes("perfil autenticado");
}

export async function refreshAuthenticatedProfile(
  options: RefreshAuthenticatedProfileOptions = {},
): Promise<AuthProfile | null> {
  if (env.useMocks) {
    return useAuthStore.getState().profile;
  }

  const accessToken = useAuthStore.getState().accessToken?.trim();

  if (!accessToken) {
    if (!options.ignoreMissingToken) {
      useAuthStore.getState().setError(SESSION_EXPIRED_MESSAGE);
    }
    return null;
  }

  useAuthStore.getState().setLoading(true);
  useAuthStore.getState().setError(null);

  try {
    const response = await getCurrentProfile();
    const profile = response.data;

    if (!profile) {
      throw new HttpClientError({
        message: PROFILE_NOT_FOUND_MESSAGE,
        code: "UNAUTHORIZED_ROLE",
        statusCode: 401,
      });
    }

    useAuthStore.getState().setAuthenticatedProfile(profile);
    return profile;
  } catch (error) {
    if (error instanceof HttpClientError) {
      if (error.apiError.statusCode === 403) {
        useAuthStore.getState().setLoading(false);
        useAuthStore.getState().setError(FORBIDDEN_MESSAGE);
        throw error;
      }

      if (error.apiError.statusCode === 401) {
        useAuthStore.getState().clearSession();
        useAuthStore.getState().setError(
          isProfileNotFound(error) ? PROFILE_NOT_FOUND_MESSAGE : SESSION_EXPIRED_MESSAGE,
        );
        throw error;
      }
    }

    useAuthStore.getState().setLoading(false);
    useAuthStore.getState().setError(getApiErrorMessage(error));
    throw error;
  }
}
