import { Injectable, OnDestroy } from '@angular/core';
import { ICategory, ICategoryName } from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContentCategoryService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  checkCategoryNameExist(name: string, id: string): Observable<IHTTPResult> {
    const checkCategory = this.apollo.query({
      query: gql`
        query checkCategoryNameExist($name: String, $id: String) {
          checkCategoryNameExist(name: $name, id: $id) {
            status
            value
          }
        }
      `,
      variables: {
        name,
        id,
      },
      fetchPolicy: 'no-cache',
    });
    return checkCategory.pipe(map((x) => x.data['checkCategoryNameExist']));
  }
  addContentCategory(categoryData: ICategory): Observable<IHTTPResult> {
    const addCategory = this.apollo.mutate({
      mutation: gql`
        mutation addContentCategory($categoryData: ContentCategoryInput) {
          addContentCategory(categoryData: $categoryData) {
            status
            value
          }
        }
      `,
      variables: {
        categoryData,
      },
      fetchPolicy: 'no-cache',
    });
    return addCategory.pipe(map((x) => x.data['addContentCategory']));
  }
  updateCategoryNameByID(categoryData: ICategory): Observable<IHTTPResult> {
    const updateCategory = this.apollo.mutate({
      mutation: gql`
        mutation updateCategoryNameByID($categoryData: ContentCategoryInput) {
          updateCategoryNameByID(categoryData: $categoryData) {
            status
            value
          }
        }
      `,
      variables: {
        categoryData,
      },
      fetchPolicy: 'no-cache',
    });
    return updateCategory.pipe(map((x) => x.data['updateCategoryNameByID']));
  }
  deleteCategoryByID(id: string): Observable<IHTTPResult> {
    const deleteCategory = this.apollo.mutate({
      mutation: gql`
        mutation deleteCategoryByID($id: String) {
          deleteCategoryByID(id: $id) {
            status
            value
          }
        }
      `,
      variables: {
        id,
      },
      fetchPolicy: 'no-cache',
    });
    return deleteCategory.pipe(map((x) => x.data['deleteCategoryByID']));
  }
  deleteCategoriesByID(ids: string[]): Observable<IHTTPResult> {
    const deleteCategory = this.apollo.mutate({
      mutation: gql`
        mutation deleteCategoriesByID($ids: [String]) {
          deleteCategoriesByID(ids: $ids) {
            status
            value
          }
        }
      `,
      variables: {
        ids,
      },
      fetchPolicy: 'no-cache',
    });
    return deleteCategory.pipe(map((x) => x.data['deleteCategoriesByID']));
  }
}
