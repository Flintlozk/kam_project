import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AudienceViewType, IPaperRouteParams, PaperSize, PaperType } from '@reactor-room/itopplus-model-lib';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import * as printJS from 'print-js';
import { PaperService } from '../../services/paper.service';
@Component({
  selector: 'reactor-room-report-follow-customer',
  templateUrl: './report-follow-customer.component.html',
  styleUrls: ['./report-follow-customer.component.scss'],
})
export class ReportFollowCustomerComponent implements OnInit {
  uuid: string;
  orderId: string;
  audienceID: string;
  originRoute: AudienceViewType;

  hidden = false;
  imageSource: SafeResourceUrl;
  imageSourcePDF: string;

  reportType: PaperType;
  EnumPaperType = PaperType;
  reportSize: PaperSize;
  EnumPaperSize = PaperSize;

  isLoading: boolean;
  isReadyToExport = false;

  errorMessage = '';

  retry = 1;

  constructor(
    public domSanitizer: DomSanitizer,
    public layoutCommonService: LayoutCommonService,
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
  ) {}

  pdfLoaded(): void {
    this.retry = 1;
    this.isLoading = false;
    this.layoutCommonService.toggleUILoader.next(this.isLoading);

    this.isReadyToExport = true;
  }

  pdfLoadFailed(event: { message: string; name: string; status: number }): void {
    const times = 3;
    if (this.retry >= times) {
      this.isLoading = false;
      this.layoutCommonService.toggleUILoader.next(this.isLoading);

      this.errorMessage = event.message;
    } else {
      this.retry++;
      setTimeout(() => {
        this.generatePaperPDF();
      }, 3000);
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams: IPaperRouteParams) => {
      this.initReportSetting(routeParams);
    });
  }

  initReportSetting({ type, size, UUID, orderID, audienceID, route }: IPaperRouteParams): void {
    this.reportType = this.EnumPaperType[type];
    this.reportSize = this.EnumPaperSize[size];
    this.uuid = UUID;
    this.orderId = orderID;
    this.audienceID = audienceID;
    this.originRoute = route;
    this.generatePaperPDF();
  }

  generatePaperPDF(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.layoutCommonService.toggleUILoader.next(this.isLoading);

    this.isReadyToExport = false;
    this.imageSource = undefined;
    this.paperService.generatePaperPDF(this.uuid, { type: this.reportType, size: this.reportSize }).subscribe(
      (response) => {
        response.reportUrl = response.reportUrl.replace('/stream/', '/');
        this.imageSource = `${response.reportUrl}?content=pdf`;
        this.imageSourcePDF = response.soruceUrl;

        this.isLoading = false;
        this.isReadyToExport = true;
        this.layoutCommonService.toggleUILoader.next(this.isLoading);
      },
      (err) => {
        alert(err);
      },
    );
  }

  printPDF(): void {
    if (this.isReadyToExport) {
      // const accessToken = getCookie('access_token');
      this.paperService.getPaperPDFFile(this.imageSourcePDF).subscribe(
        (val) => {
          printJS({ printable: URL.createObjectURL(val), type: 'pdf' });
        },
        (err) => {
          alert(err);
        },
      );
    }
  }

  backToPreviousPage(): void {
    if (this.originRoute === AudienceViewType.FOLLOW) {
      void this.router.navigateByUrl(`follows/chat/${this.audienceID}/cart`);
    } else {
      void this.router.navigateByUrl(`order/order-info/${this.audienceID}/cart`);
    }
  }

  changeReportType(type: PaperType): void {
    this.reportType = type;
    this.generatePaperPDF();
  }

  selectReportSize(size: PaperSize): void {
    this.reportSize = size;
    this.generatePaperPDF();
  }
}
