export class FacebookListenerHandlerError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookListenerHandlerError);

      this.name = 'FacebookListenerHandlerError';
    }
  }
}
export class FacebookMessageHandlerError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookMessageHandlerError);

      this.name = 'FacebookMessageHandlerError';
    }
  }
}
export class FacebookCommentHandlerError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookCommentHandlerError);

      this.name = 'FacebookCommentHandlerError';
    }
  }
}

export class FacebookOnCreatePostException extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookOnCreatePostException);

      this.name = 'FacebookOnCreatePostException';
    }
  }
}
export class FacebookOnCreateCommentException extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookOnCreateCommentException);

      this.name = 'FacebookOnCreateCommentException';
    }
  }
}
export class FacebookOnAddCommentException extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookOnAddCommentException);

      this.name = 'FacebookOnAddCommentException';
    }
  }
}
export class FacebookOnEdittedCommentException extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookOnEdittedCommentException);

      this.name = 'FacebookOnEdittedCommentException';
    }
  }
}
export class FacebookOnDeleteCommentException extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookOnDeleteCommentException);

      this.name = 'FacebookOnDeleteCommentException';
    }
  }
}
export class FacebookOnHideCommentException extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookOnHideCommentException);

      this.name = 'FacebookOnHideCommentException';
    }
  }
}
export class FacebookOnUnHideCommentException extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookOnUnHideCommentException);

      this.name = 'FacebookOnUnHideCommentException';
    }
  }
}

export class FacebookPostHandlerError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookPostHandlerError);

      this.name = 'FacebookPostHandlerError';
    }
  }
}
export class FacebookOnPostEdittedHandlerError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookOnPostEdittedHandlerError);

      this.name = 'FacebookOnPostEdittedHandlerError';
    }
  }
}
export class FacebookPostbackHandlerError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookPostbackHandlerError);

      this.name = 'FacebookPostbackHandlerError';
    }
  }
}
export class FacebookReferralHandlerError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookReferralHandlerError);

      this.name = 'FacebookReferralHandlerError';
    }
  }
}
export class FacebookReferralProductHandlerError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookReferralProductHandlerError);

      this.name = 'FacebookReferralProductHandlerError';
    }
  }
}
export class FacebookCreateAudienceError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FacebookCreateAudienceError);

      this.name = 'FacebookCreateAudienceError';
    }
  }
}
