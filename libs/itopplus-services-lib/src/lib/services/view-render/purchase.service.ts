import { environmentLib } from '@reactor-room/environment-services-backend';
import { genericRecursive, isAllowCaptureException, isEmpty, numberWithCommas, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import {
  CustomerShippingAddress,
  EnumPurchaseOrderStatus,
  EnumPurchasingPayloadType,
  IFacebookPipelineModel,
  ILogisticSelectorTemplate,
  ILogisticSystemTempMapping,
  IPipelineProductCatalog,
  IPipelineProductCatalogFilter,
  IPipelineProductCatalogVariant,
  IPipelineQuickPay,
  IPipelineSelectProduct,
  IProductVariantPipeline,
  IQuickPayBillTotals,
  IQuickPayList,
  IQuickPayOrderAndOrderItems,
  IQuickPayOrderItems,
  ISalePageProductFilter,
  IVariantsOfProduct,
  PurchaseCustomerDetail,
  ReturnAddBankAccount,
  WebhookProductCatalogFilterTemplateQueries,
  WebhookProductCatalogTemplateQueries,
  WebhookProductCatalogVariantTemplateQueries,
  WebhookPurchaseTemplateQueries,
  WebhookQuickPayTemplateQueries,
  WebviewTokenPayload,
} from '@reactor-room/itopplus-model-lib';
import { EnumGenericRecursiveStatus, IMoreImageUrlResponse } from '@reactor-room/model-lib';
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { ProductCatalogService } from '..';
import { getBankAccount, getQuickPayIsCancel, getQuickPayIsPaid, getQuickPayOrderByID, getQuickPayOrderItemsByOrderID } from '../../data';
import { getAudienceNotActiveByID } from '../../data/audience/get-audience.data';
import { getPurchasingOrderItems, getPurchasingOrderPaymentInfo, getPurchasingOrderUnrefundedPaymentInfo } from '../../data/purchase-order/get-purchase-order.data';
import { getHashLogisitcSystemTempMapping } from '../../domains/logistic-system/logistic-system.domain';
import { getPayloadForCheckout2C2P, getPayloadForCheckoutOmise, getPayloadForCheckoutPaypal, getPayloadForStep2 } from '../../domains/view-render-template';
import { PipelineRejected } from '../../errors';
import { AudienceService } from '../audience/audience.service';
import { AuthService } from '../auth/auth.service';
import { CustomerService } from '../customer/customer.service';
import { LogisticSystemService } from '../logistic/logistic-system.service';
import { PaymentService } from '../payment/payment.service';
import { PipelineMessageService, PipelineService } from '../pipeline';
import { PlusmarService } from '../plusmarservice.class';
import { ProductService } from '../product/product.service';
import { PurchaseOrderReceiptService, PurchaseOrderService, PurchaseOrderUpdateService } from '../purchase-order';
import { LogisticsService } from '../settings/logistics/logistics.service';

export class ViewRenderPurchaseTemplateService {
  public authService: AuthService;
  public pipelineService: PipelineService;
  public pipelineMessageService: PipelineMessageService;
  public purchaseOrderReceiptService: PurchaseOrderReceiptService;
  public purchaseOrderService: PurchaseOrderService;
  public audienceService: AudienceService;
  public customerService: CustomerService;
  public logisticsService: LogisticsService;
  public logisticSystemService: LogisticSystemService;
  public paymentService: PaymentService;
  public productService: ProductService;
  public purchaseOrderUpdateService: PurchaseOrderUpdateService;
  public productCatalogService: ProductCatalogService;
  public addressJson: any;

  constructor(addressJson) {
    this.addressJson = addressJson;
    this.authService = new AuthService();
    this.pipelineService = new PipelineService();
    this.pipelineMessageService = new PipelineMessageService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.purchaseOrderReceiptService = new PurchaseOrderReceiptService();
    this.purchaseOrderUpdateService = new PurchaseOrderUpdateService();
    this.audienceService = new AudienceService();
    this.customerService = new CustomerService();
    this.logisticsService = new LogisticsService();
    this.logisticSystemService = new LogisticSystemService();
    this.paymentService = new PaymentService();
    this.productService = new ProductService();
    this.productCatalogService = new ProductCatalogService();
  }

  async handlePurchaseTemplates(req: Request, res: Response): Promise<void> {
    if (req.method !== 'GET') {
      res.sendStatus(200);
    } else {
      const facebookAgents = ['facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'facebookexternalhit/1.1'];
      if (facebookAgents.includes(req.headers['user-agent'])) {
        res.sendStatus(200);
      } else {
        const { type, view, auth } = new Object(req.query) as WebhookPurchaseTemplateQueries;
        const credential = await this.authService.getCredentialFromToken(auth);
        const facebookAppId = PlusmarService.environment.facebookAppID;

        try {
          // console.log('______________________________ handlePurchaseTemplates:', type);
          switch (type) {
            case EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT:
              await this.handlePipelineStep2(req, res, credential);
              return;
            case EnumPurchasingPayloadType.CHECKOUT_PAYPAL:
              await this.handleCheckoutPaypal(req, res, credential);
              return;
            case EnumPurchasingPayloadType.CHECKOUT_2C2P:
              await this.handleCheckout2C2P(req, res, credential);
              return;
            case EnumPurchasingPayloadType.CHECKOUT_OMISE:
              await this.handleCheckoutOmise(req, res, credential);
              return;

            case EnumPurchasingPayloadType.SELECT_SINGLE_PRODUCT:
              await this.handleSelectSingleProduct(req, res, credential);
              return;
            case EnumPurchasingPayloadType.SELECT_MULTIPLE_PRODUCT:
              await this.handleSelectMultipleProduct(req, res, credential);
              return;
            case EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW:
              await this.handleQuickPayPaymentPreview(req, res, credential);
              return;
            case EnumPurchasingPayloadType.SEND_PRODUCT_CATALOG:
              await this.handleSendProductCatalog(req, res, credential);
              return;
            case EnumPurchasingPayloadType.SEND_PRODUCT_CATALOG_FILTER:
              await this.handleSendProductCatalogFilter(req, res, credential);
              return;
            case EnumPurchasingPayloadType.SEND_PRODUCT_CATALOG_VARIANT:
              await this.handleSendProductCatalogVariant(req, res, credential);
              return;
            case EnumPurchasingPayloadType.SEND_PRODUCT_CATALOG_CART:
              await this.handleSendProductCatalogCart(req, res, credential);
              return;
            default:
              res.render('pages/error.ejs', { facebookAppId });
              return;
          }
        } catch (err) {
          console.log('err [LOG]:--> ', err);
          if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
          if (err instanceof PipelineRejected) {
            res.render('pages/auto-close.ejs', { payload: { type, view, text: 'This step was successful.' }, facebookAppId });
          } else {
            res.render('pages/error.ejs', { facebookAppId });
          }
          return;
        }
      }
    }
  }

  async handlePipelineCompleted(req: Request, res: Response, type: EnumPurchasingPayloadType, pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
    const { view } = new Object(req.query) as WebhookPurchaseTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;

    const pipeline = await this.pipelineService.getPipelineOnHandleTemplate(type, Number(pageID), Number(audienceID));
    if (pipeline.is_auto === false) {
      if (pipeline.status === 'complete') {
        res.render('pages/auto-close.ejs', { payload: { type, view, text: 'This step was successful.' }, facebookAppId });
        return null;
      } else {
        return pipeline;
      }
    } else {
      if (pipeline.status === 'complete') {
        if (pipeline.pipeline === EnumPurchaseOrderStatus.REJECT) {
          res.render('pages/auto-close.ejs', { payload: { type, view, text: 'This step was rejected.' }, facebookAppId });
          return null;
        }
        if (pipeline.pipeline === EnumPurchaseOrderStatus.CLOSE_SALE) {
          res.render('pages/auto-close.ejs', { payload: { type, view, text: 'This step was successful.' }, facebookAppId });
          return null;
        }

        res.render('pages/auto-close.ejs', { payload: { type, view, text: 'This step was successful.' }, facebookAppId });
        return null;
      } else {
        return pipeline;
      }
    }
  }

  async handlePipelineStep2(req: Request, res: Response, { pageID, audienceID, subscriptionID }: WebviewTokenPayload): Promise<void> {
    const { psid, view, auth } = new Object(req.query) as WebhookPurchaseTemplateQueries;
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const PAYMENT_2C2P_REDIRECT_API = PlusmarService.environment.PAYMENT_2C2P_REDIRECT_API;

    const pipeline = await this.handlePipelineCompleted(req, res, type, pageID, audienceID);

    if (pipeline !== null) {
      if (pipeline.is_auto === false) {
        res.render('pages/auto-close.ejs', { payload: { type, view, text: 'Please contact us.' }, facebookAppId });
        return null;
      } else {
        const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, pipeline.order_id);
        products?.map((product) => {
          product?.images?.map((image) => {
            image.mediaLink = transformMediaLinkString(image?.mediaLink, environmentLib.filesServer, subscriptionID);
          });
        });

        if (pipeline.pipeline === EnumPurchaseOrderStatus.FOLLOW) {
          if (products.length > 0) {
            await this.purchaseOrderUpdateService.updateStep(pageID, audienceID, subscriptionID);
            await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(audienceID), Number(pipeline.order_id), Number(pageID));
          }
        }

        const unrefundedTransaction = await getPurchasingOrderUnrefundedPaymentInfo(PlusmarService.readerClient, pageID, pipeline.order_id);
        if (!isEmpty(unrefundedTransaction)) {
          res.render('pages/auto-close.ejs', { payload: { type, view, text: 'การดำเนินการชำระเงินสำเร็จแล้ว.' }, facebookAppId });
          return null;
        } else {
          const payments = await this.paymentService.listPayloadPayment(pageID);
          const accounts = await this.paymentService.listPayloadBankAccount(pageID);
          const order = await this.purchaseOrderService.getPurchasingOrderById(pageID, pipeline.order_id);
          const isLogisticSystem = order.flat_rate;

          // CHECK FLAT_RATE AKA LOGISTIC_SYSTEM
          let logistics: ILogisticSelectorTemplate[] = [];
          if (isLogisticSystem === false) {
            logistics = await this.logisticsService.logisticSelectorTemplateOption(pageID, order);
          }

          const tempShippingMapping: ILogisticSystemTempMapping = await this.logisticSystemService.getLogisticSystemOption(pageID, order, isLogisticSystem, order.logistic_id);
          if (tempShippingMapping) {
            const { shippingFee: shippingPrice } = tempShippingMapping;
            order.delivery_fee = shippingPrice;
          } else {
            order.delivery_fee = 0;
          }
          const hash = getHashLogisitcSystemTempMapping(tempShippingMapping, order.id);
          const paymentDetail = await this.paymentService.getPaymentDetailOfPage(pageID);
          const customer = await this.customerAddressDetailOption(pageID, audienceID, pipeline);
          const settings = getPayloadForStep2(payments, accounts, logistics, order, paymentDetail, this.addressJson, products);
          const payload = { hash, auth, type, view, psid, audienceId: audienceID, ...settings, customer, payment2C2PRedirectApi: PAYMENT_2C2P_REDIRECT_API };

          res.render('pages/step2/pipeline-step2.ejs', { payload, facebookAppId });
          return null;
        }
      }
    } else {
      res.render('pages/auto-close.ejs', { payload: { type, view, text: '404' }, facebookAppId });
      return null;
    }
  }

  async getQuickPayOrderAndOrderItems(pageID: number, audienceID: number, quickPayID: number): Promise<IQuickPayOrderAndOrderItems> {
    const order = await getQuickPayOrderByID(PlusmarService.readerClient, pageID, quickPayID, audienceID);
    const orderItems = await getQuickPayOrderItemsByOrderID(PlusmarService.readerClient, pageID, quickPayID);
    const totals = this.getQuickPayTotals(order, orderItems);
    const isCancel = await getQuickPayIsCancel(PlusmarService.readerClient, pageID, quickPayID);
    const isPaid = await getQuickPayIsPaid(PlusmarService.readerClient, pageID, quickPayID);
    return {
      order,
      orderItems: orderItems.map((item) => ({
        ...item,
        itemPrice: numberWithCommas(item.itemPrice),
        discount: numberWithCommas(item.discount),
      })),
      totals,
      isCancel,
      isPaid,
    };
  }

  getQuickPayTotals(order: IQuickPayList, orderItems: IQuickPayOrderItems[]): IQuickPayBillTotals {
    const { totalPrice, discount, isWithHoldingTax, withHoldingTax } = order;
    const vatTotalAmountTotal = orderItems.map(({ itemPrice, isVat, discount }) => ({
      amount: itemPrice,
      vat: isVat ? (+itemPrice - +discount) * (order.tax / 100) : 0,
    }));
    const amountTotal = (
      vatTotalAmountTotal
        .map(({ amount }) => +amount)
        .reduce((preVal, newVal) => {
          return preVal + newVal;
        }, 0) - discount
    ).toFixed(2);

    const vatTotal = numberWithCommas(
      vatTotalAmountTotal
        .map(({ vat }) => +vat)
        .reduce((preVal, newVal) => {
          return preVal + newVal;
        }, 0)
        .toFixed(2),
    );
    const withHoldingTaxTotal = isWithHoldingTax ? (+amountTotal / 100) * +withHoldingTax : 0;
    return {
      amountTotal: numberWithCommas(amountTotal),
      vatTotal,
      discountTotal: numberWithCommas(discount),
      grandTotal: numberWithCommas(totalPrice),
      withHoldingTaxTotal: numberWithCommas(withHoldingTaxTotal.toFixed(2)),
    };
  }

  async handleQuickPayPaymentPreview(req: Request, res: Response, { pageID, audienceID }: WebviewTokenPayload): Promise<void> {
    const { type, view, psid, quickPayId, auth } = new Object(req.query) as WebhookQuickPayTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const audience = await getAudienceNotActiveByID(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(audience)) {
      const audienceId = String(audienceID);
      const quickPay = await this.getQuickPayOrderAndOrderItems(pageID, audienceID, +quickPayId);
      if (isEmpty(quickPay?.order) || quickPay?.order?.isExpired || quickPay.isCancel) {
        res.render('pages/error.ejs', { facebookAppId, psid });
      } else if (quickPay.isPaid) {
        res.render('pages/payment-success.ejs', { payload: { type, view }, facebookAppId });
      } else {
        const bankDetails = await this.getBankAccountDetails(pageID);
        const payload: IPipelineQuickPay = {
          type,
          view,
          psid,
          audienceId,
          auth,
          quickPay,
          bankDetails,
        };
        res.render('pages/step2/quick-pay-details.ejs', { payload, facebookAppId });
      }
    } else {
      res.render('pages/error.ejs', { facebookAppId, psid });
    }
    return;
  }

  async getBankAccountDetails(pageID: number): Promise<ReturnAddBankAccount[]> {
    const bankData = {
      KBANK: { imgUrl: 'images/bank/KBANK.png', title: 'Kasikorn Bank Pubilc Co., Ltd.' },
      SCB: { imgUrl: 'images/bank/SCB.png', title: 'The Siam Commercial Bank Public Co., Ltd' },
      KTB: { imgUrl: 'images/bank/KTB.png', title: 'Krung Thai Bank Public Co., Ltd' },
      BBL: { imgUrl: 'images/bank/BBL.png', title: 'Bangkok Bank Public Co., Ltd' },
      TMB: { imgUrl: 'images/bank/TMB.png', title: 'TMB Bank Public Co., Ltd' },
      GSB: { imgUrl: 'images/bank/GSB.png', title: 'Government Saving Bank' },
      BAY: { imgUrl: 'images/bank/BAY.png', title: 'Bank of Ayudhya Public Co., Ltd' },
    };
    const bankAccounts = await getBankAccount(PlusmarService.readerClient, pageID);
    return bankAccounts.map((bank) => ({ ...bank, image: bankData[bank.type].imgUrl }))?.filter(({ status }) => status);
  }

  async handleSelectSingleProduct(req: Request, res: Response, { pageID, audienceID, subscriptionID }: WebviewTokenPayload): Promise<void> {
    const { type, view, psid, productId, audienceId, auth } = new Object(req.query) as WebhookPurchaseTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const audience = await getAudienceNotActiveByID(PlusmarService.readerClient, audienceID, pageID);

    if (!isEmpty(audience)) {
      const product = await this.selectOrderSingleProductTemplateOption(pageID, productId, subscriptionID);
      const payload = {
        type,
        view,
        psid,
        audienceId,
        auth,
        product,
      } as IPipelineSelectProduct;
      res.render('pages/select/select-single-product.ejs', { payload, facebookAppId });
    } else {
      res.render('pages/product-link-error.ejs', { facebookAppId, psid });
    }

    return;
  }

  async handleSelectMultipleProduct(req: Request, res: Response, { pageID, audienceID }: WebviewTokenPayload): Promise<void> {
    const { type, view, psid, productId, audienceId, auth } = new Object(req.query) as WebhookPurchaseTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const audience = await getAudienceNotActiveByID(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(audience)) {
      const variants = await this.selectOrderMultipleProductTemplateOption(pageID, productId);
      const product = variants
        ?.filter((variant) => variant.variantInventory > 0)
        ?.map((variant) => ({
          ...variant,
          variantImages: (<IMoreImageUrlResponse>variant?.variantImages[0]).mediaLink,
        })) as IProductVariantPipeline[];
      const payload = {
        type,
        view,
        psid,
        audienceId,
        product,
        auth,
      } as IPipelineSelectProduct;
      res.render('pages/select/select-multiple-product.ejs', { payload, facebookAppId });
    } else {
      res.render('pages/product-link-error.ejs', { facebookAppId, psid });
    }

    return;
  }

  async handleCheckoutPaypal(req: Request, res: Response, { pageID, audienceID: audienceId }: WebviewTokenPayload): Promise<void> {
    const { psid, view, auth } = new Object(req.query) as WebhookPurchaseTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const type = EnumPurchasingPayloadType.CHECKOUT_PAYPAL;
    const pipeline = await this.handlePipelineCompleted(req, res, type, pageID, audienceId);
    if (pipeline !== null) {
      const unrefundedTransaction = await getPurchasingOrderUnrefundedPaymentInfo(PlusmarService.readerClient, pageID, pipeline.order_id);
      if (!isEmpty(unrefundedTransaction)) {
        res.render('pages/auto-close.ejs', { payload: { type, view, text: 'การดำเนินการชำระเงินสำเร็จแล้ว.' }, facebookAppId });
      } else {
        const paymentDetail = await this.paymentService.getPaymentDetailOfPage(pageID);
        const order = await this.purchaseOrderService.getPurchasingOrderById(pageID, pipeline.order_id);
        const logistics = await this.logisticsService.logisticSelectorTemplateOption(pageID, order);
        const isLogisticSystem = order.flat_rate;
        const tempShippingMapping: ILogisticSystemTempMapping = await this.logisticSystemService.getLogisticSystemOption(pageID, order, isLogisticSystem, order.logistic_id);
        if (tempShippingMapping) {
          const { shippingFee: shippingPrice } = tempShippingMapping;
          order.delivery_fee = shippingPrice;
        } else {
          order.delivery_fee = 0;
        }
        const hash = getHashLogisitcSystemTempMapping(tempShippingMapping, order.id);

        const settings = getPayloadForCheckoutPaypal(paymentDetail, order, logistics);
        const customer = await this.customerAddressDetailOption(pageID, audienceId, pipeline);

        const payload = { hash, type, view, psid, audienceId, ...settings, customer, auth };
        res.render('pages/checkout/paypal.ejs', { payload, facebookAppId });
      }
    }
  }

  async handleCheckout2C2P(req: Request, res: Response, { pageID, audienceID: audienceId }: WebviewTokenPayload): Promise<void> {
    const { psid, view, auth } = new Object(req.query) as WebhookPurchaseTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const type = EnumPurchasingPayloadType.CHECKOUT_2C2P;
    const PAYMENT_2C2P_REDIRECT_API = PlusmarService.environment.PAYMENT_2C2P_REDIRECT_API;
    const pipeline = await this.handlePipelineCompleted(req, res, type, pageID, audienceId);
    if (pipeline !== null) {
      const unrefundedTransaction = await getPurchasingOrderUnrefundedPaymentInfo(PlusmarService.readerClient, pageID, pipeline.order_id);
      if (!isEmpty(unrefundedTransaction)) {
        res.render('pages/auto-close.ejs', { payload: { type, view, text: 'การดำเนินการชำระเงินสำเร็จแล้ว.' }, facebookAppId });
      } else {
        const order = await this.purchaseOrderService.getPurchasingOrderById(pageID, pipeline.order_id);
        const logistics = await this.logisticsService.logisticSelectorTemplateOption(pageID, order);
        const isLogisticSystem = order.flat_rate;
        const tempShippingMapping: ILogisticSystemTempMapping = await this.logisticSystemService.getLogisticSystemOption(pageID, order, isLogisticSystem, order.logistic_id);
        if (tempShippingMapping) {
          const { shippingFee: shippingPrice } = tempShippingMapping;
          order.delivery_fee = shippingPrice;
        } else {
          order.delivery_fee = 0;
        }
        const hash = getHashLogisitcSystemTempMapping(tempShippingMapping, order.id);

        const settings = getPayloadForCheckout2C2P(order, logistics);
        const customer = await this.customerAddressDetailOption(pageID, audienceId, pipeline);

        const payload = { hash, type, view, psid, audienceId, customer, auth, ...settings, payment2C2PRedirectApi: PAYMENT_2C2P_REDIRECT_API };

        res.render('pages/checkout/2c2p.ejs', { payload, facebookAppId });
      }
    }
  }

  async handleCheckoutOmise(req: Request, res: Response, { pageID, audienceID: audienceId }: WebviewTokenPayload): Promise<void> {
    const { psid, view, auth } = new Object(req.query) as WebhookPurchaseTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const type = EnumPurchasingPayloadType.CHECKOUT_OMISE;
    const pipeline = await this.handlePipelineCompleted(req, res, type, pageID, audienceId);
    if (pipeline !== null) {
      const unrefundedTransaction = await getPurchasingOrderUnrefundedPaymentInfo(PlusmarService.readerClient, pageID, pipeline.order_id);
      if (!isEmpty(unrefundedTransaction)) {
        res.render('pages/auto-close.ejs', { payload: { type, view, text: 'การดำเนินการชำระเงินสำเร็จแล้ว.' }, facebookAppId });
      } else {
        const paymentDetail = await this.paymentService.getPaymentDetailOfPage(pageID);
        const order = await this.purchaseOrderService.getPurchasingOrderById(pageID, pipeline.order_id);
        const logistics = await this.logisticsService.logisticSelectorTemplateOption(pageID, order);
        const isLogisticSystem = order.flat_rate;
        const tempShippingMapping: ILogisticSystemTempMapping = await this.logisticSystemService.getLogisticSystemOption(pageID, order, isLogisticSystem, order.logistic_id);
        if (tempShippingMapping) {
          const { shippingFee: shippingPrice } = tempShippingMapping;
          order.delivery_fee = shippingPrice;
        } else {
          order.delivery_fee = 0;
        }
        const hash = getHashLogisitcSystemTempMapping(tempShippingMapping, order.id);

        const settings = getPayloadForCheckoutOmise(paymentDetail, order, logistics);
        const customer = await this.customerAddressDetailOption(pageID, audienceId, pipeline);

        const payload = { hash, type, view, psid, audienceId, auth, ...settings, customer };

        res.render('pages/checkout/omise.ejs', { payload, facebookAppId });
      }
    }
  }

  async selectOrderSingleProductTemplateOption(pageID: number, productVariantID: string, subscriptionID: string): Promise<IProductVariantPipeline> {
    const variants = await this.productService.getProductVariantForWebViewByVariantID(pageID, Number(productVariantID), subscriptionID);
    return { ...variants };
  }

  async selectOrderMultipleProductTemplateOption(pageID: number, productId: string): Promise<IVariantsOfProduct[]> {
    const variants = await this.productService.getVariantsOfProduct(pageID, Number(productId), []);
    return variants;
  }

  async customerAddressDetailOption(pageID: number, audienceID: number, pipeline: IFacebookPipelineModel): Promise<PurchaseCustomerDetail | CustomerShippingAddress> {
    const customerDetail = await this.customerService.getCustomerAudienceByID(pageID, audienceID);
    const shippingAddress = await this.customerService.getCustomerShippingAddressByOrder(pageID, pipeline.order_id, customerDetail.customer_id);
    if (!isEmpty(shippingAddress)) {
      return shippingAddress[0];
    } else {
      if (customerDetail.location === null) {
        customerDetail.location = {
          address: '',
          amphoe: '',
          district: '',
          post_code: '',
          province: '',
          country: '',
          city: '',
        };
      }
      if (customerDetail.name === null) {
        customerDetail.name = `${customerDetail.first_name} ${customerDetail.last_name || ''}`;
      }
      return customerDetail;
    }
  }

  async handlePurchaseRedirect(req: Request, res: Response): Promise<void> {
    if (req.method !== 'GET') {
      res.sendStatus(200);
    } else {
      const facebookAgents = ['facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'facebookexternalhit/1.1'];
      if (facebookAgents.includes(req.headers['user-agent'])) {
        res.sendStatus(200);
      } else {
        const { type, view, psid, auth } = new Object(req.query) as WebhookPurchaseTemplateQueries;
        const credential = await this.authService.getCredentialFromToken(auth);
        const facebookAppId = PlusmarService.environment.facebookAppID;

        try {
          switch (type) {
            case EnumPurchasingPayloadType.SUBMIT_2C2P_PAYMENT_SUCCESS: {
              const status = await this.handleRedirectOnSubmit2C2PSuccessful(psid, credential);
              if (status) {
                res.render('pages/payment-success.ejs', { payload: { type, view }, facebookAppId });
              } else {
                res.render('pages/payment-failed.ejs', { payload: { type: EnumPurchasingPayloadType.SUBMIT_2C2P_PAYMENT_FAIL, view }, facebookAppId });
              }
              return;
            }
            case EnumPurchasingPayloadType.SUBMIT_2C2P_PAYMENT_PENDING:
            case EnumPurchasingPayloadType.SUBMIT_2C2P_PAYMENT_REJECTED:
            case EnumPurchasingPayloadType.SUBMIT_2C2P_PAYMENT_CANCELED:
              res.render('pages/auto-close.ejs', { payload: { type, view, text: 'Transaction has been canceled. <br> การชำระเงินถูกยกเลิกแล้ว' }, facebookAppId });
              return;
            case EnumPurchasingPayloadType.GENEREIC_PAYMENT_FAILED:
            case EnumPurchasingPayloadType.SUBMIT_2C2P_PAYMENT_FAIL:
              res.render('pages/fail-auto-close.ejs', { payload: { type, view }, facebookAppId });
              return;
            case EnumPurchasingPayloadType.SUBMIT_OMISE_PAYMENT_PENDING: {
              const status = await this.handleRedirectOnSubmitOmiseSuccessful(psid, credential);
              if (status) {
                res.render('pages/payment-success.ejs', { payload: { type, view }, facebookAppId });
              } else {
                res.render('pages/payment-omise-failed.ejs', { payload: { type: EnumPurchasingPayloadType.SUBMIT_OMISE_PAYMENT_FAILED, view }, facebookAppId });
              }
              return;
            }
            case EnumPurchasingPayloadType.SUBMIT_OMISE_PAYMENT_SUCCESS:
              res.render('pages/payment-success.ejs', { payload: { type, view }, facebookAppId });
              return;
            case EnumPurchasingPayloadType.SUBMIT_OMISE_PAYMENT_FAILED:
              res.render('pages/payment-omise-failed.ejs', { payload: { type, view }, facebookAppId });
              return;
            default:
              res.render('pages/error.ejs', { facebookAppId });
              return;
          }
        } catch (err) {
          if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
          console.log('handlePurchaseRedirect ===> err: ', err);
          res.render('pages/error.ejs', { facebookAppId });
          return;
        }
      }
    }
  }

  async handleRedirectOnSubmit2C2PSuccessful(PSID: string, { pageID, audienceID }: WebviewTokenPayload): Promise<boolean> {
    const { order_id: orderID } = await this.pipelineService.getPipelineOnHandleTemplate(EnumPurchasingPayloadType.SUBMIT_2C2P_PAYMENT_SUCCESS, pageID, audienceID);
    const redisKey = `2C2P_${orderID}`;
    const timerSec = PlusmarService.environment.cronJobConfig.redirect2C2PRepeatTimer;
    const maxRetry = PlusmarService.environment.cronJobConfig.redirect2C2PMaxRetry;

    const result = await genericRecursive(PlusmarService.redisClient, redisKey, timerSec, maxRetry);
    return result === EnumGenericRecursiveStatus.SUCCESS;
  }

  async handleRedirectOnSubmitOmiseSuccessful(PSID: string, { pageID, audienceID }: WebviewTokenPayload): Promise<boolean> {
    const { order_id: orderID } = await this.pipelineService.getPipelineOnHandleTemplate(EnumPurchasingPayloadType.SUBMIT_OMISE_PAYMENT, pageID, audienceID);
    const paymentInfo = await getPurchasingOrderPaymentInfo(PlusmarService.readerClient, pageID, orderID);
    if (!paymentInfo) throw new Error('NO_PAYMENT_INFO');

    const redisKey = `OMISE_${paymentInfo[0].purchase_order_id.toString()}`;
    const timerSec = PlusmarService.environment.cronJobConfig.redirectOmiseRepeatTimer;
    const maxRetry = PlusmarService.environment.cronJobConfig.redirectOmiseMaxRetry;

    const result = await genericRecursive(PlusmarService.redisClient, redisKey, timerSec, maxRetry);
    return result === EnumGenericRecursiveStatus.SUCCESS;
  }

  async handleSendProductCatalog(req: Request, res: Response, { pageID, audienceID, subscriptionID }: WebviewTokenPayload): Promise<void> {
    const { type, view, psid, catalogID, auth, page } = new Object(req.query) as WebhookProductCatalogTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const audience = await getAudienceNotActiveByID(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(audience)) {
      const filter = {} as ISalePageProductFilter;
      const products = await this.productCatalogService.getProductsForSalePage(pageID, page, +catalogID, filter, subscriptionID);
      const payload: IPipelineProductCatalog = {
        type,
        view,
        psid,
        audienceId: String(audienceID),
        auth,
        products,
      };
      res.render('pages/catalog/product-catalog.ejs', { payload, facebookAppId });
    } else {
      res.render('pages/error.ejs', { facebookAppId, psid });
    }
  }

  async handleSendProductCatalogFilter(req: Request, res: Response, { pageID, audienceID }: WebviewTokenPayload): Promise<void> {
    const { type, view, psid, catalogID, auth, search, categoryIDs, tagIDs } = new Object(req.query) as WebhookProductCatalogFilterTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const audience = await getAudienceNotActiveByID(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(audience)) {
      const [tags, categories] = await this.productCatalogService.getTagsCategories(pageID);
      const payload: IPipelineProductCatalogFilter = {
        type,
        view,
        psid,
        audienceId: String(audienceID),
        auth,
        catalogID,
        search,
        categoryIDs,
        tagIDs,
        tags,
        categories,
      };
      res.render('pages/catalog/product-catalog-filter.ejs', { payload, facebookAppId });
    } else {
      res.render('pages/error.ejs', { facebookAppId, psid });
    }
  }

  async handleSendProductCatalogVariant(req: Request, res: Response, { pageID, audienceID, subscriptionID }: WebviewTokenPayload): Promise<void> {
    const { type, view, psid, catalogID, auth, productID } = new Object(req.query) as WebhookProductCatalogVariantTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const audience = await getAudienceNotActiveByID(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(audience)) {
      const [variants, attributes, product] = await this.productCatalogService.getVariantProductAttributeForSalePage(pageID, productID, subscriptionID);
      const payload: IPipelineProductCatalogVariant = {
        type,
        view,
        psid,
        audienceId: String(audienceID),
        auth,
        productID,
        catalogID,
        product,
        variants,
        attributes,
      };
      res.render('pages/catalog/product-catalog-variant.ejs', { payload, facebookAppId });
    } else {
      res.render('pages/error.ejs', { facebookAppId, psid });
    }
  }

  async handleSendProductCatalogCart(req: Request, res: Response, { pageID, audienceID }: WebviewTokenPayload): Promise<void> {
    const { type, view, psid, catalogID, auth } = new Object(req.query) as WebhookProductCatalogVariantTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const audience = await getAudienceNotActiveByID(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(audience)) {
      const payload = {
        type,
        view,
        psid,
        audienceId: String(audienceID),
        auth,
        catalogID,
      };
      res.render('pages/catalog/product-catalog-cart.ejs', { payload, facebookAppId });
    } else {
      res.render('pages/error.ejs', { facebookAppId, psid });
    }
  }
}
