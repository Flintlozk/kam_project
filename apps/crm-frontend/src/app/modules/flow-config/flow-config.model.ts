export interface ITeamConfig {
  teamname: string;
  source: string;
  destination: string;
  required: string;
}
export interface IWorkflowDetail {
  flowId: number;
  name: string;
}
export interface IGetConfigFiltersInput {
  uuidState: string;
}
export interface IStateNodeConfig {
  uuidState: string;
  statename: string;
  priority: string;
  team: string;
  text: string;
  color: string;
}
export interface IStateConfig {
  stateNode: IStateNodeConfig;
  stateLink: IStateConditionConfig;
}
export interface IGroupBoard {
  groupName: string;
  uuidgroup: string;
}

export interface IStateConditionConfig {
  source: string;
  destination: string;
  fromPort: string;
  toPort: string;
  key: string;
  text: string;
}

export interface IInsertLinkStateConfig {
  flowId: number;
  source: string;
  destination: string;
}

export interface IGroupBoardFilter {
  flowId: string;
}
