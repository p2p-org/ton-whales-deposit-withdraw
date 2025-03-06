import { NetworkProvider } from '@ton/blueprint';
import { Pool } from '../wrappers/Pool/Pool';
import { getFromEnvOrAskUser } from '../utils/ui-utils';
import { fromNano, toNano } from '@ton/core';
export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const pool = provider.open(
        Pool.createFromAddress(await getFromEnvOrAskUser(ui, 'POOL_ADDRESS', 'address', 'Enter the pool address:')),
    );

    const poolParameters = await pool.getConfigExtra();

    const amountWithdraw = toNano(
        await getFromEnvOrAskUser(
            ui,
            'AMOUNT_WITHDRAW',
            'number',
            'Enter the amount to withdraw (in full TON, e.g 50):',
        ),
    );

    const messageValue = poolParameters.WithdrawFee + poolParameters.ReceiptPrice;

    const proceed = await ui.prompt(
        `Sending ${fromNano(messageValue)} TON = ${fromNano(poolParameters.WithdrawFee)} TON withdraw fee + ${fromNano(poolParameters.ReceiptPrice)} TON for gas (leftovers will be refunded). You will receive ${fromNano(amountWithdraw)} TON if you have it on your balance.`,
    );

    await pool.sendWithdrawStaked(provider.sender(), {
        value: poolParameters.WithdrawFee + poolParameters.ReceiptPrice,
        withdrawAmount: amountWithdraw,
    });
}
