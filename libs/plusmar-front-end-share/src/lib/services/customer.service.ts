import { Injectable } from '@angular/core';
import { IDObject, IFacebookCredential, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import {
  CustomerFilters,
  CustomerOrders,
  CustomerOrdersFilters,
  ICustomerNote,
  ICustomerTagCRUD,
  ICustomerTagSLA,
  ICustomerTemp,
  ICustomerTempInput,
  ICustomerUpdateInfoInput,
  IUpsertCompany,
  RemoveUserResponse,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  removableKeys = ['ID', 'profileImg', 'accessToken'];
  credentials: ICustomerTemp;

  constructor(private apollo: Apollo) {
    this.credentials = JSON.parse(localStorage.getItem('customer')) as ICustomerTemp;
  }

  add(credential: IFacebookCredential): Observable<ICustomerTemp> {
    const customer = { ...credential };
    customer['Facebook'] = {};
    customer['Facebook']['ASID'] = customer['ID'];
    customer['Facebook']['profile_pic'] = customer['profileImg'];
    customer['Facebook']['accessToken'] = customer['accessToken'];

    this.removableKeys.forEach((key) => {
      if (customer.hasOwnProperty(key)) {
        delete customer[key];
      }
    });

    const mutation = gql`
      mutation addCustomer($customer: CustomerModelInput) {
        addCustomer(customer: $customer) {
          id
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation: mutation,
        variables: {
          customer: { ...customer },
        },
      })
      .pipe<ICustomerTemp>(map((x) => x.data['addCustomer']));
  }

  updateCustomer(customer: ICustomerTemp): Observable<ICustomerTemp> {
    const mutation = gql`
      mutation updateCustomer($customer: CustomerModelInput) {
        updateCustomer(customer: $customer) {
          id
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          customer,
        },
      })
      .pipe<ICustomerTemp>(map((x) => x.data['updateCustomer']));
  }

  updateCustomerByForm(customer: ICustomerUpdateInfoInput): Observable<IHTTPResult> {
    const mutation = gql`
      mutation updateCustomerByForm($customer: UpdateCustomerInput) {
        updateCustomerByForm(customer: $customer) {
          status
          value
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          customer,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateCustomerByForm']));
  }

  upsertCustomerCompany(customer: IUpsertCompany): Observable<IHTTPResult> {
    const mutation = gql`
      mutation upsertCustomerCompany($customer: CompanyUpsertInput) {
        upsertCustomerCompany(customer: $customer) {
          status
          value
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          customer,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['upsertCustomerCompany']));
  }

  updateCustomerCanReply(params: ICustomerTempInput): Observable<IHTTPResult> {
    const mutation = gql`
      mutation updateCustomerCanReply($params: CustomerModelInput) {
        updateCustomerCanReply(params: $params) {
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
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateCustomerCanReply']));
  }

  removeCustomer(id: string): Observable<RemoveUserResponse> {
    const mutation = gql`
      mutation removeCustomer($id: String) {
        removeCustomer(id: $id) {
          id
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
      .pipe<RemoveUserResponse>(map((x) => x.data['removeCustomer']));
  }

  blockCustomer(id: string): Observable<RemoveUserResponse> {
    const mutation = gql`
      mutation blockCustomer($id: String) {
        blockCustomer(id: $id) {
          id
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
      .pipe<RemoveUserResponse>(map((x) => x.data['blockCustomer']));
  }

  unblockCustomer(id: string): Observable<RemoveUserResponse> {
    const mutation = gql`
      mutation unblockCustomer($id: String) {
        unblockCustomer(id: $id) {
          id
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
      .pipe<RemoveUserResponse>(map((x) => x.data['unblockCustomer']));
  }

  getByASID(credentials: IFacebookCredential): Observable<ICustomerTemp> {
    const { ID: ASID } = credentials;
    const query = gql`
      query getCustomerByASID($ASID: String) {
        getCustomerByASID(ASID: $ASID) {
          id
          first_name
          last_name
          email
          phone_number
          customer_type
          profile_pic
          notes
          nickname
          active
          totalrows
          created_at
          updated_at
          deleted_at
        }
      }
    `;
    return this.apollo
      .query({
        query: query,
        variables: {
          ASID: ASID,
        },
      })
      .pipe<ICustomerTemp | null>(map((x) => x.data['getCustomerByASID']));
  }

  getCustomerById(id: string | number): Observable<ICustomerTemp> {
    const query = gql`
      query getCustomerByID($id: Int) {
        getCustomerByID(id: $id) {
          id
          first_name
          last_name
          email
          phone_number
          platform
          aliases
          tags {
            tagMappingID
            name
            color
          }
          location {
            address
            district
            province
            city
            post_code
            country
          }
          social {
            Facebook
            Line
            Instagram
            Twitter
            Google
            Youtube
          }
          notes
          profile_pic
          created_at
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
      .pipe<ICustomerTemp | null>(map((x) => x.data['getCustomerByID']));
  }

  getCustomers(filters: CustomerFilters): Observable<ICustomerTemp[]> {
    const query = gql`
      query getCustomers($filters: CustomerFiltersInput) {
        getCustomers(filters: $filters) {
          id
          nickname
          first_name
          last_name
          phone_number
          location {
            address
            district
            province
            city
            amphoe
            post_code
            country
          }
          tags {
            id
            name
            color
            tagMappingID
          }
          notes
          profile_pic
          email
          updated_at
          blocked
          totalrows
          psid
          platform
          aliases
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
      .pipe<ICustomerTemp[]>(map((x) => x.data['getCustomers']));
  }

  getCustomerOrdersById(filters: CustomerOrdersFilters): Observable<CustomerOrders[]> {
    const query = gql`
      query getCustomerOrdersById($filters: CustomerOrdersFilters) {
        getCustomerOrdersById(filters: $filters) {
          id
          total_price
          created_at
          po_status
          a_status
          payment_type
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
      .pipe<CustomerOrders[]>(map((x) => x.data['getCustomerOrdersById']));
  }

  createNewCustomer(params: ICustomerTemp): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation createNewCustomer($params: CustomerModelInput) {
          createNewCustomer(params: $params) {
            status
            value
          }
        }
      `,
      context: {
        useMultipart: true,
      },
      variables: {
        params,
      },
    });

    return mutate.pipe(map((x) => x.data['createNewCustomer']));
  }

  crudCustomerTagData(customerTagData: ICustomerTagCRUD[], operationType: string): Observable<IHTTPResult[]> {
    const crudCustomerTagData = this.apollo.mutate({
      mutation: gql`
        mutation crudCustomerTagData($customerTagData: [CustomerCrudTagDataInput], $operationType: String) {
          crudCustomerTagData(customerTagData: $customerTagData, operationType: $operationType) {
            status
            value
          }
        }
      `,
      variables: {
        customerTagData,
        operationType,
      },
      fetchPolicy: 'no-cache',
    });
    return crudCustomerTagData.pipe(map((x) => x.data['crudCustomerTagData']));
  }

  //this function return all tags which are associated or not associated to customer
  getCustomerTagByPageByID(id: number): Observable<ICustomerTagCRUD[]> {
    return this.apollo
      .query({
        query: gql`
          query getCustomerTagByPageByID($id: Int) {
            getCustomerTagByPageByID(id: $id) {
              id
              tagMappingID
              name
              color
            }
          }
        `,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getCustomerTagByPageByID']));
  }

  getCustomerAllTags(): Observable<ICustomerTagCRUD[]> {
    return this.apollo
      .query({
        query: gql`
          query getCustomerAllTags {
            getCustomerAllTags {
              id
              name
              color
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getCustomerAllTags']));
  }
  getCustomerSLAAllTags(refetch = false): Observable<ICustomerTagSLA[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getCustomerSLAAllTags {
          getCustomerSLAAllTags {
            id
            name
            customer
            total
            alert
            color
          }
        }
      `,
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(map((response) => response.data['getCustomerSLAAllTags']));
  }
  getCustomerSLAAllAssginee(refetch = false): Observable<ICustomerTagSLA[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getCustomerSLAAllAssginee {
          getCustomerSLAAllAssginee {
            id
            name
            profileImg
            customer
            total
            alert
            color
          }
        }
      `,
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(map((response) => response.data['getCustomerSLAAllAssginee']));
  }

  getCustomerTags(filters: ITableFilter): Observable<ICustomerTagCRUD[]> {
    return this.apollo
      .query({
        query: gql`
          query getCustomerTags($filters: TableFilterInput) {
            getCustomerTags(filters: $filters) {
              id
              name
              color
              totalrows
              users {
                userID
                userName
                profileImg
              }
            }
          }
        `,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getCustomerTags']));
  }

  getPreviousAudienceIDbyCustomerID(customerID: number, index: number): Observable<IDObject[]> {
    return this.apollo
      .query({
        query: gql`
          query getPreviousAudienceIDbyCustomerID($customerID: Int, $index: Int) {
            getPreviousAudienceIDbyCustomerID(customerID: $customerID, index: $index) {
              id
            }
          }
        `,
        variables: {
          customerID,
          index,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getPreviousAudienceIDbyCustomerID']));
  }

  upsertNote(params: ICustomerNote): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation upsertNote($params: NoteInput) {
          upsertNote(params: $params) {
            status
            value
          }
        }
      `,
      variables: {
        params,
      },
    });

    return mutate.pipe(map((x) => x.data['upsertNote']));
  }

  editNote(params: ICustomerNote): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation editNote($params: NoteInput) {
          editNote(params: $params) {
            status
            value
          }
        }
      `,
      variables: {
        params,
      },
    });

    return mutate.pipe(map((x) => x.data['editNote']));
  }

  removeNote(params: ICustomerNote): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation removeNote($params: NoteInput) {
          removeNote(params: $params) {
            status
            value
          }
        }
      `,
      variables: {
        params,
      },
    });

    return mutate.pipe(map((x) => x.data['removeNote']));
  }

  getNotes(id: number): Observable<ICustomerNote[]> {
    const query = gql`
      query getNotes($id: ID) {
        getNotes(id: $id) {
          id
          note
          name
          updated_at
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
      .pipe<ICustomerNote[]>(map((x) => x.data['getNotes']));
  }
}
