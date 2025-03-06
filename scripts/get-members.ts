import { NetworkProvider } from '@ton/blueprint';
import { Pool } from '../wrappers/Pool/Pool';
import { getFromEnvOrAskUser } from '../utils/ui-utils';
export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const pool = provider.open(
        Pool.createFromAddress(await getFromEnvOrAskUser(ui, 'POOL_ADDRESS', 'address', 'Enter the pool address:')),
    );

    // const poolParameters = await pool.getConfigExtra();

    const members = await pool.getMembersRaw();

    console.log(members);
}
