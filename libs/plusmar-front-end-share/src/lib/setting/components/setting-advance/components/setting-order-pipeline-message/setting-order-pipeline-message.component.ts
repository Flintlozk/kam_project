import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { AudienceDomainType } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-order-pipeline-message',
  templateUrl: './setting-order-pipeline-message.component.html',
  styleUrls: ['./setting-order-pipeline-message.component.scss'],
})
export class SettingOrderPipelineMessageComponent implements OnInit {
  @Input() isAllowed: boolean;
  @Output() isLoadingToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  messagePipeline: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  expandToggle = false;
  tableData = [
    {
      category: 'Step 1 : Follow',
      status: false,
      subCategories: [
        {
          id: 1,
          title: 'ข้อความสำหรับการเลือกช่องทางการจัดส่งและช่องทางการชำระเงิน',
          isLastChild: true,
          order: '1',
        },
      ],
    },
    {
      category: 'Step 3 : Confirm Payment',
      status: false,
      subCategories: [
        {
          id: 2,
          title: 'ข้อความสำหรับช่องทางการชำระเงิน',
          isLastChild: true,
          order: '1',
        },
      ],
    },
    {
      category: 'Step 4 : Waiting For Shipment',
      status: false,
      subCategories: [
        {
          id: 3,
          title: 'ข้อความแจ้งเตือนการชำระเงินเรียบร้อย',
          isLastChild: false,
          order: '1',
        },
        {
          id: 4,
          title: 'ข้อความแจ้งยืนยันคำสั่งซื้อการชำระเงินปลายทาง',
          isLastChild: false,
          order: '1',
        },
        {
          id: 5,
          title: 'ข้อความแจ้งดำเนินการจัดส่งสินค้า',
          isLastChild: true,
          order: '1',
        },
      ],
    },
    {
      category: 'Step 5 : Close Sale',
      status: false,
      subCategories: [
        {
          id: 7,
          title: 'ข้อความแจ้งเตือนการจัดส่งสินค้าและหมายเลขติดตามพัสดุ',
          isLastChild: true,
          order: '1',
        },
      ],
    },
    {
      category: 'Bank Account',
      status: false,
      subCategories: [
        {
          id: 6,
          title: 'ข้อความแสดงรายการหมายเลขบัญชีธนาคาร',
          isLastChild: true,
          order: '1',
        },
      ],
    },
  ];
  defaultMessage = [
    {
      message1: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการการสั่งซื้อ',
      message2: 'ยืนยัน',
      message3: 'กรุณากดปุ่ม "ชำระเงิน" เพื่อไปยังหน้าต่างการชำระเงิน',
      message4: 'ชำระเงิน',
      message5: 'ทางร้านได้รับการชำระเงินเรียบร้อยแล้ว',
      message6: 'ยืนยันการสั่งซื้อแล้ว',
      message7: 'ทางร้านจะดำเนินการจัดส่งสินค้าของท่านโดยเร็วที่สุดนะคะ และจะส่งหมายเลข Tracking No. ให้ลูกค้านะคะ',
      message8: 'กรุณาดำเนินการชำระค่าสินค้าผ่านหมายเลขบัญชีด้านล่าง\nและแนบหลักฐานการจ่ายผ่านทางช่องทางนี้เท่านั้น',
      message9: 'หมายเลขติดตามสินค้า',
      message10: '',
      message11: '',
      message12: '',
      message13: '',
      message14: '',
    },
  ];
  constructor(private formBuilder: FormBuilder, private pageService: PagesService, public toast: ToastrService) {}

  ngOnInit(): void {
    this.initFromGroup();
    this.getPageMessage();
  }

  initFromGroup(): void {
    this.messagePipeline = this.formBuilder.group({
      message1: ['', Validators.required],
      message2: ['', Validators.required],
      message3: ['', Validators.required],
      message4: ['', Validators.required],
      message5: ['', Validators.required],
      message6: ['', Validators.required],
      message7: ['', Validators.required],
      message8: ['', Validators.required],
      message9: ['', Validators.required],
      message10: [''],
      message11: [''],
      message12: [''],
      message13: [''],
      message14: [''],
      type: [''],
    });
  }

  toggleExpand(index: number): void {
    this.tableData[index].status = !this.tableData[index].status;
  }

  async expandAll(bool: boolean): Promise<void> {
    this.expandToggle = bool;
    for (let index = this.tableData.length - 1; index >= 0; index--) {
      this.tableData[index].status = bool;
      await new Promise((reslove) => {
        setTimeout(() => {
          reslove(true);
        }, index * 25);
      });
    }
  }

  reset(index: number, id: number): void {
    this.messagePipeline.markAsDirty();
    switch (id) {
      case 1:
        this.messagePipeline.controls['message1'].setValue(this.defaultMessage[0].message1);
        this.messagePipeline.controls['message2'].setValue(this.defaultMessage[0].message2);
        break;
      case 2:
        this.messagePipeline.controls['message3'].setValue(this.defaultMessage[0].message3);
        this.messagePipeline.controls['message4'].setValue(this.defaultMessage[0].message4);
        break;
      case 3:
        this.messagePipeline.controls['message5'].setValue(this.defaultMessage[0].message5);
        break;
      case 4:
        this.messagePipeline.controls['message6'].setValue(this.defaultMessage[0].message6);
        break;
      case 5:
        this.messagePipeline.controls['message7'].setValue(this.defaultMessage[0].message7);
        break;
      case 7:
        this.messagePipeline.controls['message9'].setValue(this.defaultMessage[0].message9);
        break;
      case 6:
        this.messagePipeline.controls['message8'].setValue(this.defaultMessage[0].message8);
        break;
    }
  }

  savePageMessage(): void {
    if (this.messagePipeline.dirty && this.messagePipeline.valid) {
      if (this.messagePipeline.valid) {
        this.isLoadingToggle.emit(true);
        this.messagePipeline.controls['type'].setValue(AudienceDomainType.CUSTOMER);
        this.pageService
          .savePageMessage(this.messagePipeline.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.messagePipeline.markAsPristine();
            this.isLoadingToggle.emit(false);
            this.toast.success('Data has been saved', 'Success');
          });
      } else {
        //
        this.toast.error('Invalid form input', 'Error');
      }
    }
  }

  getPageMessage(): void {
    const type = AudienceDomainType.CUSTOMER;
    this.pageService
      .getPageMessage(type)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.messagePipeline.controls['message1'].setValue(result.message1);
        this.messagePipeline.controls['message2'].setValue(result.message2);
        this.messagePipeline.controls['message3'].setValue(result.message3);
        this.messagePipeline.controls['message4'].setValue(result.message4);
        this.messagePipeline.controls['message5'].setValue(result.message5);
        this.messagePipeline.controls['message6'].setValue(result.message6);
        this.messagePipeline.controls['message7'].setValue(result.message7);
        this.messagePipeline.controls['message8'].setValue(result.message8);
        this.messagePipeline.controls['message9'].setValue(result.message9);
        this.messagePipeline.controls['message10'].setValue(result.message10);
        this.messagePipeline.controls['message11'].setValue(result.message11);
        this.messagePipeline.controls['message12'].setValue(result.message12);
        this.messagePipeline.controls['message13'].setValue(result.message13);
        this.messagePipeline.controls['message14'].setValue(result.message14);
      });
  }
}
