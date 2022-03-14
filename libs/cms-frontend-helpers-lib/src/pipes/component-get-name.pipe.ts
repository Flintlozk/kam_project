import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'componentGetName' })
export class ComponentGetNamePipe implements PipeTransform {
  transform(componentType: string): string {
    switch (componentType) {
      case 'CmsTextRenderingComponent':
        return 'Text';
      case 'CmsLayoutRenderingComponent':
        return 'Layout';
      case 'CmsMediaGalleryRenderingComponent':
        return 'Media Gallery';
      case 'CmsContentManagementRenderingComponent':
        return 'Content Management';
      case 'CmsButtonRenderingComponent':
        return 'Button';
      case 'CmsMenuRenderingComponent':
        return 'Menu';
      default:
        return 'Unknown';
        break;
    }
  }
}
