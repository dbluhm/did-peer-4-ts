import {expect, test, describe} from "bun:test";
import { decode, encode } from ".";

const inputDocument = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/x25519-2020/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1",
  ],
  "verificationMethod": [
    {
      "id": "#6LSqPZfn",
      "type": "X25519KeyAgreementKey2020",
      "publicKeyMultibase": "z6LSqPZfn9krvgXma2icTMKf2uVcYhKXsudCmPoUzqGYW24U",
    },
    {
      "id": "#6MkrCD1c",
      "type": "Ed25519VerificationKey2020",
      "publicKeyMultibase": "z6MkrCD1csqtgdj8sjrsu8jxcbeyP6m7LiK87NzhfWqio5yr",
    },
  ],
  "authentication": ["#6MkrCD1c"],
  "assertionMethod": ["#6MkrCD1c"],
  "keyAgreement": ["#6LSqPZfn"],
  "capabilityInvocation": ["#6MkrCD1c"],
  "capabilityDelegation": ["#6MkrCD1c"],
  "service": [
    {
      "id": "#didcommmessaging-0",
      "type": "DIDCommMessaging",
      "serviceEndpoint": {
        "uri": "didcomm:transport/queue",
        "accept": ["didcomm/v2"],
        "routingKeys": [],
      },
    }
  ],
}

describe("Encode<>decode roundtrip", () => {
  test("Encode<>decode roundtrip", () => {
    const encoded = encode(inputDocument);
    console.log(encoded)
    const decoded = decode(encoded);
    console.log(decoded)
    expect(decoded).toStrictEqual(inputDocument);
  });
});
