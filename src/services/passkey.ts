import { Capacitor } from "@capacitor/core";
import { CapacitorPasskey } from "@capgo/capacitor-passkey";

import {
  apiFetch,
  type Employee,
  type Admin,
} from "../api/api";

/* ============================================================
   TYPES
============================================================ */

export interface PasskeyRegistrationOptions {
  challenge: string;

  rp: {
    name: string;
    id?: string;
  };

  user: {
    id: string;
    name: string;
    displayName: string;
  };

  pubKeyCredParams: Array<{
    type: "public-key";
    alg: number;
  }>;

  timeout?: number;

  excludeCredentials?: Array<{
    id: string;
    type: "public-key";
    transports?: string[];
  }>;

  authenticatorSelection?: {
    authenticatorAttachment?:
    | "platform"
    | "cross-platform";

    residentKey?:
    | "required"
    | "preferred"
    | "discouraged";

    requireUserVerification?: boolean;

    requireResidentKey?: boolean;

    userVerification?:
    | "required"
    | "preferred"
    | "discouraged";
  };

  attestation?: string;
}

export interface PasskeyAuthenticationOptions {
  challenge: string;

  rpId?: string;

  timeout?: number;

  allowCredentials?: Array<{
    id: string;
    type: "public-key";
    transports?: string[];
  }>;

  userVerification?:
  | "required"
  | "preferred"
  | "discouraged";
}

/* ============================================================
   PASSKEY LOGIN RESPONSE
============================================================ */

export interface PasskeyLoginResponse {
  message: string;

  token: string;

  role:
  | "user"
  | "admin"
  | "superadmin";

  accountType:
  | "employee"
  | "admin";

  user?: Employee;

  admin?: Admin;
}

/* ============================================================
   BASE64URL → UINT8ARRAY
============================================================ */

const base64UrlToUint8Array = (
  value: string
): Uint8Array => {
  const padding = "=".repeat(
    (4 - (value.length % 4)) % 4
  );

  const base64 =
    value
      .replace(/-/g, "+")
      .replace(/_/g, "/") +
    padding;

  const binary =
    window.atob(base64);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(index);
  }

  return bytes;
};

/* ============================================================
   ARRAYBUFFER → BASE64URL
============================================================ */

const arrayBufferToBase64Url = (
  value: ArrayBuffer
): string => {
  const bytes =
    new Uint8Array(value);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(
      byte
    );
  }

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

/* ============================================================
   REGISTRATION OPTIONS
============================================================ */

const prepareRegistrationOptions = (
  options: PasskeyRegistrationOptions
): PublicKeyCredentialCreationOptions => {
  return {
    ...options,

    challenge:
      base64UrlToUint8Array(
        options.challenge
      ),

    user: {
      ...options.user,

      id:
        base64UrlToUint8Array(
          options.user.id
        ),
    },

    excludeCredentials:
      options.excludeCredentials?.map(
        (credential) => ({
          ...credential,

          id:
            base64UrlToUint8Array(
              credential.id
            ),

          type: "public-key",
        })
      ),
  } as PublicKeyCredentialCreationOptions;
};

/* ============================================================
   AUTHENTICATION OPTIONS
============================================================ */

const prepareAuthenticationOptions = (
  options: PasskeyAuthenticationOptions
): PublicKeyCredentialRequestOptions => {
  return {
    ...options,

    challenge:
      base64UrlToUint8Array(
        options.challenge
      ),

    allowCredentials:
      options.allowCredentials?.map(
        (credential) => ({
          ...credential,

          id:
            base64UrlToUint8Array(
              credential.id
            ),

          type: "public-key",
        })
      ),
  } as PublicKeyCredentialRequestOptions;
};

/* ============================================================
   REGISTRATION CREDENTIAL SERIALIZER
============================================================ */

const serializeRegistrationCredential = (
  credential: PublicKeyCredential
) => {
  const response =
    credential.response as AuthenticatorAttestationResponse;

  return {
    id: credential.id,

    rawId:
      arrayBufferToBase64Url(
        credential.rawId
      ),

    type: credential.type,

    response: {
      clientDataJSON:
        arrayBufferToBase64Url(
          response.clientDataJSON
        ),

      attestationObject:
        arrayBufferToBase64Url(
          response.attestationObject
        ),

      transports:
        typeof response.getTransports ===
          "function"
          ? response.getTransports()
          : undefined,
    },
  };
};

/* ============================================================
   AUTHENTICATION CREDENTIAL SERIALIZER
============================================================ */

const serializeAuthenticationCredential = (
  credential: PublicKeyCredential
) => {
  const response =
    credential.response as AuthenticatorAssertionResponse;

  return {
    id: credential.id,

    rawId:
      arrayBufferToBase64Url(
        credential.rawId
      ),

    type: credential.type,

    response: {
      clientDataJSON:
        arrayBufferToBase64Url(
          response.clientDataJSON
        ),

      authenticatorData:
        arrayBufferToBase64Url(
          response.authenticatorData
        ),

      signature:
        arrayBufferToBase64Url(
          response.signature
        ),

      userHandle:
        response.userHandle
          ? arrayBufferToBase64Url(
            response.userHandle
          )
          : null,
    },
  };
};

/* ============================================================
   INITIALIZE PASSKEY
============================================================ */

export const initializePasskey =
  async (): Promise<boolean> => {
    try {
      if (
        Capacitor.isNativePlatform()
      ) {
        console.log(
          "PASSKEY: Initializing native Capacitor passkey support"
        );

        await CapacitorPasskey.autoShimWebAuthn();

        console.log(
          "PASSKEY: Native WebAuthn shim initialized"
        );
      }

      return true;
    } catch (error) {
      console.error(
        "PASSKEY INITIALIZATION ERROR:",
        error
      );

      return false;
    }
  };

/* ============================================================
   SUPPORT CHECK
============================================================ */

export const isPasskeySupported =
  async (): Promise<boolean> => {
    try {
      if (
        typeof window ===
        "undefined"
      ) {
        return false;
      }

      if (
        !window.PublicKeyCredential
      ) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "PASSKEY SUPPORT CHECK ERROR:",
        error
      );

      return false;
    }
  };

/* ============================================================
   REGISTER PASSKEY
============================================================ */

export const registerPasskey =
  async (): Promise<{
    verified: boolean;
    message: string;
    accountType?:
    | "employee"
    | "admin";
    role?:
    | "user"
    | "admin"
    | "superadmin";
  }> => {
    try {
      console.log(
        "PASSKEY: Requesting registration options"
      );

      const options =
        await apiFetch<PasskeyRegistrationOptions>(
          "/api/auth/passkey/register/options",
          {
            method: "POST",
          }
        );

      console.log(
        "PASSKEY: Registration options received"
      );

      const publicKeyOptions =
        prepareRegistrationOptions(
          options
        );

      console.log(
        "PASSKEY: Calling navigator.credentials.create"
      );

      const credential =
        await navigator.credentials.create({
          publicKey:
            publicKeyOptions,
        });

      console.log(
        "PASSKEY: navigator.credentials.create finished",
        credential
      );

      if (!credential) {
        throw new Error(
          "Passkey registration was cancelled."
        );
      }

      const serializedCredential =
        serializeRegistrationCredential(
          credential as PublicKeyCredential
        );

      console.log(
        "PASSKEY: Sending credential to backend"
      );

      const response =
        await apiFetch<{
          verified: boolean;
          message: string;
          accountType?:
          | "employee"
          | "admin";
          role?:
          | "user"
          | "admin"
          | "superadmin";
        }>(
          "/api/auth/passkey/register/verify",
          {
            method: "POST",
            body: JSON.stringify(
              serializedCredential
            ),
          }
        );

      console.log(
        "PASSKEY: Registration verification response",
        response
      );

      if (!response.verified) {
        throw new Error(
          response.message ||
          "Passkey registration failed."
        );
      }

      return response;
    } catch (error) {
      console.error(
        "PASSKEY REGISTRATION ERROR:",
        error
      );

      if (
        error instanceof Error
      ) {
        throw error;
      }

      throw new Error(
        "Passkey registration failed."
      );
    }
  };

/* ============================================================
   LOGIN WITH PASSKEY
============================================================ */

export const loginWithPasskey =
  async (
    identifier: string
  ): Promise<PasskeyLoginResponse> => {
    const cleanIdentifier =
      identifier.trim();

    if (!cleanIdentifier) {
      throw new Error(
        "Username, Resident ID number, or email is required."
      );
    }

    console.log(
      "PASSKEY: Requesting authentication options"
    );

    const options =
      await apiFetch<PasskeyAuthenticationOptions>(
        "/api/auth/passkey/login/options",
        {
          method: "POST",

          body: JSON.stringify({
            identifier:
              cleanIdentifier,
          }),
        }
      );

    console.log(
      "PASSKEY: Authentication options received"
    );

    const publicKeyOptions =
      prepareAuthenticationOptions(
        options
      );

    console.log(
      "PASSKEY: Calling navigator.credentials.get"
    );

    const credential =
      await navigator.credentials.get({
        publicKey:
          publicKeyOptions,
      });

    console.log(
      "PASSKEY: navigator.credentials.get finished",
      credential
    );

    if (!credential) {
      throw new Error(
        "Passkey authentication was cancelled."
      );
    }

    console.log(
      "PASSKEY: Sending authentication credential to backend"
    );

    const response =
      await apiFetch<PasskeyLoginResponse>(
        "/api/auth/passkey/login/verify",
        {
          method: "POST",

          body: JSON.stringify({
            identifier:
              cleanIdentifier,

            response:
              serializeAuthenticationCredential(
                credential as PublicKeyCredential
              ),
          }),
        }
      );

    console.log(
      "PASSKEY: Login verification response",
      response
    );

    return response;
  };

/* ============================================================
   PASSKEY STATUS
============================================================ */

export const getPasskeyStatus =
  async (): Promise<{
    hasPasskey: boolean;

    accountType:
    | "employee"
    | "admin";

    role?:
    | "user"
    | "admin"
    | "superadmin";
  }> => {
    return apiFetch<{
      hasPasskey: boolean;

      accountType:
      | "employee"
      | "admin";

      role?:
      | "user"
      | "admin"
      | "superadmin";
    }>(
      "/api/auth/passkey/status",
      {
        method: "GET",
      }
    );
  };