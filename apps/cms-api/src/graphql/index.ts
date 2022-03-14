import { merge } from 'lodash';
import { VisitorTypeDefs } from '../gql/visitor.gql';
import { visitorResolver } from '../controllers/visitor/visitor.controller';

export const resolvers = merge(visitorResolver);
export const typeDefs = [VisitorTypeDefs];
