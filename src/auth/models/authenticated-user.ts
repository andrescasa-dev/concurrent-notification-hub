import type { User } from '../../users/entities/user.entity';

/** User payload attached to `req.user` after Local or JWT authentication. */
export type AuthenticatedUser = Pick<
  User,
  'id' | 'email' | 'createdAt' | 'updatedAt'
>;
