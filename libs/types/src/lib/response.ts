export type DefaultLoginResponse = {
  token?: string;
} & DefaultResponse;

export type DefaultRefreshResponse = Required<DefaultResponse>;

export type DefaultTwoFaResponse = Required<DefaultResponse>;

export type DefaultResponse = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
};
