import gql from 'graphql-tag';

export const PaperTypeDefs = gql`
  type GeneratePaperPDFResponse {
    reportUrl: String
    soruceUrl: String
    filename: String
  }

  enum PaperSize {
    SIZE_A4
    SIZE_100x150
  }
  enum PaperType {
    receipt
    receipt_cod
    label
    label_cod
  }

  input InputPaperSetting {
    size: PaperSize
    type: PaperType
  }

  extend type Query {
    generatePaperPDF(orderUUID: String, paperSetting: InputPaperSetting): GeneratePaperPDFResponse
  }
`;
