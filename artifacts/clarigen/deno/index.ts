import { contracts } from "../index.ts";
export { contracts } from "../index.ts";

export const accounts = {
  "deployer": {
    "address": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "balance": 100000000000000,
  },
  "wallet_1": {
    "address": "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
    "balance": 100000000000000,
  },
  "wallet_2": {
    "address": "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
    "balance": 100000000000000,
  },
  "wallet_3": {
    "address": "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC",
    "balance": 100000000000000,
  },
  "wallet_4": {
    "address": "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
    "balance": 100000000000000,
  },
  "wallet_5": {
    "address": "ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB",
    "balance": 100000000000000,
  },
  "wallet_6": {
    "address": "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0",
    "balance": 100000000000000,
  },
  "wallet_7": {
    "address": "ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ",
    "balance": 100000000000000,
  },
  "wallet_8": {
    "address": "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP",
    "balance": 100000000000000,
  },
  "wallet_9": {
    "address": "STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6",
    "balance": 100000000000000,
  },
} as const;

export const simnet = {
  accounts,
  contracts,
} as const;
