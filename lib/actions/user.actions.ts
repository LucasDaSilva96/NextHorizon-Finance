'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../server/appwriter';
import { cookies } from 'next/headers';
import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils';
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';
import { plaidClient } from '../plaid';
import { revalidatePath } from 'next/cache';
import { addFundingSource, createDwollaCustomer } from './dwolla.actions';

const {
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_BANKS_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );

    if (!user || !user.documents) {
      throw new Error('Failed to get bank');
    }

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error('An error occurred while getting the user:', error);
    throw new Error('Failed to get user ❌');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error('Please fill in all fields');
    }
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to sign in');
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  let newUserAccount;

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

    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      userData.email,
      password,
      `${userData.firstName} ${userData.lastName}`
    );

    if (!newUserAccount) {
      throw new Error('Failed to create new user account');
    }

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: 'personal',
    });

    if (!dwollaCustomerUrl) {
      throw new Error('Failed to create Dwolla customer');
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    const session = await account.createEmailPasswordSession(
      userData.email,
      password
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
    throw new Error('Failed to create user ❌');
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

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
    throw new Error('Failed to log out ❌');
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create link token ❌');
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANKS_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create bank account ❌');
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // Get access token and item id
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account data
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create processor token
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );

    const processorToken = processorTokenResponse.data.processor_token;

    // Add funding source
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) {
      throw new Error('Failed to add funding source');
    }

    // Create bank account
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    // Revalidate cache
    revalidatePath('/');

    // Return success
    return parseStringify({
      publicTokenExchange: 'success',
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to exchange public token ❌');
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANKS_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );

    if (!banks || !banks.documents) {
      throw new Error('Failed to get banks');
    }

    return parseStringify(banks.documents);
  } catch (error) {
    console.error('An error occurred while getting the banks:', error);
    throw new Error('Failed to get banks ❌');
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANKS_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    );

    if (!bank || !bank.documents) {
      throw new Error('Failed to get bank');
    }

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error('An error occurred while getting the bank:', error);
    throw new Error('Failed to get bank ❌');
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANKS_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    );

    if (!bank || !bank.documents) {
      throw new Error('Failed to get bank');
    }

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error('An error occurred while getting the bank:', error);
    throw new Error('Failed to get bank ❌');
  }
};
