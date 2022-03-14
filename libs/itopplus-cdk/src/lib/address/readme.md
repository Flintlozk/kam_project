# Usage in parent component

```html
<reactor-room-address [fields]="fields" (handleValue)="handleAddressValue($event)"></reactor-room-address>
```

```ts
// 1. add Form Init in constructor
constructor(
  public CDR: ChangeDetectorRef,
  private route: ActivatedRoute,
  private customerService: CustomerService,
  private formBuilder: FormBuilder,
  private imageHelper: ImageHelper,
  private dialog: MatDialog
) {
  this.initForm();
}

// 2. define your form
 initForm() {
    this.customerForm = this.formBuilder.group({
      id: [null],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      whatever: this.formBuilder.group(this.social),
      // 'location' property will be added by address component automatically
      // don't add it to form
    });
  }

// 3. define object of type ICustomerAddressData[]
addressFields = [
  { value: 'amphoe', label: 'Amphoe', validator: [Validators.required], errorMessage: '' },
  { value: 'province', label: 'Province', validator: [Validators.required], errorMessage: '' },
  { value: 'district', label: 'District', validator: [Validators.required], errorMessage: '' },
  { value: 'zipcode', label: 'Zipcode', validator: [Validators.required], errorMessage: '' },
];

// 4. add handler to prefill form data
ngOnInit(): void {
  this.route.params.subscribe((params) => {
    setTimeout(() => {
      this.userIdParam = +params['id'];

      if (!isNaN(this.userIdParam)) {
        this.customerService.getCustomerById(this.userIdParam).subscribe(
          (result) => {
              this.addressFields = this.addressFields.map((item) => ({ ...item, ...{ value: result[item.field] || null } }));
              this.customerForm.setValue(result);
          },
          (err) => {
            console.log({ err });
          }
        );
      }
    });
  });
}

// 5. add handler for autocomplete select
handleAddressValue(addressValues: ICustomerAddressData) {
  // @ts-ignore
  this.customerForm.pristine = false;
  this.customerForm.patchValue(addressValues);
}
```
