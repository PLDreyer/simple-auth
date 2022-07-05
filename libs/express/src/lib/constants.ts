export const AUTH_HANDLER = 'AUTH_HANDLER;';

export type StrategyCallback = (
  error: unknown,
  user: unknown,
  info: unknown
) => void;
