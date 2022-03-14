export function graphql(url, query, variables) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SHA-KEY': '198f0ef2c31e57198b39e43166b4baf7',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  }).then((r) => r.json());
}

const url = '[[API-SERVER]]/graphql';

const GET_VISITOR_QUERY = `query getVisitor($pageID: Int) {
  getVisitor(pageID: $pageID) {
    pageID
    visitor
  }
}`;

// @ts-ignore
graphql(url, GET_VISITOR_QUERY, { pageID });

const SET_VISITOR_QUERY = `mutation setVisitor($pageID: Int, $visitor: Int) {
  setVisitor(pageID: $pageID, visitor: $visitor) {
    pageID
    visitor
  }
}`;

// @ts-ignore
graphql(url, SET_VISITOR_QUERY, { pageID, visitor: 100 });

let client;

export async function subscribe(operationName, query, variables, next, error, complete) {
  if (!client) {
    const { createClient } = await import('./graphql-ws.js');
    client = createClient({
      url: '[[WS-API-SERVER]]/graphql',
      reconnect: true,
      lazy: true,
    });
  }
  client.subscribe(
    {
      operationName,
      query,
      variables,
    },
    {
      next,
      error,
      complete,
    },
  );
}

const SUBSCRIPTION_VISITOR = `subscription visitorSubscription($pageID: Int) {
  visitorSubscription(pageID: $pageID) {
    pageID: Int
    visitor: Int
  }
}`;

subscribe(
  null,
  SUBSCRIPTION_VISITOR,
  // @ts-ignore
  { pageID },
  (val) => {
    console.log(val);
  },
  (err) => {
    console.error(err);
  },
  () => {
    console.log('complete');
  },
);
