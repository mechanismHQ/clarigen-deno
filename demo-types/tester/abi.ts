import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const TesterInterface: ClarityAbi = {
  "functions": [
    {
      "access": "public",
      "args": [
        {
          "name": "n",
          "type": "uint128"
        }
      ],
      "name": "num",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "with-err",
          "type": "bool"
        }
      ],
      "name": "ret-error",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-tup",
      "outputs": {
        "type": {
          "tuple": [
            {
              "name": "a",
              "type": "uint128"
            },
            {
              "name": "b",
              "type": "bool"
            },
            {
              "name": "c",
              "type": {
                "tuple": [
                  {
                    "name": "d",
                    "type": {
                      "string-ascii": {
                        "length": 4
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "n",
          "type": "uint128"
        }
      ],
      "name": "square",
      "outputs": {
        "type": "uint128"
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [],
  "non_fungible_tokens": [],
  "variables": []
};
