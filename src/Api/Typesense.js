const Typesense = require("typesense");
const API = process.env.REACT_APP_TYPESENSE_API;

export let clientTypessense = new Typesense.Client({
  nodes: [
    {
      host: "bynu8vp41sx3m0zwp-1.a1.typesense.net", // For Typesense Cloud use xxx.a1.typesense.net
      port: "443", // For Typesense Cloud use 443
      protocol: "https", // For Typesense Cloud use https
    },
  ],
  apiKey: API,
  connectionTimeoutSeconds: 2,
});
