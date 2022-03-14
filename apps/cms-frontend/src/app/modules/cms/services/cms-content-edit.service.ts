import { ElementRef, Injectable, OnDestroy, QueryList, ViewContainerRef, ViewRef } from '@angular/core';
import { EContentEditorComponentType, IContentEditor, IContentEditorComponent, IContentEditorSection, IContentEditorWithLength } from '@reactor-room/cms-models-lib';
import { IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CmsContentEmbededRenderingComponent } from '../components/cms-rendering-component/cms-content-editor/cms-content-embeded-rendering/cms-content-embeded-rendering.component';
import { CmsContentImageRenderingComponent } from '../components/cms-rendering-component/cms-content-editor/cms-content-image-rendering/cms-content-image-rendering.component';
import { CmsContentSectionRenderingComponent } from '../components/cms-rendering-component/cms-content-editor/cms-content-section-rendering/cms-content-section-rendering.component';
import { ContentChildrenComponentType, ContentComponentType } from '../modules/cms-edit-mode/components/cms-edit-rendering-content/cms-edit-rendering-content.model';
import { ADD_CONTENTS, GET_CONTENTS, GET_CONTENTS_BY_CATEGORIES, GET_CONTENTS_HTML, GET_CONTENTS_LIST, UPDATE_CONTENTS } from './cms-query/contents.query';

@Injectable({
  providedIn: 'root',
})
export class CmsContentEditService implements OnDestroy {
  currentComponent: ContentComponentType | ContentChildrenComponentType;
  sectionChildren: QueryList<CmsContentSectionRenderingComponent>;
  contentsForm: IContentEditor;
  destroy$: Subject<boolean> = new Subject<boolean>();
  $contents = new Subject<IContentEditor>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onFocusCurrentComponent(component: ContentComponentType | ContentChildrenComponentType): void {
    if (this.currentComponent !== component) {
      if (this.currentComponent) {
        this.currentComponent.onFocus = false;
      }
      switch (this.currentComponent?.componentType) {
        case EContentEditorComponentType.EMBEDED:
          this.deactiveCmsContentEmbededRenderingComponent();
          break;
        case EContentEditorComponentType.IMAGE:
          this.deactiveCmsContentImageRenderingComponent();
          break;
        default:
          break;
      }
      this.currentComponent = component;
      component.onFocus = true;
    }
  }

  deactiveCmsContentEmbededRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsContentEmbededRenderingComponent;
    this.currentComponent.saveLayoutEmbededData();
    if (!this.currentComponent.layoutEmbededSubscription.closed) {
      this.currentComponent.layoutEmbededSubscription.unsubscribe();
    }
    this.currentComponent.layoutEmbededSubscription = undefined;
  }

  deactiveCmsContentImageRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsContentImageRenderingComponent;
    this.currentComponent.saveLayoutImageData();
    if (!this.currentComponent.layoutImageSubscription.closed) {
      this.currentComponent.layoutImageSubscription.unsubscribe();
    }
    this.currentComponent.layoutImageSubscription = undefined;
  }

  onNavigate<T>(viewContainerRef: ViewContainerRef, queryList: QueryList<T>, viewRef: ViewRef, direction: string, el: ElementRef): void {
    if (!viewContainerRef || !viewRef) return;
    let currentIndex = viewContainerRef.indexOf(viewRef);
    const btnBackward = el.nativeElement.getElementsByClassName('btn-backward')[0];
    const btnForward = el.nativeElement.getElementsByClassName('btn-forward')[0];
    switch (direction) {
      case 'forward':
        if (currentIndex === viewContainerRef.length - 1) return;
        viewContainerRef.move(viewRef, currentIndex + 1);
        this.updateQueryListItemPostion(currentIndex, currentIndex + 1, queryList);
        break;
      case 'backward':
        if (currentIndex === 0) return;
        viewContainerRef.move(viewRef, currentIndex - 1);
        this.updateQueryListItemPostion(currentIndex, currentIndex - 1, queryList);
        break;
      default:
        break;
    }
    currentIndex = viewContainerRef.indexOf(viewRef);
    currentIndex === 0 ? (btnBackward.style.opacity = '0.3') : (btnBackward.style.opacity = '1');
    currentIndex === viewContainerRef.length - 1 ? (btnForward.style.opacity = '0.3') : (btnForward.style.opacity = '1');
  }

  updateQueryListItemPostion<T>(oldIndex: number, newIndex: number, queryList: QueryList<T>): void {
    const array = queryList.toArray();
    [array[oldIndex], array[newIndex]] = [array[newIndex], array[oldIndex]];
    queryList.reset([...array]);
  }

  onRemoveComponent<T>(viewContainerRef: ViewContainerRef, queryList: QueryList<T>, viewRef: ViewRef): void {
    const currentIndex = viewContainerRef.indexOf(viewRef);
    viewContainerRef.remove(currentIndex);
    const array = queryList.toArray();
    array.splice(currentIndex, 1);
    queryList.reset([...array]);
  }

  getContentSectionData(): IContentEditorSection[] {
    const sections: IContentEditorSection[] = [];
    this.sectionChildren.forEach((section, sectionIndex) => {
      sections.push(section.savingData);
      sections[sectionIndex].columns = [];
      const columns = sections[sectionIndex].columns;
      section.columnChildren.forEach((column, columnIndex) => {
        columns.push(column.savingData);
        columns[columnIndex].components = [];
        const components = columns[columnIndex].components as IContentEditorComponent[];
        column.componentChildren.forEach((component) => {
          components.push(component.savingData);
        });
      });
    });
    return sections;
  }

  getContentsByCategories(categories: string[], limit: number): Observable<IContentEditor[]> {
    return this.apollo
      .query({
        query: GET_CONTENTS_BY_CATEGORIES,
        fetchPolicy: 'no-cache',
        variables: { categories, limit },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getContentsByCategories']),
      );
  }

  getContentsList(tableFilter: ITableFilter): Observable<IContentEditorWithLength> {
    return this.apollo
      .query({
        query: GET_CONTENTS_LIST,
        fetchPolicy: 'no-cache',
        variables: { tableFilter },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getContentsList']),
      );
  }

  getContents(_id: string): Observable<IContentEditor> {
    return this.apollo
      .query({
        query: GET_CONTENTS,
        fetchPolicy: 'no-cache',
        variables: { _id },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getContents']),
      );
  }

  getContentsHTML(_id: string): Observable<string> {
    return this.apollo
      .query({
        query: GET_CONTENTS_HTML,
        fetchPolicy: 'no-cache',
        variables: { _id },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getContentsHTML']),
      );
  }

  addContents(contents: IContentEditor): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: ADD_CONTENTS,
        fetchPolicy: 'no-cache',
        variables: { contents },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['addContents']),
      );
  }

  updateContents(contents: IContentEditor, _id: string, isSaveAsDraft: boolean): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_CONTENTS,
        fetchPolicy: 'no-cache',
        variables: { contents, _id, isSaveAsDraft },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateContents']),
      );
  }
}
