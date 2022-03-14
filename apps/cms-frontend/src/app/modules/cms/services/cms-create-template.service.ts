import { CommonModule } from '@angular/common';
import { Compiler, Component, ComponentRef, Injectable, Injector, NgModule, NgModuleRef, TypeDecorator, ViewContainerRef, ɵresolveComponentResources } from '@angular/core';
import { CmsButtonRenderingModule } from '../components/cms-rendering-component/cms-button-rendering/cms-button-rendering.module';
import { CmsContentContainerRenderingModule } from '../components/cms-rendering-component/cms-content-container-rendering/cms-content-container-rendering.module';
import { CmsContentColumnRenderingModule } from '../components/cms-rendering-component/cms-content-editor/cms-content-column-rendering/cms-content-column-rendering.module';
import { CmsContentEditorRenderingModule } from '../components/cms-rendering-component/cms-content-editor/cms-content-editor-rendering/cms-content-editor-rendering.module';
import { CmsContentEmbededRenderingModule } from '../components/cms-rendering-component/cms-content-editor/cms-content-embeded-rendering/cms-content-embeded-rendering.module';
import { CmsContentImageRenderingModule } from '../components/cms-rendering-component/cms-content-editor/cms-content-image-rendering/cms-content-image-rendering.module';
import { CmsContentSectionRenderingModule } from '../components/cms-rendering-component/cms-content-editor/cms-content-section-rendering/cms-content-section-rendering.module';
import { CmsContentTextRenderingModule } from '../components/cms-rendering-component/cms-content-editor/cms-content-text-rendering/cms-content-text-rendering.module';
import { CmsContentCommentCountLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-comment-count-landing/cms-content-comment-count-landing.module';
import { CmsContentCommentLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-comment-landing/cms-content-comment-landing.module';
import { CmsContentCoverImageLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-cover-image-landing/cms-content-cover-image-landing.module';
import { CmsContentDateLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-date-landing/cms-content-date-landing.module';
import { CmsContentHeaderLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-header-landing/cms-content-header-landing.module';
import { CmsContentManagementLandingRenderingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-management-landing-rendering.module';
import { CmsContentShareLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-share-landing/cms-content-share-landing.module';
import { CmsContentSidebarLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-sidebar-landing/cms-content-sidebar-landing.module';
import { CmsContentSubHeaderLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-sub-header-landing/cms-content-sub-header-landing.module';
import { CmsContentViewCountLandingModule } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-view-count-landing/cms-content-view-count-landing.module';
import { CmsContentManagementRenderingModule } from '../components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.module';
import { CmsFooterContainerRenderingModule } from '../components/cms-rendering-component/cms-footer-container-rendering/cms-footer-container-rendering.module';
import { CmsHeaderContainerRenderingModule } from '../components/cms-rendering-component/cms-header-container-rendering/cms-header-container-rendering.module';
import { CmsLayoutRenderingModule } from '../components/cms-rendering-component/cms-layout-rendering/cms-layout-rendering.module';
import { CmsMediaGalleryRenderingModule } from '../components/cms-rendering-component/cms-media-gallery-rendering/cms-media-gallery-rendering.module';
import { CmsMediaSliderRenderingModule } from '../components/cms-rendering-component/cms-media-slider-rendering/cms-media-slider-rendering.module';
import { CmsMenuRenderingModule } from '../components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.module';
import { CmsShoppingCartRenderingModule } from '../components/cms-rendering-component/cms-shopping-cart-rendering/cms-shopping-cart-rendering.module';
import { CmsTextRenderingModule } from '../components/cms-rendering-component/cms-text-rendering/cms-text-rendering.module';
import { CmsThemeRenderingModule } from '../components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.module';
import { EmbeddedViewModule } from '../directives/embedded-view/embedded-view.module';
import { CmsPreviewService } from './cms-preview.service';

@Injectable()
export class CmsCreateThemeService {
  oldCmpRef: ComponentRef<TypeDecorator>;
  constructor(private compiler: Compiler, private injector: Injector, private moduleRef: NgModuleRef<any>, private cmsPreviewService: CmsPreviewService) {}

  // Here we create the component.
  async createComponentFromRaw(template: string, styleUrls: string[], properties: any, vc: ViewContainerRef, selector?: string) {
    // Let's say your template looks like `<h2><some-component [data]="data"></some-component>`
    // As you see, it has an (existing) angular component `some-component` and it injects it [data]
    // Now we create a new component. It has that template, and we can even give it data.
    function TmpCmpConstructor() {
      Object.entries(properties).forEach(([k, v]) => {
        this[k] = v;
      });
    }

    let tmpCmp = Component({ template, selector: selector || 'dynamic-component' })(new TmpCmpConstructor().constructor);
    try {
      // Resolve styleUrls from cms-files-server
      await ɵresolveComponentResources(fetch);
    } catch (err) {
      console.error('failed to fetch styleUrls');
      console.error('set styleUrls empty');
      console.error(err);
      tmpCmp = Component({ template, selector: selector || 'dynamic-component' })(new TmpCmpConstructor().constructor);
    }
    // Now, also create a dynamic module.
    const moduleDef = {
      imports: [],
      declarations: [tmpCmp],
      // providers: [] - e.g. if your dynamic component needs any service, provide it here.
    };
    moduleDef.imports.push(
      CommonModule,
      CmsThemeRenderingModule,
      CmsLayoutRenderingModule,
      CmsTextRenderingModule,
      CmsMediaGalleryRenderingModule,
      CmsMediaSliderRenderingModule,
      CmsContentManagementRenderingModule,
      CmsContentManagementLandingRenderingModule,
      CmsContentViewCountLandingModule,
      CmsContentSubHeaderLandingModule,
      CmsContentSidebarLandingModule,
      CmsContentShareLandingModule,
      CmsContentHeaderLandingModule,
      CmsContentDateLandingModule,
      CmsContentCoverImageLandingModule,
      CmsContentCommentLandingModule,
      CmsContentCommentCountLandingModule,
      CmsButtonRenderingModule,
      CmsContentContainerRenderingModule,
      CmsHeaderContainerRenderingModule,
      CmsFooterContainerRenderingModule,
      CmsMenuRenderingModule,
      CmsContentSectionRenderingModule,
      CmsContentColumnRenderingModule,
      CmsContentEditorRenderingModule,
      CmsContentTextRenderingModule,
      CmsShoppingCartRenderingModule,
      CmsContentEmbededRenderingModule,
      CmsContentImageRenderingModule,
      EmbeddedViewModule,
    );
    const tmpModule = NgModule(moduleDef)(class {});
    this.createAndInsertComponent(tmpModule, vc);
    this.createStyleUrls(styleUrls);
  }

  createStyleUrls(styleUrls: string[]): void {
    const headElement = document.getElementsByTagName('head')[0];
    styleUrls.forEach((styleUrl) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = styleUrl;
      headElement.appendChild(link);
    });
  }

  createAndInsertComponent(tmpModule: any, vc: ViewContainerRef) {
    // Now compile this module and component, and inject it into that #vc in your current component template.
    const factories = this.compiler.compileModuleAndAllComponentsSync(tmpModule);
    const f = factories.componentFactories[0];
    const cmpRef = f.create(this.injector, [], null, this.moduleRef);
    vc.insert(cmpRef.hostView);
    this.onPushComponentRefToPreview(cmpRef);
  }

  onPushComponentRefToPreview(cmpRef: ComponentRef<TypeDecorator>): void {
    if (this.oldCmpRef) {
      this.oldCmpRef.destroy();
    }
    cmpRef.changeDetectorRef.markForCheck();
    this.cmsPreviewService.updatePreviewElementRef(cmpRef.location);
    this.oldCmpRef = cmpRef;
  }
}
