import { NetworkProvider } from '@ton/blueprint';
import { Pool } from '../wrappers/Pool/Pool';
import { toNano } from '@ton/core';
import { getFromEnvOrAskUser } from '../utils/ui-utils';
export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const pool = provider.open(
        Pool.createFromAddress(await getFromEnvOrAskUser(ui, 'POOL_ADDRESS', 'address', 'Enter the pool address:')),
    );

    await pool.sendRecoverStake(provider.sender(), {
        value: toNano('2.0'),
        queryId: Date.now(),
    });
}
