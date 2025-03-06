import { UIProvider } from '@ton/blueprint';
import { Address } from '@ton/core';

export async function getFromEnvOrAskUser(
    ui: UIProvider,
    key: string,
    type: 'address',
    prompt: string,
): Promise<Address>;
export async function getFromEnvOrAskUser(ui: UIProvider, key: string, type: 'number', prompt: string): Promise<number>;

export async function getFromEnvOrAskUser(
    ui: UIProvider,
    key: string,
    type: 'address' | 'number',
    prompt: string,
): Promise<Address | number> {
    const value = process.env[key];
    console.log(value);
    if (!value) {
        switch (type) {
            case 'address':
                return ui.inputAddress(prompt);
            case 'number':
                return Number(await ui.input(prompt));
        }
    }

    switch (type) {
        case 'address':
            return Address.parse(value);
        case 'number':
            return Number(value);
    }
}
