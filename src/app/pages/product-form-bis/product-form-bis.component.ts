//*Import form core angular */
import { HttpClient } from '@angular/common/http';
import {
  AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2
} from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//**import from source */
import { map, Observable, Subscription, tap } from 'rxjs';
import { FormFieldData } from 'src/app/data-type';
import { IControlGridLayoutForm } from 'src/app/data-type/grid-form.data.type';
import { DataService } from 'src/app/services/data.service';

interface ProductFormTabItem {
  label: string;
  content: IControlGridLayoutForm
}

@Component({
  selector: 'app-product-form-bis',
  templateUrl: './product-form-bis.component.html',
  styleUrls: ['./product-form-bis.component.scss'],
})
export class ProductFormBisComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  //**Declaration */
  public tabLinks!: ElementRef[];
  public tabContents!: ElementRef[];
  public productForm!: FormGroup;
  public formInfo!: IControlGridLayoutForm;
  public formAttributeInfo!: IControlGridLayoutForm;
  public isProductForm: boolean = false;
  public httpSubscription!: Subscription;

  activeTab!: ProductFormTabItem;
  formTabs$!: Observable<ProductFormTabItem[]>;

  //**constructor */
  constructor(
    private _dataService: DataService,
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _fb: FormBuilder,
    private _http: HttpClient) { }
  // **life cycle hooks

  ngOnInit(): void {
    this.formTabs$ = this.getLayoutForm()
      .pipe(
        tap(res => {
          const entries = Object.keys(res).map(key => [key, this.generateFormGroup(res[key])]);
          const initFormModel = Object.fromEntries(entries);
          this.isProductForm = true;
          this.productForm = this._fb.group(initFormModel);
          this._dataService.sendData(this.productForm);
          this._dataService.sendDataByEvent({ formInfo: this.formInfo, formAttributeInfo: this.formAttributeInfo });
        }),
        // To refactor after
        map(res => Object.keys(res).map(
          key => ({
            label: key,
            content: res[key]
          })
        )),
        tap(formTabs => this.activeTab = formTabs[0])
      )
  }
  ngAfterViewInit(): void {

  }
  ngAfterViewChecked(): void {
    // if (this.isProductForm) {
    //   this.tabLinks = this._el.nativeElement.querySelectorAll('.tab__link');
    //   this.tabContents = this._el.nativeElement.querySelectorAll('.tabContent');
    //   this._el.nativeElement.querySelector('#defaultOpen').click();
    //   this.isProductForm = false;
    // }
  }
  ngOnDestroy(): void {
    this.httpSubscription.unsubscribe();
  }
  //**open tab  */  
  public openTab(elRef: any, tabName: string): void {
    let currentTab = this._el.nativeElement.querySelector(`#${tabName}`);
    this.tabContents.forEach((tabContent) => {
      this._renderer.setStyle(tabContent, 'display', 'none');
    });
    this.tabLinks.forEach((tabLink) => {
      this._renderer.removeClass(tabLink, 'active');
    });
    elRef.classList.add('active');
    this._renderer.setStyle(currentTab, 'display', 'grid');
  }
  // **!! create service latter 
  //** get layout 
  private getLayoutForm(): Observable<any> {
    return this._http.get('assets/data/layout-form.data.json');
  }
  //**Generate Form when receive data form api */
  // private generateForm(): FormGroup {

  // }
  // ** generate form group
  private generateFormGroup(controlGridLayoutForm: IControlGridLayoutForm): FormGroup {
    const formGroupPrepareObject: Record<string, any> = {};
    controlGridLayoutForm.formField.forEach(field => {
      formGroupPrepareObject[field.attribute.formControlName] = [field.attribute.value || '', field.attribute.validators ? this.generateValidators(field.attribute.validators) : null];
    })
    if (controlGridLayoutForm.subControlGridLayoutForm) {
      controlGridLayoutForm.subControlGridLayoutForm.subGridItemForm.formField.forEach(field => {
        formGroupPrepareObject[field.attribute.formControlName] = [field.attribute.value || '', field.attribute.validators ? this.generateValidators(field.attribute.validators) : null];
      })
    }
    return this._fb.group(formGroupPrepareObject);
  }
  //** generate validation form 
  private generateValidators(validatorsString: Array<FormFieldData.IValidator>): Array<ValidatorFn> {
    let validators: Array<ValidatorFn> = [];
    validatorsString.forEach(validator => {
      switch (validator.key) {
        case 'required':
          validators.push(Validators.required);
          break;
        case 'min':
          validators.push(Validators.min(validator.value as number));
          break;
        case 'max':
          validators.push(Validators.max(validator.value as number));
          break;
        case 'email':
          validators.push(Validators.email);
          break;
        case 'pattern':
          validators.push(Validators.pattern(validator.value as string));
          break;
        case 'minlength':
          validators.push(Validators.minLength(validator.value as number));
          break;
        case 'maxlength':
          validators.push(Validators.maxLength(validator.value as number));
          break;
        default:
          validators.push(Validators.required);
          break;
      }
    })
    return validators;
  }

  onChangeFormTab(tab: ProductFormTabItem) {
    this.activeTab = tab;
    // Other stubs
  }
}

