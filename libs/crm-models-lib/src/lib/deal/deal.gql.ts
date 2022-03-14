import gql from 'graphql-tag';

export const DealTypeDefs = gql`
  type DealDetail {
    dealtitle: String
    projectNumber: String
    startDate: String
    endDate: String
    advertiseBefore: Boolean
    paymentDetail: String
    productService: String
    objective: String
    target: String
    adsOptimizeFee: String
    adsSpend: String
    tagDealList: [tagDeal]
    noteDetail: String
    uuidTask: String
    accountExecutive: String
    projectManager: String
    headOfClient: String
  }
  type tagDeal {
    tagName: String
    tagColor: String
    tagDealId: Int
  }
  input InsertDealDetailinput {
    dealtitle: String
    projectNumber: String
    startDate: String
    endDate: String
    advertiseBefore: Boolean
    paymentDetail: String
    productService: String
    objective: String
    target: String
    adsOptimizeFee: String
    adsSpend: String
    tagDealList: [Int]
    noteDetail: String
    uuidTask: String
    accountExecutive: String
    projectManager: String
    headOfClient: String
  }
  input UpdateDealDetailinput {
    dealtitle: String
    projectNumber: String
    startDate: String
    endDate: String
    advertiseBefore: Boolean
    paymentDetail: String
    productService: String
    objective: String
    target: String
    adsOptimizeFee: String
    adsSpend: String
    tagDealList: [Int]
    noteDetail: String
    uuidDeal: String
    accountExecutive: String
    projectManager: String
    headOfClient: String
    uuidTask: String
  }
  type ProjectCode {
    projectCode: String
    uuidDeal: String
    dealTitle: String
    companyName: String
  }
  input InsertDeal {
    uuidDeal: String
    uuidTask: String
  }
  input FilterDeal {
    filter: String
    uuidTask: String
  }
  extend type Query {
    getDealDetailByUuidDeal(uuidDeal: String): DealDetail
    getTagDealByDealId(dealId: Int): [Int]
    getTagDealByOwner: [tagDeal]
    getProjectCodeOfDeal(message: FilterDeal): [ProjectCode]
  }
  extend type Mutation {
    insertDealDetailByTask(message: InsertDealDetailinput): HTTPResult
    updateDealDetailByUuidDeal(message: UpdateDealDetailinput): HTTPResult
    deleteDealDetailByUuidDeal(message: InsertDeal): HTTPResult
    insertDealToTask(message: InsertDeal): HTTPResult
  }
`;
