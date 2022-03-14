# Usage

Just add Init function to resolvers. Don't forget to pass JSON db.

```ts
import { merge } from 'lodash';
import { addressDataResolverInit, AddressDataTypeDefs } from '@reactor-room/itopplus-back-end-helpers';

export const resolvers = merge(...[], addressDataResolverInit(require('../assets/static/address-database.json')), ...[]);

export const typeDefs = [AddressDataTypeDefs];
```
