export type EndpointOptions = {
  me: {
    enabled: boolean;
    modify: (user: Express.User) => Promise<Record<string | number, unknown>>;
  };
};
