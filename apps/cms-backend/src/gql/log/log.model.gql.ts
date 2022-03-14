import gql from 'graphql-tag';

export const LogTypeDefs = gql`
  "Log"
  type LogModel {
    _id: ID
    pageID: Int
    user_id: Int
    type: String
    action: String
    description: String
    user_name: String
    audience_id: Int
    audience_name: String
    created_at: Date
    subject: String
  }

  type LogReturn {
    logs: [LogModel]
    total_rows: Int
  }

  type UserModel {
    user_name: String
    user_id: Int
  }

  input LogInput {
    user_id: Int
    type: String
    action: String
    description: String
    user_name: String
    audience_id: Int
    audience_name: String
    subject: String
    created_at: Date
  }

  input LogFilterInput {
    currentPage: Int
    pageSize: Int
    startDate: String
    endDate: String
    modifiedBy: Int
    orderBy: String
    orderMethod: String
  }

  extend type Query {
    getLog(logFilter: LogFilterInput): LogReturn
    getUsersList: [UserModel]
  }
`;
