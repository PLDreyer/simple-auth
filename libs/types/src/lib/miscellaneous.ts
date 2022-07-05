/**
 * Refresh token string container
 */
export class RefreshToken {
  constructor(private readonly value: string) {}
}

/**
 * 2Fa code token string container
 */
export class TwoFaCode {
  constructor(private readonly value: string) {}
}

export class TwoFaToken {
  constructor(private readonly value: string) {}
}
