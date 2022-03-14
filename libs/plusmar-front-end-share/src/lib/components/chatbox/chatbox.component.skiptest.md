import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { MessageService } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.service';
import { ClickOutsideModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { of } from 'rxjs';
import { ChatDisplayDateModule } from '@reactor-room/plusmar-front-end-share/pipes/chat-display-date.module';
import { GenerateFilePreviewPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/generate-file-preview/generate-file-preview.module';
import { OrderIdPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/order-id.pipe.module';
import { TodayYesterdayDateModule } from '@reactor-room/plusmar-front-end-share/pipes/today-yesterday-date.module';
import { AttachmentDisplayModule } from '../attachment-display/attachment-display.module';
import { SvgModule } from '../svg/svg.module';
import { ChatboxComponent } from './chatbox.component';
import { ChatboxService } from '../../services/chatbox.service';
import { PreviousMessagesComponent } from './previous-messages/previous-messages.component';
import { PreviousMessagesModule } from './previous-messages/previous-messages.module';
import { TemplatesModule } from './templates/templates.module';

export function MockComponent(options: Component & { identifier?: any }): Component {
const metadata: Component & { identifier: any } = {
selector: options.selector,
identifier: options.identifier,
template: options.template || '',
inputs: options.inputs,
outputs: options.outputs || [],
exportAs: options.exportAs || '',
};

class Mock {}

metadata.outputs.forEach((method) => {
Mock.prototype[method] = new EventEmitter<any>();
});

if (options.identifier) {
metadata.providers = [{ provide: PreviousMessagesComponent, useClass: Mock }];
}

return Component(metadata)(Mock as any);
}

xdescribe('ChatboxComponent', () => {
let spectator: Spectator<ChatboxComponent>;
const createComponent = createComponentFactory({
component: ChatboxComponent,
declarations: [ChatboxComponent],
imports: [
CommonModule,
TranslateModule.forRoot(),
MatTooltipModule,
OrderIdPipeModule,
SvgModule,
CustomTableModule,
FormsModule,
TemplatesModule,
ChatDisplayDateModule,
TodayYesterdayDateModule,
ClickOutsideModule,
MatMenuModule,
TimeAgoPipeModule,
GenerateFilePreviewPipeModule,
AttachmentDisplayModule,
PreviousMessagesModule,
],
});
let chatboxService;
let messageService;
let customerService;

beforeEach(() => {
spectator = createComponent({
props: {
audienceId: 1,
customerID: 1,
messages$: of([
{
_id: '5facc116d4e3f52e50c6abf2',
mid: 'm_sN4UYZuT-mGbLOoQiBUFSR4k25UvJe_lw-YU4IHDUQoI3JjXxjLMGIbVuLsaUiu0Y6yAPYeHe39Bul5GRgIu3w',
text: 'good. very good',
attachments: null,
audienceID: 1304,
pageID: 262,
createdAt: '1605157141834',
sentBy: 'PAGE',
sender: {
user_id: 156,
user_name: 'Danil Trapeznikov',
},
},
{
_id: '5facc142d4e3f52e50c6abf4',
mid: 'm_chnb9KJGLfYhYjGkfpGUZR4k25UvJe_lw-YU4IHDUQpuP4wMtfYIzrV_EeIRzMW8NnTDMqKHZLglnUPdxL5sLw',
text: 'What is your phone number?',
attachments: null,
audienceID: 1304,
pageID: 262,
createdAt: '1605157185994',
sentBy: 'PAGE',
sender: {
user_id: 156,
user_name: 'Danil Trapeznikov',
},
},
]),
},
});
chatboxService = spectator.inject<ChatboxService>(ChatboxService);
messageService = spectator.inject<MessageService>(MessageService);
customerService = spectator.inject<CustomerService>(CustomerService);
});

it('addPreviousMessages', () => {
const addPreviousMessagesSpy = jest.spyOn(spectator.component, 'addPreviousMessages');
expect(addPreviousMessagesSpy).toBeCalled();
});
});
