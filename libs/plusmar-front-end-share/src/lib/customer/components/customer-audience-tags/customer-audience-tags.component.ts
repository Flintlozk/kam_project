import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { CUSTOMER_TAG_COLOR, ICustomerTagCRUD } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-customer-audience-tags',
  templateUrl: './customer-audience-tags.component.html',
  styleUrls: ['./customer-audience-tags.component.scss'],
  animations: [slideInOutAnimation],
})
export class CustomerAudienceTagsComponent implements OnInit, OnDestroy {
  @Input() enableAdd = true;
  @Input() customerId: number;
  destroy$ = new Subject();
  customerTags: ICustomerTagCRUD[] = [];
  customerTagColorEnum = CUSTOMER_TAG_COLOR;
  constructor(private customerService: CustomerService, private audienceContactService: AudienceContactService) {}

  ngOnInit(): void {
    this.onUpdateAudienceTagEmitted();
    this.getAllCustomerTags(this.customerId);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  getAllCustomerTags(customerID: number): void {
    this.customerService
      .getCustomerTagByPageByID(customerID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result.length > 0) {
          this.getTagAttached(result);
        }
      });
  }
  getTagAttached(tags: ICustomerTagCRUD[]): void {
    this.customerTags = tags?.filter((tag) => tag.tagMappingID !== -1);
  }

  toggleExpandItem(): void {
    const expandItemID = 'customerTagExpandID';
    const expandItemElement = document.getElementById(expandItemID) as HTMLElement;
    if (!expandItemElement.classList.contains('collapse')) {
      expandItemElement.classList.add('collapse');
    } else expandItemElement.classList.remove('collapse');
  }

  onUpdateAudienceTagEmitted(): void {
    this.audienceContactService.updateAudienceTag.pipe(takeUntil(this.destroy$)).subscribe(({ customerID }) => {
      this.customerId = customerID;
      this.getAllCustomerTags(customerID);
    });
  }
}
