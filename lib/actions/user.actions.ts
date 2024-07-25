'use server';

import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../server/appwriter';
import { cookies } from 'next/headers';
import { parseStringify } from '../utils';

export const signIn = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error('Please fill in all fields');
    }
    const { account } = await createAdminClient();

    const response = await account.createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', response.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify(response);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to sign in');
  }
};

export const signUp = async (userData: SignUpParams) => {
  try {
    if (
      !userData.dateOfBirth ||
      !userData.ssn ||
      !userData.address1 ||
      !userData.city ||
      !userData.state ||
      !userData.postalCode ||
      !userData.firstName ||
      !userData.lastName
    ) {
      throw new Error('Please fill in all fields');
    }

    const { account } = await createAdminClient();

    const newUser = await account.create(
      ID.unique(),
      userData.email,
      userData.password,
      `${userData.firstName} ${userData.lastName}`
    );
    const session = await account.createEmailPasswordSession(
      userData.email,
      userData.password
    );

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify(newUser) as User;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to create user');
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user) as User;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');

    await account.deleteSession('current');

    return true;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to log out');
  }
}
