
import { Big } from 'big.js';
export const formatBalance = (amount: string, dec: any = 8): string => {
    if (!amount || !dec) {
        return "";
    }

    const bigBalance = new Big(amount);
    if (bigBalance.eq(0)) {
        return "0";
    }

    const result = bigBalance.div(10 ** Number(dec));

    const thresholds = [
        { limit: new Big("10000000"), decimals: 0 },
        { limit: new Big("10000"), decimals: 2 },
        { limit: new Big("10"), decimals: 4 }
    ];

    for (const { limit, decimals } of thresholds) {
        if (result.gte(limit)) {
            return result.round(decimals, Big.roundDown).toFixed(decimals).replace(/\.?0+$/, "");
        }
    }

    return result.round(8, Big.roundDown).toFixed(8).replace(/\.?0+$/, "");
};

export const formatDecBalance = (amount: string, dec: string): BigInt => {
    if (amount === "" || dec === "") {
        return BigInt("")
    }
    return (BigInt(amount) / BigInt(10 ** Number(dec)))
}


export const toTokenUnits = (amount: number | string, decimals: number | string): bigint => {
    const amountStr = String(amount);
    let decNumber = Number(decimals);
    decNumber = isNaN(decNumber) ? 0 : decNumber;
    const [intPart, fracPart = ""] = amountStr.split(".");
    const paddedFrac = (fracPart + "0".repeat(decNumber)).slice(0, decNumber);
    return BigInt(intPart + paddedFrac);
}