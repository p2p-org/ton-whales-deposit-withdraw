import { NetworkProvider } from '@ton/blueprint';
import { Pool } from '../wrappers/Pool/Pool';
import { getFromEnvOrAskUser } from '../utils/ui-utils';
import { fromNano, toNano } from '@ton/core';
export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const pool = provider.open(
        Pool.createFromAddress(await getFromEnvOrAskUser(ui, 'POOL_ADDRESS', 'address', 'Enter the pool address:')),
    );

    const amountDeposit = toNano(
        await getFromEnvOrAskUser(ui, 'AMOUNT_DEPOSIT', 'number', 'Enter the amount to deposit (in full TON, e.g 50):'),
    );

    const poolParameters = await pool.getConfigExtra();

    // deposit + fees
    const messageValue = amountDeposit + poolParameters.DepositFee + poolParameters.ReceiptPrice;

    const proceed = await ui.prompt(
        `Sending ${fromNano(messageValue)} TON = ${fromNano(amountDeposit)} TON deposit + ${fromNano(poolParameters.DepositFee)} TON fee + ${fromNano(poolParameters.ReceiptPrice)} TON for gas (leftovers will be refunded)`,
    );

    if (!proceed) {
        return;
    }

    await pool.sendDepositStake(provider.sender(), {
        value: messageValue,
        queryId: Date.now(),
    });
}
