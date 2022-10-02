import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormBisComponent } from './product-form-bis.component';

describe('ProductFormBisComponent', () => {
  let component: ProductFormBisComponent;
  let fixture: ComponentFixture<ProductFormBisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFormBisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormBisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
