import { FBVideoComponent } from './fb-video';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

declare let window: any;

describe('FBVideoComponent', () => {
  let de: DebugElement, comp: FBVideoComponent, fixture: ComponentFixture<FBVideoComponent>;

  beforeAll(() => {
    window.FB = {
      Event: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        subscribe: () => {},
      },
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FBVideoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FBVideoComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have fb-video class', () => expect(de.classes['fb-video']).toBeTruthy());

  xit('should have data-href property', () => {
    comp.href = 'https://zyramedia.com';
    expect(Object.keys(de.attributes).indexOf('data-href')).toBeDefined();
    expect(de.attributes['data-href']).toEqual('https://zyramedia.com');
  });
});
