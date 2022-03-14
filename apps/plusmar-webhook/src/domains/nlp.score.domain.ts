import { IComment } from '@reactor-room/itopplus-model-lib';
import { CommentService } from '@reactor-room/itopplus-services-lib';

export class NlpAnalysis {
  public commentService = new CommentService();

  async autoHideComment(score: number, comment: IComment, accessToken: string): Promise<boolean> {
    try {
      if (score < 50) {
        // tslint:disable-next-line:no-floating-promises
        await this.commentService.hideComment(comment, accessToken);
      }
      return true;
    } catch (err) {
      return false;
    }
  }
}
