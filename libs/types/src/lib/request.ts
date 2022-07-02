export type LoginRequest = {
  [key: string]: string | boolean;
} & { rememberMe?: boolean };

export type TwoFaRequest = {
  token: string;
  code: string;
};

export type RefreshRequest = {};
