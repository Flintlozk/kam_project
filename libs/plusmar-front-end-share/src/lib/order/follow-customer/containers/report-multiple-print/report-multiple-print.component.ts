import { Component, OnInit, Inject } from '@angular/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { IGetShopProfile, reportAllType, PrintingReportType, SizeReport, multiplePrintingSelected } from '@reactor-room/itopplus-model-lib';
import { forkJoin, Observable } from 'rxjs';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'reactor-room-report-multiple-print',
  templateUrl: './report-multiple-print.component.html',
  styleUrls: ['./report-multiple-print.component.scss'],
})
export class ReportMultiplePrintComponent implements OnInit {
  reportServiceURL = environmentLib.reportURL;
  isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i);
  viewerContainerStyle = {
    position: 'relative',
    width: '80%',
    height: '100%',
    ['font-family']: 'ms sans serif',
  };
  loadReport = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private audienceService: AudienceService,
    private router: Router,
    private route: ActivatedRoute,
    private pagesService: PagesService,
    private settingsService: SettingsService,
  ) {}
  reportDetail = {
    report: '',
    parameters: {
      orderID: '',
      addressShop: '',
      telShop: '',
      pictureShop: '',
      nameShop: '',
      uuid: '',
      postcodeBarCode: '',
      addressText: 'Address',
      phoneText: 'Phone',
      subTotalText: 'Subtotal',
      shippingText: 'Shipping',
      discountText: 'Discount',
      taxText: 'Tax',
      totalAmountText: 'TotalAmount',
      productText: 'Product',
      skuText: 'Sku',
      qtyText: 'Qty',
      orderIDText: 'OrderID',
      createOrderText: 'Create Order',
      receiverText: 'Receiver',
      senderBoxText: 'Sender Box',
      toText: 'To',
      unitPriceText: 'Unit price',
      totalText: 'Total',
      trackingNoText: 'Tracking No',
      shippingDateText: 'Shipping Date',
      noText: 'No',
    },
  };
  currentSizeReport: string;
  currentTypeReport: string;
  currentUuid: multiplePrintingSelected[];
  displayHasChanged: boolean;

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      if (routeParams.reportType !== undefined) {
        this.openReport(routeParams.uuid, routeParams.reportType, routeParams.size);
      } else {
        this.genDataDetailReport();
      }
    });
  }

  getAllReportDetail(): Observable<{
    newShopPicture: string;
    shopDetail: IGetShopProfile;
  }> {
    return forkJoin({
      newShopPicture: this.getNewPicture(),
      shopDetail: this.getShopProfileDetail(),
    });
  }

  genDataDetailReport() {
    this.getAllReportDetail().subscribe((res) => {
      this.audienceService.printingSelected.subscribe((currentUuid) => {
        this.audienceService.printingSizeSelected.subscribe((currentSizeReport) => {
          this.audienceService.printingTypeSelected.subscribe((currentTypeReport) => {
            this.currentUuid = currentUuid;
            this.currentSizeReport = currentSizeReport;
            this.currentTypeReport = currentTypeReport;
            const sizeHaveValue = this.currentSizeReport !== undefined && this.currentSizeReport !== null;
            const reportSelectedHaveValue =
              this.currentUuid !== undefined && this.currentUuid !== null && this.currentUuid[0].orderno !== 0 && this.currentUuid[0].orderno !== undefined;
            const typeSelectedHaveValue = this.currentTypeReport !== undefined && this.currentTypeReport !== null && this.currentTypeReport !== '';
            if (sizeHaveValue && reportSelectedHaveValue && typeSelectedHaveValue) {
              const newUuidFormat = this.changeFormat(this.currentUuid);
              const openNewTab = true;
              if (this.currentTypeReport !== PrintingReportType.RECEIPT) {
                // this.audienceService.getTypeReport(newUuidFormat).subscribe((result) => {
                //   this.checkAllTypeReport(result, this.currentSizeReport);
                // });
              } else {
                this.openReportByType(this.currentTypeReport, this.currentSizeReport, [newUuidFormat], !openNewTab);
              }
            } else {
              void this.router.navigateByUrl('order/close-sales');
            }
          });
        });
      });
    });
  }

  checkSizeReport(size: string, reportA4: PrintingReportType, report100x150: PrintingReportType, uuid: string[], openNewTab: boolean) {
    if (size === SizeReport.SIZE_A4) {
      this.openReportByType(reportA4, size, uuid, openNewTab);
    } else {
      this.openReportByType(report100x150, size, uuid, openNewTab);
    }
  }

  checkAllTypeReport(allReport: reportAllType, size: string): void {
    let openTabsNumber = 0;
    openTabsNumber = this.openTabsByType(allReport.flash, PrintingReportType.FLASH_A4, PrintingReportType.FLASH, size, openTabsNumber);
    openTabsNumber = this.openTabsByType(allReport.jandt_cod, PrintingReportType.J_T_COD_A4, PrintingReportType.J_T_COD_100, size, openTabsNumber);
    openTabsNumber = this.openTabsByType(allReport.jandt_dropOff, PrintingReportType.J_T_DROP_OFF_A4, PrintingReportType.J_T_DROP_OFF_100, size, openTabsNumber);
    openTabsNumber = this.openTabsByType(allReport.jandt_maunal, PrintingReportType.J_T_MAUNAL_A4, PrintingReportType.J_T_MAUNAL_100, size, openTabsNumber);
    openTabsNumber = this.openTabsByType(allReport.thaipost_book, PrintingReportType.THAIPOST_BOOK_A4, PrintingReportType.THAIPOST_BOOK_100, size, openTabsNumber);
    openTabsNumber = this.openTabsByType(allReport.thaipost_maunal, PrintingReportType.THAIPOST_MAUNAL_A4, PrintingReportType.THAIPOST_MAUNAL_100, size, openTabsNumber);
    openTabsNumber = this.openTabsByType(allReport.thaipost_dropOff, PrintingReportType.THAIPOST_DROP_OFF_A4, PrintingReportType.THAIPOST_DROP_OFF_100, size, openTabsNumber);
  }

  openTabsByType(allReport: string[], TypeSeletedA4: PrintingReportType, TypeSeleted100: PrintingReportType, size: string, openTabsNumber: number): number {
    if (allReport.length > 0) {
      openTabsNumber += 1;
      const openNewTab = this.checkTabs(openTabsNumber);
      this.checkSizeReport(size, TypeSeletedA4, TypeSeleted100, allReport, openNewTab);
    }
    return openTabsNumber;
  }

  checkTabs(currentTab: number): boolean {
    let result = false;
    if (currentTab > 1) {
      result = true;
    }
    return result;
  }

  openReportByType(reportName: string, size: string, uuid: string[], openNewTab: boolean) {
    const url = `order/multipleReport/selected/${reportName}/${size}/${uuid}`;
    if (openNewTab === true) {
      window.open(url, '_blank');
    } else {
      void this.router.navigateByUrl(url);
    }
  }

  openReport(uuid: string, reportType: string, size: string): void {
    this.getAllReportDetail().subscribe((res) => {
      this.reportDetail.parameters.orderID = '00';
      this.reportDetail.parameters.uuid = uuid;
      this.findReport(reportType, size);
    });
  }

  findReport(reportType: string, size: string): void {
    if (reportType === PrintingReportType.RECEIPT) {
      this.checkSizeReceipt(reportType, size);
    } else {
      this.reportDetail.report = `${reportType}.trdp`;
    }
    this.loadReport = true;
    this.changeDisplay();
  }
  changeDisplay() {
    setTimeout(function () {
      const element = document.getElementsByClassName('trv-nav k-widget');
      if (element.length > 0) {
        element[0].setAttribute('style', 'display:block');
      }
    }, 1000);
  }
  checkSizeReceipt(reportType: string, size: string): void {
    switch (size) {
      case SizeReport.SIZE_A4:
        this.reportDetail.report = `${reportType}.trdp`;
        break;
      case SizeReport.SIZE_100x150mm:
        this.reportDetail.report = `${reportType}-100.trdp`;
        break;
      case SizeReport.SIZE_57mm:
        this.reportDetail.report = `${reportType}-57.trdp`;
        break;
    }
  }

  getNewPicture() {
    return this.pagesService.getPictureFromFacebookFanpageByFacebookID().pipe(
      tap((result) => {
        if (result != null) {
          this.reportDetail.parameters.pictureShop = result;
        }
      }),
    );
  }

  getShopProfileDetail() {
    return this.settingsService.getShopProfile().pipe(
      tap((result) => {
        if (result != null) {
          this.reportDetail.parameters.addressShop = `${result.address} ${result.amphoe} ${result.district} ${result.province}  ${result.post_code}`;
          this.reportDetail.parameters.telShop = `เบอร์โทร  ${result.tel}`;
          // eslint-disable-next-line max-len
          this.reportDetail.parameters.nameShop = `${result.page_name}\r\n${result.address} ${result.amphoe} ${result.district} ${result.province}  ${result.post_code} \r\nเบอร์โทร  ${result.tel}`;
        }
      }),
    );
  }
  changeFormat(uuid: multiplePrintingSelected[]) {
    let result = '';
    for (let i = 0; i < uuid.length; i++) {
      if (result != '') {
        result += `,${uuid[i].orderno}`;
      } else {
        result = `${uuid[i].orderno}`;
      }
    }
    return result;
  }
}
