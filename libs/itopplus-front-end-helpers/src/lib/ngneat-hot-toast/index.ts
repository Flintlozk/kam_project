import { HotToastService } from '@ngneat/hot-toast';

export class NgNeat {
  constructor(private toast: HotToastService) {}
  hotToast() {
    return this.toast.observe({
      loading: 'Saving...',
      success: 'Update information saved!',
      error: 'Could not save.',
    });
  }
}
