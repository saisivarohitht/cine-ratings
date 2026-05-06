import { cookies } from 'next/headers';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';

const USERS_COLLECTION = 'users';
const SESSION_COOKIE_NAME = 'cine-session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const SESSION_SECRET = process.env.AUTH_SECRET || 'default-dev-secret';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@cine-ratings.local';
const ADMIN_USER_ID = 'admin';
const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = 'sha512';

export type PublicUser = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
};

type UserRecord = {
  _id: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user._id.toHexString(),
    username: user.username,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    isAdmin: false,
  };
}

function getAdminPublicUser(): PublicUser {
  return {
    id: ADMIN_USER_ID,
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    isAdmin: true,
  };
}

async function getUsersCollection() {
  const client = await clientPromise;
  return client.db().collection<UserRecord>(USERS_COLLECTION);
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    PASSWORD_ITERATIONS,
    PASSWORD_KEY_LENGTH,
    PASSWORD_DIGEST
  ).toString('hex');

  return `${PASSWORD_ITERATIONS}:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [iterationsText, salt, expectedHash] = storedHash.split(':');

  if (!iterationsText || !salt || !expectedHash) {
    return false;
  }

  const iterations = Number(iterationsText);

  if (!Number.isFinite(iterations) || iterations < 1) {
    return false;
  }

  const derivedHash = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    expectedHash.length / 2,
    PASSWORD_DIGEST
  ).toString('hex');

  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const actualBuffer = Buffer.from(derivedHash, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function signSession(expiresAt: number) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(String(expiresAt)).digest('hex');
}

function signRecoveryToken(userId: string, expiresAt: number) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(`recovery.${userId}.${expiresAt}`).digest('hex');
}

function signSessionPayload(userId: string, expiresAt: number) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(`${userId}.${expiresAt}`).digest('hex');
}

function buildSessionToken(userId: string, expiresAt: number) {
  return `${userId}.${expiresAt}.${signSessionPayload(userId, expiresAt)}`;
}

function isValidSignature(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected, 'hex');
  const actualBuffer = Buffer.from(actual, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

export async function createSession(userId: string) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const token = buildSessionToken(userId, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const [userId, expiresAtString, signature] = token.split('.');

  if (!userId || !expiresAtString || !signature) {
    return false;
  }

  const expiresAt = Number(expiresAtString);

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const expectedSignature = signSessionPayload(userId, expiresAt);
  return isValidSignature(expectedSignature, signature);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function findUserByUsername(username: string) {
  const users = await getUsersCollection();
  return users.findOne({ username: normalizeUsername(username) });
}

export async function findUserById(userId: string) {
  if (userId === ADMIN_USER_ID) {
    return {
      _id: new ObjectId('000000000000000000000000'),
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash: '',
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  }

  const users = await getUsersCollection();

  try {
    return users.findOne({ _id: new ObjectId(userId) });
  } catch {
    return null;
  }
}

export async function createUserWithEmail(input: { username: string; email: string; password: string }) {
  const users = await getUsersCollection();
  const now = new Date();
  const normalizedUsername = normalizeUsername(input.username);
  const normalizedEmail = input.email.trim().toLowerCase();

  const existingUser = await users.findOne({
    $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
  });

  if (existingUser) {
    throw new Error('An account with this username or email already exists');
  }

  const passwordHash = hashPassword(input.password);

  const result = await users.insertOne({
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  const user = await users.findOne({ _id: result.insertedId });

  if (!user) {
    throw new Error('Failed to create account');
  }

  return toPublicUser(user);
}

export async function createUser(input: { username: string; email: string; password: string }) {
  return createUserWithEmail(input);
}

export async function authenticateUser(input: { username: string; password: string }) {
  if (normalizeUsername(input.username) === normalizeUsername(ADMIN_USERNAME) && input.password === ADMIN_PASSWORD) {
    return getAdminPublicUser();
  }

  const user = await findUserByUsername(input.username);

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    return null;
  }

  return toPublicUser(user);
}

export async function getSessionUser(token: string) {
  if (!(await validateSession(token))) {
    return null;
  }

  const [userId] = token.split('.');

  if (!userId) {
    return null;
  }

  if (userId === ADMIN_USER_ID) {
    return getAdminPublicUser();
  }

  const user = await findUserById(userId);

  return user ? toPublicUser(user) : null;
}

export async function createPasswordResetToken(userId: string) {
  const expiresAt = Date.now() + 60 * 60 * 1000;
  const signature = signRecoveryToken(userId, expiresAt);

  return `${userId}.${expiresAt}.${signature}`;
}

export async function validatePasswordResetToken(token: string) {
  if (!token) {
    return null;
  }

  const [userId, expiresAtString, signature] = token.split('.');

  if (!userId || !expiresAtString || !signature) {
    return null;
  }

  const expiresAt = Number(expiresAtString);

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return null;
  }

  const expectedSignature = signRecoveryToken(userId, expiresAt);

  if (!isValidSignature(expectedSignature, signature)) {
    return null;
  }

  return userId;
}

export async function resetPasswordWithToken(token: string, password: string) {
  const userId = await validatePasswordResetToken(token);

  if (!userId) {
    throw new Error('Reset link is invalid or expired');
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error('Reset link is invalid or expired');
  }

  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        passwordHash: hashPassword(password),
        updatedAt: new Date(),
      },
    }
  );

  return toPublicUser({ ...user, passwordHash: user.passwordHash, updatedAt: new Date() });
}
