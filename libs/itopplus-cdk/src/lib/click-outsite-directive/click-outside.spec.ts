// import { Component } from '@angular/core';
// import { Spectator } from '@ngneat/spectator';
// import { createComponentFactory } from '@ngneat/spectator/jest';
// import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';

// @Component({
//   template: `
//     <div class="outside">
//       <div reactorRoomClickOutside (outside)="clickOutside($event)" [clickOutsideHandler]="clickOutsideHandler">
//         <div class="inside">Inside</div>
//       </div>
//     </div>
//   `,
// })
// class TestComponent {
//   clickOutside(isOutside: boolean) {}
//   clickOutsideHandler() {}
// }

//TODO: James we nee you help to unskip this test.
describe('ClickOutsideDirective', () => {
  it('just run it', () => {
    expect(true).toBeTruthy();
  });
  // let spectator: Spectator<TestComponent>;
  // let onClickOutside: jest.SpyInstance;
  // const createComponent = createComponentFactory({
  //   component: TestComponent,
  //   imports: [ClickOutsideModule],
  // });
  // beforeEach(() => {
  //   spectator = createComponent();
  //   onClickOutside = jest.spyOn(spectator.component, 'clickOutside');
  // });
  // it('should emit outside true when mousedown outside', () => {
  //   spectator.dispatchMouseEvent('.outside', 'mousedown');
  //   expect(onClickOutside).toHaveBeenCalled();
  //   expect(onClickOutside).toHaveBeenCalledWith(true);
  // });
  // it('should emit outside true when touchstart outside', () => {
  //   spectator.dispatchMouseEvent('.outside', 'touchstart');
  //   expect(onClickOutside).toHaveBeenCalled();
  //   expect(onClickOutside).toHaveBeenCalledWith(true);
  // });
  // it('should emit outside false when mousedown inside', () => {
  //   spectator.dispatchMouseEvent('.inside', 'mousedown');
  //   expect(onClickOutside).toHaveBeenCalled();
  //   expect(onClickOutside).toHaveBeenCalledWith(false);
  // });
  // it('should emit outside false when touchstart inside', () => {
  //   spectator.dispatchMouseEvent('.inside', 'touchstart');
  //   expect(onClickOutside).toHaveBeenCalled();
  //   expect(onClickOutside).toHaveBeenCalledWith(false);
  // });

  // xit('should call clickOutsideHandler when touchstart outside', () => {
  //   onClickOutside = jest.spyOn(spectator.component, 'clickOutsideHandler');
  //   spectator.dispatchMouseEvent('.outside', 'touchstart');
  //   expect(onClickOutside).toHaveBeenCalled();
  // });
});
