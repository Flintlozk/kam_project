import { ConfigTypeDefs, DealTypeDefs, LoginTypeDefs, TaskTypeDefs } from '@reactor-room/crm-models-lib';
import { LeadTypeDefs } from '@reactor-room/crm-models-lib';
import { merge } from 'lodash';
import { configResolver } from '../controllers/config';
import { dealResolver } from '../controllers/deal';
import { leadResolver } from '../controllers/leads';
import { loginResolver } from '../controllers/login';
import { taskResolver } from '../controllers/task';

export const resolvers = merge(dealResolver, taskResolver, leadResolver, loginResolver, configResolver);

export const typeDefs = [DealTypeDefs, TaskTypeDefs, LeadTypeDefs, LoginTypeDefs, ConfigTypeDefs];
