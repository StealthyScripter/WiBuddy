import { TestBed } from '@angular/core/testing';
import { MainPageComponent } from './home-page/home-page.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MainPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'angular-frontend' title`, () => {
    const fixture = TestBed.createComponent(MainPageComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angular-frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(MainPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, angular-frontend');
  });
});
