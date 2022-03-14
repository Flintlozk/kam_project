import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaGalleryRenderingComponent } from './cms-media-gallery-rendering.component';
import { CmsMediaGalleryOneModule } from './components/cms-media-gallery-one/cms-media-gallery-one.module';
import { CmsMediaGalleryTwoModule } from './components/cms-media-gallery-two/cms-media-gallery-two.module';
import { CmsMediaGalleryThreeModule } from './components/cms-media-gallery-three/cms-media-gallery-three.module';
import { CmsMediaGalleryFourModule } from './components/cms-media-gallery-four/cms-media-gallery-four.module';
import { CmsMediaGalleryFiveModule } from './components/cms-media-gallery-five/cms-media-gallery-five.module';

@NgModule({
  declarations: [CmsMediaGalleryRenderingComponent],
  imports: [CommonModule, CmsMediaGalleryOneModule, CmsMediaGalleryTwoModule, CmsMediaGalleryThreeModule, CmsMediaGalleryFourModule, CmsMediaGalleryFiveModule],
  exports: [CmsMediaGalleryRenderingComponent],
})
export class CmsMediaGalleryRenderingModule {}
