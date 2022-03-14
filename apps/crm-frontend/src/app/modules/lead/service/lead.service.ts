import { Injectable, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';
import { ICount, IHTTPResult, IInsertLeadRespone, ILeadSettings, IPaginationPage, IUUIDCompany } from '@reactor-room/crm-models-lib';

import { IBusinessType, ILead, ITagLead } from '@reactor-room/crm-models-lib';
import { ITaskDetail } from '../../task/task.model';

@Injectable({
  providedIn: 'root',
})
export class LeadService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  constructor(private apollo: Apollo) {}

  getLeadsContact(pagination: IPaginationPage): Observable<ILead[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getLeadsContact($pagination: Pagination_PageInput) {
          getLeadsContact(pagination: $pagination) {
            companyname
            uuidCompany
            primaryContactList {
              name
              email
              phoneNumber
            }
            createBy
            profilePic
            active
          }
        }
      `,
      variables: {
        pagination: pagination,
      },
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getLeadsContact']),
    );
  }
  getInActiveLeadsContact(pagination: IPaginationPage): Observable<ILead[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getInActiveLeadsContact($pagination: Pagination_PageInput) {
          getInActiveLeadsContact(pagination: $pagination) {
            companyname
            uuidCompany
            primaryContactList {
              name
              email
              phoneNumber
            }
            createBy
            profilePic
            active
          }
        }
      `,
      variables: {
        pagination: pagination,
      },
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getInActiveLeadsContact']),
    );
  }
  getTotalLead(): Observable<ICount> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getTotalLead {
          getTotalLead {
            activeLead
            inActiveLead
          }
        }
      `,
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getTotalLead']),
    );
  }

  deleteCompanyContact(deleteCompanyContactList: any): Observable<IHTTPResult> {
    deleteCompanyContactList = deleteCompanyContactList.map((companycontact) => {
      const container = {};
      container['uuidCompany'] = companycontact.uuidCompany;
      return container;
    });
    const deleteCompanyUUIDList = { companyinputlist: deleteCompanyContactList };

    return this.apollo
      .mutate({
        mutation: gql`
          mutation deleteCompanyContact($deleteCompanyContact: ConmpanyInputList) {
            deleteCompanyContact(deleteCompanyContact: $deleteCompanyContact) {
              status
              value
            }
          }
        `,
        variables: {
          deleteCompanyContact: deleteCompanyUUIDList,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteCompanyContact']),
      );
  }
  getContactbyLead(uuidCompany: string): Observable<ILead[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getLeadsContactByUUIDCompany($uuidCompany: String) {
          getLeadsContactByUUIDCompany(uuidCompany: $uuidCompany) {
            companyname
            uuidCompany
            note
            companyContactList {
              uuidname
              name
              email
              phoneNumber
              primarycontact
              position
              lineId
            }
          }
        }
      `,
      variables: {
        uuidCompany: uuidCompany,
      },
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getLeadsContactByUUIDCompany']),
    );
  }
  getTaskDetailForOpenTask(uuidCompany: string): Observable<ITaskDetail[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getLeadsContactByUUIDCompany($uuidCompany: String) {
          getLeadsContactByUUIDCompany(uuidCompany: $uuidCompany) {
            companyname
            uuidCompany
            contactTask {
              name
              email
              phoneNumber
              lineId
              position
            }
            getAllUser {
              name
              email
              profilePic
              lineId
              position
            }
            userWorkflow {
              flowname
            }
          }
        }
      `,
      variables: {
        uuidCompany: uuidCompany,
      },
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getLeadsContactByUUIDCompany']),
    );
  }
  getLeadsContactByUUIDCompany(uuidCompany: string): Observable<ILead[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getLeadsContactByUUIDCompany($uuidCompany: String) {
          getLeadsContactByUUIDCompany(uuidCompany: $uuidCompany) {
            companyname
            uuidCompany
            businesstype
            website
            taxIdNo
            projectNumber
            addressList {
              address
              city
              province
              district
              postalcode
              uuidAddress
            }
            companyContactList {
              uuidname
              name
              email
              phoneNumber
              primarycontact
              lineId
              position
            }
            tagLeadList {
              tagname
            }
            noteLeadList {
              uuidnote
              notedetail
              createby
              createdate
              readonly
            }
          }
        }
      `,
      variables: {
        uuidCompany: uuidCompany,
      },
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getLeadsContactByUUIDCompany']),
    );
  }

  updateCompanyContact(updateCompanyContact: ILead): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateCompanyContact($updateCompanyContact: CompanyInput) {
            updateCompanyContact(updateCompanyContact: $updateCompanyContact) {
              status
              value
            }
          }
        `,
        variables: {
          updateCompanyContact: updateCompanyContact,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateCompanyContact']),
      );
  }
  multipleUpload(files: File[], dataAttach: IUUIDCompany): Observable<IUUIDCompany> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation multipleUpload($files: [Upload!]!, $dataAttach: UUIDCompanyInput) {
            multipleUpload(files: $files, dataAttach: $dataAttach) {
              status
              value
            }
          }
        `,
        variables: {
          files: files,
          dataAttach: dataAttach,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['multipleUpload']),
      );
  }
  insertCompanyContact(insertCompanyContact: ILead): Observable<IInsertLeadRespone> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertCompanyContact($insertCompanyContact: CompanyInput) {
            insertCompanyContact(insertCompanyContact: $insertCompanyContact) {
              uuidCompany
              createBy
              profilePic
            }
          }
        `,
        variables: {
          insertCompanyContact: insertCompanyContact,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertCompanyContact']),
      );
  }

  getContactbyLeadForTask(uuidCompany: string): Observable<ILead[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getLeadsContactByUUIDCompany($uuidCompany: String) {
          getLeadsContactByUUIDCompany(uuidCompany: $uuidCompany) {
            companyname
            uuidCompany
            notelead {
              uuidnote
              notedetail
              createby
              createdate
              updatedate
              readonly
            }
            companycontact {
              uuidname
              name
              email
              phoneNumber
              primarycontact
              position
            }
            tagleadlist {
              tagname
              tagcolor
            }
          }
        }
      `,
      variables: {
        uuidCompany: uuidCompany,
      },
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getLeadsContactByUUIDCompany']),
    );
  }
  getBusinessTypebyOwnerId(): Observable<IBusinessType[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getBusinessTypeByOwnerId {
          getBusinessTypeByOwnerId {
            businesstype
          }
        }
      `,
      variables: {},
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getBusinessTypeByOwnerId']),
    );
  }
  getTagLeadByOwnerId(): Observable<ITagLead[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getTagLeadByOwnerId {
          getTagLeadByOwnerId {
            tagownerid
            tagname
            tagcolor
          }
        }
      `,
      fetchPolicy: 'no-cache',
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getTagLeadByOwnerId']),
    );
  }
  getLeadSettingsByOwnerId(): Observable<ILeadSettings> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getLeadSettingsByOwnerId {
          getLeadSettingsByOwnerId {
            hasProjectCode
            hasWebsite
            projectPrefix
          }
        }
      `,
    });
    const onFetch = query.valueChanges;
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getLeadSettingsByOwnerId']),
    );
  }
}
