import { fastify } from './fastify';

describe('fastify', () => {
  it('should work', () => {
    expect(fastify()).toEqual('fastify');
  });
});
