'use server';

import { Client } from 'dwolla-v2';

const getEnvironment = (): 'production' | 'sandbox' => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case 'sandbox':
      return 'sandbox';
    case 'production':
      return 'production';
    default:
      throw new Error(
        'Dwolla environment should either be set to `sandbox` or `production`'
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get('location'));
  } catch (err) {
    console.error(err);
    throw new Error('Creating a Funding Source Failed');
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      'on-demand-authorizations'
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error(err);
    throw new Error('Creating an On Demand Authorization Failed');
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    return await dwollaClient
      .post('customers', newCustomer)
      .then((res) => res.headers.get('location'));
  } catch (err) {
    console.error(err);
    throw new Error('Creating a Dwolla Customer Failed');
  }
};

// TODO Debug this function
export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  // Ensure amount is a number
  const transferAmount = Number(amount);

  if (isNaN(transferAmount) || transferAmount <= 0) {
    throw new Error('Invalid amount provided');
  }

  if (!sourceFundingSourceUrl || !destinationFundingSourceUrl) {
    throw new Error('Source or destination URL is missing');
  }

  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: 'USD',
        value: transferAmount.toFixed(2), // Ensure the amount is formatted correctly
      },
    };

    const response = await dwollaClient.post('transfers', requestBody);
    const location = response.headers.get('location');

    if (!location) {
      throw new Error('Transfer location not found in response');
    }

    return location;
  } catch (err) {
    console.error('Error creating transfer:', err);
    throw new Error('Transfer fund failed');
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error(err);
    throw new Error('Adding a Funding Source Failed');
  }
};
