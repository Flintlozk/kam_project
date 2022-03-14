import gql from 'graphql-tag';

export const ConfigTypeDefs = gql`
  type getTeamConfig {
    teamname: String
    source: String
    destination: String
    required: String
  }
  type getStateByGroup {
    uuidState: String
    statename: String
    priority: String
    team: String
    color: String
    text: String
    key: String
    teamConfigState: [getTeamConfig]
  }
  type getGroupState {
    fullName: String
    allowToEdit: Boolean
    state: [getStateByGroup]
  }
  type getStateConditionByFlow {
    source: String
    destination: String
    fromPort: String
    toPort: String
    key: String
    text: String
  }

  type getTeamUnderGroup {
    teamName: String
    uuidteam: String
  }
  type getWorkFlowUser {
    flowId: Int
    name: String
    workflowNameGroup: String
  }
  input GetTeamConfigInput {
    uuidState: String
  }

  extend type Query {
    getTeamConfig(filters: GetTeamConfigInput): [getTeamConfig]
    getGroupState(flowId: String): [getGroupState]
    getStateByGroup(flowId: String): [getStateByGroup]
    getWorkFlowUser: [getWorkFlowUser]
  }
`;
