import { VisitorResponse } from '../validate/visitor.model';
let visitor = 0;

// TODO: For POC Subscription only should be replace by pubsub
export const visitorAsyncIterator = {
  from: 1,
  to: 100,

  [Symbol.asyncIterator]() {
    // (1)
    return {
      current: this.from,
      last: this.to,

      async next() {
        // (2)

        // note: we can use "await" inside the async next:
        await new Promise((resolve) => setTimeout(resolve, 2000)); // (3)

        if (this.current <= this.last) {
          return { done: false, value: { visitorSubscription: { pageID: 603, visitor: this.current++ } } };
        } else {
          return { done: true };
        }
      },
    };
  },
};

export class VisitorService {
  constructor() {}

  getVisitor(pageID: number): VisitorResponse {
    visitor++;
    visitorAsyncIterator[Symbol.asyncIterator]().next();
    return {
      visitor: visitor,
      pageID,
    };
  }
  setVisitor(pageID: number, newVisitor: number): VisitorResponse {
    visitor = newVisitor;
    visitorAsyncIterator[Symbol.asyncIterator]().next();
    return {
      visitor: visitor,
      pageID,
    };
  }
}
