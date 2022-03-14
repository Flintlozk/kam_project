export class PurchasingOrderNotFound extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PurchasingOrderNotFound);

      this.name = 'PurchasingOrderNotFound';
    }
  }
}
export class PurchasingOrderUpdateDisabled extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PurchasingOrderUpdateDisabled);

      this.name = 'PurchasingOrderUpdateDisabled';
    }
  }
}

export class PipelineOnHandlePostbackMessagesError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PipelineOnHandlePostbackMessagesError);

      this.name = 'PipelineOnHandlePostbackMessagesError';
    }
  }
}
export class PipelineOnHandlePostbackButtonError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PipelineOnHandlePostbackButtonError);

      this.name = 'PipelineOnHandlePostbackButtonError';
    }
  }
}

export class AudienceUnavailableError extends Error {
  constructor(...params) {
    const err = params[0];
    super(err);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AudienceUnavailableError);
    }
    this.name = 'AudienceUnavailableError';
    this.message = JSON.stringify(err);
  }
}

export class AttachmentCommentError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AudienceUnavailableError);

      this.name = 'AttachmentCommentError';
    }
  }
}

export class ActivityAlreadyRepliedTo extends Error {
  constructor(...params) {
    const err = params[0];
    super(err);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ActivityAlreadyRepliedTo);
    }
    this.name = 'ActivityAlreadyRepliedTo';
    this.message = JSON.stringify(err);
  }
}
export class AdvanceMessageFailed extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AdvanceMessageFailed);

      this.name = 'AdvanceMessageFailed';
    }
  }
}
export class FacebookPayloadError extends Error {
  public payloadType: string;
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookPayloadError);
      this.name = 'FacebookPayloadError';
      // this.payloadType = payloadType;
    }
  }
}
export class FacebookPayloadOptionError extends Error {
  public payloadType: string;
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookPayloadOptionError);
      this.name = 'FacebookPayloadOptionError';
      // this.payloadType = payloadType;
    }
  }
}

export class PaypalPaymentError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaypalPaymentError);

      this.name = 'PaypalPaymentError';
    }
  }
}

export class Payment2C2PError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Payment2C2PError);

      this.name = 'Payment2C2PError';
    }
  }
}

export class PaymentOmiseError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaymentOmiseError);

      this.name = 'PaymentOmiseError';
    }
  }
}
export class PipelineRejected extends Error {
  constructor(...params) {
    super(...params);

    Error.captureStackTrace(this, PipelineRejected);

    this.name = 'PipelineRejected';
  }
}
export class PipelineException extends Error {
  constructor(...params) {
    super(...params);

    Error.captureStackTrace(this, PipelineRejected);

    this.name = 'PipelineException';
  }
}
export class InsufficientReseveProduct extends Error {
  constructor(...params) {
    super(...params);

    Error.captureStackTrace(this, InsufficientReseveProduct);

    this.name = 'InsufficientReseveProduct';
    // this.message = 'Insuffcient Product for reserved';
  }
}
export class InsufficientProductSupply extends Error {
  constructor(...params) {
    super(...params);

    Error.captureStackTrace(this, InsufficientProductSupply);

    this.name = 'InsufficientProductSupply';
    // this.message = 'Insuffcient Product Supply';
  }
}
