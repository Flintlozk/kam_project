import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  CustomerCompaniesFiltersInput,
  CustomerCompany,
  CustomerCompanyFull,
  CustomerCompanyInputFull,
  CompanyMemeber,
  MemebersFiltersInput,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomerCompaniesService {
  constructor(private apollo: Apollo) {}

  private companyInfo = {} as CustomerCompanyFull;
  public companyFullInfo = new BehaviorSubject<CustomerCompanyFull>(this.companyInfo);

  getCompanyMembers(filters: MemebersFiltersInput): Observable<CompanyMemeber[]> {
    const query = gql`
      query getCompanyMembers($filters: MemebersFiltersInput) {
        getCompanyMembers(filters: $filters) {
          id
          psid
          first_name
          last_name
          profile_pic
          line_user_id
          totalrows
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<CompanyMemeber[]>(map((x) => x.data['getCompanyMembers']));
  }

  getCompanyMembersByCompanyID(filters: MemebersFiltersInput, id: number): Observable<CompanyMemeber[]> {
    const query = gql`
      query getCompanyMembersByCompanyID($filters: MemebersFiltersInput) {
        getCompanyMembersByCompanyID(filters: $filters) {
          id
          psid
          first_name
          last_name
          profile_pic
          line_user_id
          totalrows
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          filters: {
            ...filters,
            id,
          },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<CompanyMemeber[]>(map((x) => x.data['getCompanyMembersByCompanyID']));
  }

  getCustomerCompanies(filters: CustomerCompaniesFiltersInput): Observable<CustomerCompany[]> {
    const query = gql`
      query getCustomerCompanies($filters: CustomerCompaniesFiltersInput) {
        getCustomerCompanies(filters: $filters) {
          id
          company_name
          company_logo
          branch_name
          customers_amount
          totalrows
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<CustomerCompany[]>(map((x) => x.data['getCustomerCompanies']));
  }

  getCustomerCompanyById(id: number): Observable<CustomerCompanyFull> {
    const query = gql`
      query getCustomerCompanyById($id: ID) {
        getCustomerCompanyById(id: $id) {
          id
          company_name
          company_logo
          branch_name
          branch_id
          tax_id
          phone_number
          email
          fax
          address
          post_code
          city
          district
          province
          country
          members {
            id
            psid
            first_name
            last_name
            profile_pic
            line_user_id
          }
          use_company_address
          shipping_phone_number
          shipping_email
          shipping_fax
          shipping_address
          shipping {
            post_code
            city
            district
            province
          }
          shipping_country
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<CustomerCompanyFull>(map((x) => x.data['getCustomerCompanyById']));
  }

  saveCustomerCompany(params: CustomerCompanyInputFull): Observable<IHTTPResult> {
    const mutation = gql`
      mutation saveCustomerCompany($params: CustomerCompanyFullInput) {
        saveCustomerCompany(params: $params) {
          status
          value
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          params,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['saveCustomerCompany']));
  }

  updateCustomerCompany(params: CustomerCompanyInputFull): Observable<IHTTPResult> {
    const mutation = gql`
      mutation updateCustomerCompany($params: CustomerCompanyFullInput) {
        updateCustomerCompany(params: $params) {
          status
          value
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          params,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateCustomerCompany']));
  }

  removeCustomerCompany(id: number | number[]): Observable<IHTTPResult> {
    const mutation = gql`
      mutation removeCustomerCompany($id: [Int]) {
        removeCustomerCompany(id: $id) {
          status
          value
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          id,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['removeCustomerCompany']));
  }

  addCompanyByCustomerId(id: number, customer_company_id: number): Observable<IHTTPResult> {
    const mutation = gql`
      mutation addCompanyByCustomerId($id: Int, $customer_company_id: Int) {
        addCompanyByCustomerId(id: $id, customer_company_id: $customer_company_id) {
          status
          value
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          id,
          customer_company_id,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['addCompanyByCustomerId']));
  }

  updateCompanyByCustomerId(id: number, customer_company_id: number): Observable<IHTTPResult> {
    const mutation = gql`
      mutation updateCompanyByCustomerId($id: Int, $customer_company_id: Int) {
        updateCompanyByCustomerId(id: $id, customer_company_id: $customer_company_id) {
          status
          value
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          id,
          customer_company_id,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateCompanyByCustomerId']));
  }

  getCustomerAssignedCompanyById(id: number): Observable<CustomerCompany[]> {
    const query = gql`
      query getCustomerAssignedCompanyById($id: ID) {
        getCustomerAssignedCompanyById(id: $id) {
          id
          company_name
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<CustomerCompany[]>(map((x) => x.data['getCustomerAssignedCompanyById']));
  }
}
