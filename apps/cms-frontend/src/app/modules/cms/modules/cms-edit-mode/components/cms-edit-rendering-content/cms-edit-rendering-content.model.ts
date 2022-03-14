import { CmsContentColumnRenderingComponent } from '../../../../components/cms-rendering-component/cms-content-editor/cms-content-column-rendering/cms-content-column-rendering.component';
import { CmsContentEmbededRenderingComponent } from '../../../../components/cms-rendering-component/cms-content-editor/cms-content-embeded-rendering/cms-content-embeded-rendering.component';
import { CmsContentImageRenderingComponent } from '../../../../components/cms-rendering-component/cms-content-editor/cms-content-image-rendering/cms-content-image-rendering.component';
import { CmsContentSectionRenderingComponent } from '../../../../components/cms-rendering-component/cms-content-editor/cms-content-section-rendering/cms-content-section-rendering.component';
import { CmsContentTextRenderingComponent } from '../../../../components/cms-rendering-component/cms-content-editor/cms-content-text-rendering/cms-content-text-rendering.component';

export type ContentComponentType = CmsContentSectionRenderingComponent | CmsContentColumnRenderingComponent;
export type ContentChildrenComponentType = CmsContentTextRenderingComponent | CmsContentEmbededRenderingComponent | CmsContentImageRenderingComponent;
