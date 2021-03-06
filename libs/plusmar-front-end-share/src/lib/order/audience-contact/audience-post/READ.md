<div class="post-info">
  <!-- POST SECTION -->
  <div class="post-header" *ngIf="page$">
    <div class="page">
      <img [src]="page$?.shop_picture" />
      <!-- <div class="txt" [innerText]="page$?.page_name"></div> -->
      <div class="txt">
        <div>{{ page$?.page_name }}</div>
        <div class="time" *ngIf="posts$ && posts$.length && selectedPost?._id">
          {{ selectedPost.createdAt | timeAgo: 'utc' }}
        </div>
      </div>
    </div>
    <div class="posts" *ngIf="posts$ && posts$.length && selectedPost?._id">
      <div class="total">
        <div class="tile">
          <img class="icon" src="assets/img/totalpost.svg" />
          <div>{{ 'Total posts' | translate }} ({{ posts$.length }})</div>
        </div>
      </div>
    </div>
  </div>
  <div class="post-picker select-options" *ngIf="posts$ && posts$.length > 1 && selectedPost?._id">
    <div class="posts" *ngIf="posts$ && posts$.length && selectedPost?._id">
      <div class="total">
        <div class="tile">
          <img class="icon" src="assets/img/totalpost.svg" />
          <span>&nbsp;({{ posts$.length }})</span>
        </div>
      </div>
    </div>
    <mat-form-field>
      <mat-select (selectionChange)="onChangePost($event)" [(value)]="defaultPost">
        <mat-option *ngFor="let post of posts$; let i = index" [value]="post._id">
          {{ post?.payload?.message | textTrim: 250 }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  </div>

  <div class="post-not-found" *ngIf="!posts$ || !posts$.length || !selectedPost?._id">
    <div class="title">{{ 'Please select an action' | translate }}</div>
    <div class="content">
      <div class="main">
        {{ 'Click' | translate }} <span class="follow">“{{ 'Move to...' | translate }}”</span>
      </div>
      <div class="text" style="display: flex; margin: 10px 0" *ngIf="originRoute === 'MESSAGE'">
        <reactor-room-svg name="'icon_service'"></reactor-room-svg>
        <span class="ml-10">
          {{ 'Follow : Keep “Audience” in touch' | translate }}
        </span>
      </div>
      <div class="text" style="display: flex; margin: 10px 0">
        <reactor-room-svg [name]="'open_order'"></reactor-room-svg>
        <span class="ml-10"> {{ 'Open Order' | translate }}{{ ' : ' }}{{ 'Move Audience to purchasing order flow' | translate }} </span>
      </div>
      <div class="text" style="display: flex; margin: 10px 0">
        <reactor-room-svg [name]="'icon_Leads'"></reactor-room-svg>
        <span class="ml-10"> {{ 'Lead' | translate }}{{ ' : ' }}{{ 'Toggle lead form selection for collect Audience data' | translate }} </span>
      </div>
    </div>

    <div class="content">
      <div class="main">
        {{ 'Click' | translate }} <span class="not-customer">“{{ 'Not Customer' | translate }}”</span>
      </div>
      <div class="sub">{{ 'Remove current Audience from contact' | translate }}</div>
    </div>

  </div>

  <div class="post-content">
    <div class="text" [@slideInOut] #description (reactorRoomOnDomChange)="onDescriptionDomChange($event)" [innerText]="selectedPost?.payload?.message" *ngIf="selectedPost"></div>

    <div class="imgs" *ngIf="selectedPost?.payload?.child_attachments?.length > 0">
      <div class="img" *ngFor="let attachment of selectedPost?.payload?.child_attachments">
        <img (click)="zoomIn(attachment.picture, 'image')" [src]="attachment.picture" />
      </div>
    </div>

    <div class="imgs" *ngIf="selectedPost?.payload?.attachments?.data?.length > 0">
      <div class="img" *ngFor="let attachment of (selectedPost?.payload?.attachments?.data)[0]?.subattachments?.data">
        <img (click)="zoomIn(attachment.media.image.src, 'image')" [src]="attachment.media.image.src" />
      </div>
    </div>

    <div class="imgs" *ngIf="!selectedPost?.payload?.attachments && selectedPost?.payload?.full_picture">
      <div class="img">
        <img (click)="zoomIn(selectedPost?.payload?.full_picture, 'image')" [src]="selectedPost?.payload?.full_picture" />
      </div>
    </div>

    <!-- <div class="faded" *ngIf="!descriptionContentStatus"></div> -->

  </div>

  <!-- <div class="read-more" (click)="toggleDescriptionContent()" *ngIf="posts$ && posts$.length && selectedPost?._id && readMoreAppearance">
    <span *ngIf="!descriptionContentStatus">{{ 'Show All' | translate }}</span>
    <span *ngIf="descriptionContentStatus">{{ 'Show Less' | translate }}</span>
  </div> -->
  <!-- </div> -->

  <!-- COMMENT SECTION -->
  <!-- <div class="comment-container"> -->

<reactor-room-audience-comments [changePost]="changePost" [pageUsersCount]="pageUsersCount" [audience$]="audience$" [page$]="page$" [selectedPost]="selectedPost">
</reactor-room-audience-comments>

  <!-- </div> -->
</div>
