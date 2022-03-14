export interface ITeamConfig {
  source: string;
  destination: string;
  required: string;
  teamname: string;
}

export interface IGroupState {
  fullName: string;
  allowtoEdit: boolean;
  flowId: number;
}
export interface ITeamConfigFilter {
  uuidState: string;
}

export interface IStateNodeConfig {
  uuidState: string;
  statename: string;
  priority: string;
  team: string;
  color: string;
  text: string;
}

export interface IStateConditionConfig {
  source: string;
  destination: string;
  fromPort: string;
  toPort: string;
  key: string;
  text: string;
}

export interface IWorkflowDetail {
  flowId: number;
  group: string;
  name: string;
}
export interface IGroupBoard {
  groupName: string;
  uuidgroup: string;
}
export interface ITeam {
  teamName: string;
  uuidteam: string;
}
export interface IGroupBoardFilter {
  flowId: string;
}

export interface IInsertLinkStateConfig {
  flowId: number;
  source: string;
  destination: string;
}
