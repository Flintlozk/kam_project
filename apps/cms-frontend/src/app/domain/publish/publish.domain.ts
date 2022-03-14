import { environment } from 'apps/cms-frontend/src/environments/environment';

export function generatePrevId(nativeElement: HTMLElement): string {
  let prevSibling = nativeElement.previousElementSibling;
  if (!prevSibling?.id && prevSibling !== null) {
    while (prevSibling) {
      prevSibling = prevSibling.previousElementSibling;
      if (prevSibling?.id) {
        break;
      }
    }
  }
  let parent = nativeElement.parentElement;
  if (!parent?.id && parent !== null) {
    while (parent) {
      parent = parent.parentElement;
      if (parent?.id) {
        break;
      }
    }
  }
  let prevId;
  if (prevSibling) {
    prevId = prevSibling?.id;
    const all = prevSibling.querySelectorAll('.' + environment.cms.CMS_FRONTEND_COMPONENT_CLASS);
    if (all.length > 0) {
      const lastElement = all[all.length - 1];
      prevId = lastElement.id;
    }
  } else if (parent) {
    prevId = parent.id;
    const all = parent.querySelectorAll('.' + environment.cms.CMS_FRONTEND_COMPONENT_CLASS);
    if (all.length > 0) {
      const allId = [];
      all.forEach((element) => {
        allId.push(element.id);
      });
      const index = allId.indexOf(nativeElement.id);
      if (index > -1 && index !== 0) {
        prevId = allId[index - 1];
      }
    }
  } else {
    prevId = null;
  }
  return prevId;
}
