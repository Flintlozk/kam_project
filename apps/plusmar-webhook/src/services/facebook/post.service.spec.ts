import { PostHandler } from './post.service';
import { mock } from '../../test/mock';
import { IPages } from '@reactor-room/itopplus-model-lib';

jest.mock('@reactor-room/itopplus-back-end-helpers');

describe('Webhook Post Handler start()', () => {
  const _pH = new PostHandler();

  beforeAll(() => {
    mock(_pH.pageService, 'getPageByFacebookPageID', jest.fn().mockReturnValueOnce('page'));
  });

  test('handlerStatus() should have called', async () => {
    mock(_pH.webhookHelper, 'getItemFromComment', jest.fn().mockReturnValueOnce('status'));
    mock(_pH, 'handlerStatus', jest.fn());

    await _pH.start({ id: '1' });
    expect(_pH.handlerStatus).toBeCalledTimes(1);
  });

  test('handlerPhoto() should have called', async () => {
    mock(_pH.webhookHelper, 'getItemFromComment', jest.fn().mockReturnValueOnce('photo'));
    mock(_pH, 'handlerPhoto', jest.fn());

    await _pH.start({ id: '1' });
    expect(_pH.handlerPhoto).toBeCalledTimes(1);
  });

  test('handlerLike() should have called', async () => {
    mock(_pH.webhookHelper, 'getItemFromComment', jest.fn().mockReturnValueOnce('like'));
    mock(_pH, 'handlerLike', jest.fn());

    await _pH.start({ id: '1' });
    expect(_pH.handlerLike).toBeCalledTimes(1);
  });
});

describe('Webhook Post Handler handlerStatus()', () => {
  const _pH = new PostHandler();

  test('onEdittedStatusAndPhoto() should have called', async () => {
    mock(_pH.webhookHelper, 'getVerbFromComment', jest.fn().mockReturnValue('edited'));
    mock(_pH.webhookHelper, 'getPostIDFromComment', jest.fn().mockReturnValue('postID'));
    mock(_pH, 'onEdittedStatusAndPhoto', jest.fn());

    await _pH.handlerStatus('hook', {} as IPages);
    expect(_pH.onEdittedStatusAndPhoto).toBeCalledTimes(1);
  });
});
describe('Webhook Post Handler handlerPhoto()', () => {
  const _pH = new PostHandler();

  test('onEdittedStatusAndPhoto() should have called', async () => {
    mock(_pH.webhookHelper, 'getVerbFromComment', jest.fn().mockReturnValue('edited'));
    mock(_pH.webhookHelper, 'getPostIDFromComment', jest.fn().mockReturnValue('postID'));
    mock(_pH, 'onEdittedStatusAndPhoto', jest.fn());

    await _pH.handlerPhoto('hook', {} as IPages);
    expect(_pH.onEdittedStatusAndPhoto).toBeCalledTimes(1);
  });
});

describe('Webhook Post Handler onEdittedStatusAndPhoto()', () => {
  const _pH = new PostHandler();

  test('updateEdittedPost() should NOT!! have called', async () => {
    mock(_pH.postService, 'getPostByID', jest.fn().mockResolvedValueOnce(false));
    mock(_pH.postService, 'updateEdittedPost', jest.fn());

    await _pH.onEdittedStatusAndPhoto('hook', 'type', 1);
    expect(_pH.postService.updateEdittedPost).not.toBeCalled();
  });
  test('updateEdittedPost() should have called', async () => {
    mock(_pH.postService, 'getPostByID', jest.fn().mockResolvedValueOnce(true));
    mock(_pH.postService, 'updateEdittedPost', jest.fn());

    await _pH.onEdittedStatusAndPhoto('hook', 'type', 1);
    expect(_pH.postService.updateEdittedPost).toBeCalledTimes(1);
  });
});
