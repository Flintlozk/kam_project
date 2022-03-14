import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TagColorSelectorComponent } from './tag-color-selector.component';

//TODO: James we nee you help to unskip this test.
describe('TagColorSelectorComponent', () => {
  let spectator: Spectator<TagColorSelectorComponent>;
  const createComponent = createComponentFactory({
    component: TagColorSelectorComponent,
    shallow: true,
  });

  beforeEach(() => (spectator = createComponent()));
  it("should have title 'Select a color'", () => {
    expect(spectator.query('.title')).toHaveText('Select a color');
  });
});
