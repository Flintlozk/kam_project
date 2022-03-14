import { Component, Input, ViewEncapsulation } from '@angular/core';

export enum SvgIconName {
  icon_service = 'icon_service',
  icon_Leads = 'icon_Leads',
  open_order = 'open_order',
  chat_select_images = 'chat_select_images',
  preset_template = 'preset_template',
  chat_send = 'chat_send',
  chat_select_attachments = 'chat_select_attachments',
  chat_tag = 'chat_tag',
  chatbox_status_true = 'chatbox_status_true',
  chatbox_status_false = 'chatbox_status_false',
}

@Component({
  selector: 'reactor-room-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SvgComponent {
  @Input() name: string;
  @Input() fill = 'white' as string;
  @Input() stroke = 'white' as string;
  @Input() height: string;

  svg = SvgIconName;
  constructor() {}

  /* eslint-disable max-len */
  registeredIcon = {
    icon_service: `<svg   width="25px" height="20px" viewBox="0 0 67 62" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61 (89581) - https://sketch.com -->
    <title>icon_follow</title>
    <desc>Created with Sketch.</desc>
    <g id="icon-more-commerce" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Menu" transform="translate(-385.000000, -268.000000)">
        <g id="icon_follow" transform="translate(385.000000, 268.000000)">
          <path
            d="M14.3787861,59.161204 C15.1832662,57.8233086 16.1446889,56.5764865 17.2488292,55.443297 C20.8669769,51.7299366 25.6448838,49.6258852 30.754731,49.5051553 L31.2,49.5 L36.8,49.5 C42.0608616,49.5 47.0206752,51.6146321 50.7511678,55.4432939 C51.7112635,56.4286491 52.563449,57.4999127 53.2981596,58.6424684 C60.9269096,52.6311644 65.5,43.4506895 65.5,33.5 C65.5,15.826888 51.173112,1.5 33.5,1.5 C15.826888,1.5 1.5,15.826888 1.5,33.5 C1.5,43.7529751 6.35718459,53.1798402 14.3787861,59.161204 Z M34,19.5 C40.3424271,19.5 45.5,24.6575729 45.5,31 C45.5,37.3424271 40.3424271,42.5 34,42.5 C27.6575729,42.5 22.5,37.3424271 22.5,31 C22.5,24.6575729 27.6575729,19.5 34,19.5 Z"
            id="Combined-Shape"
            stroke="#53B1FF"
            stroke-width="3"
          ></path>
          <path
            d="M49.6768267,55.4900943 C46.2272267,51.949717 41.6541733,50 36.8,50 L31.2,50 C26.34592,50 21.7727733,51.949717 18.3231733,55.4900943 C14.8904667,59.0131132 13,63.6634906 13,68.5849057 C13,69.3664151 13.6268267,70 14.4,70 L53.6,70 C54.3731733,70 55,69.3664151 55,68.5849057 C55,63.6634906 53.1095333,59.0131132 49.6768267,55.4900943 Z M34,44 C28.486,44 24,39.514 24,34 C24,28.486 28.486,24 34,24 C39.514,24 44,28.486 44,34 C44,39.514 39.514,44 34,44 Z"
            id="Shape"
            fill-rule="nonzero"
          ></path>
        </g>
      </g>
    </g>
  </svg>`,
    icon_Leads: `<svg width="21px" height="22px" viewBox="0 0 67 71" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Plusmar-Inbox" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Menu" transform="translate(-492.000000, -163.000000)">
        <g id="icon_Leads" transform="translate(494.000000, 165.000000)">
          <path
            d="M32.3,36 C34.959275,36 37.5563826,36.4288942 40.01613,37.2547992 C35.1736715,40.5921704 32,46.1754598 32,52.5 C32,56.3996907 33.2066029,60.0175641 35.2668398,63.0006514 L1.9,63 C0.850693333,63 0,62.1446604 0,61.0896226 C0,54.4457123 2.56563333,48.1677028 7.22430667,43.4116274 C11.9059067,38.6321179 18.11232,36 24.7,36 L24.7,36 Z M27.5,28 C20.0561,28 14,21.7196 14,14 C14,6.2804 20.0561,-7.10542736e-14 27.5,-7.10542736e-14 C34.9439,-7.10542736e-14 41,6.2804 41,14 C41,21.7196 34.9439,28 27.5,28 Z"
            id="Shape"
            [ngStyle]="{ stroke: '#54b1ff' }"
            stroke-width="3"
            fill-rule="nonzero"
          ></path>
          <circle id="Oval" [ngStyle]="{ stroke: '#54b1ff' }" stroke-width="3" cx="47.5" cy="51.5" r="16"></circle>
          <path
            d="M53.6904138,54.0131422 L47.6191723,54.0131422 L47.6191723,44.4934289 C47.6191723,43.6686309 47.0328506,43 46.3095862,43 C45.5863217,43 45,43.6686309 45,44.4934289 L45,55.4767025 C45.0070339,56.3118092 45.5970992,56.9879573 46.3293609,57 L53.6904138,57 C54.4136783,57 55,56.3313691 55,55.5065711 C55,54.6817731 54.4136783,54.0131422 53.6904138,54.0131422 L53.6904138,54.0131422 Z"
            id="Path"
            [ngStyle]="{ stroke: '#9799A5' }"
            fill-rule="nonzero"
          ></path>
        </g>
      </g>
    </g>
  </svg>`,
    open_order: `<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.3034 5.81319L11.6762 1.17975C11.1238 -0.393251 8.87622 -0.393253 8.32379 1.17975L6.69658 5.81319L1.74158 5.91314C0.0594127 5.94707 -0.635127 8.06279 0.70563 9.06889L4.65496 12.0325L3.21981 16.7277C2.73259 18.3216 4.55092 19.6292 5.93197 18.678L10 15.8762L14.068 18.678C15.4491 19.6292 17.2674 18.3216 16.7802 16.7277L15.345 12.0325L19.2944 9.06889C20.6351 8.06279 19.9406 5.94707 18.2584 5.91314L13.3034 5.81319ZM10.6304 1.53957C10.4226 0.948001 9.57737 0.948 9.36962 1.53957L7.64192 6.45915C7.55027 6.72012 7.30421 6.89706 7.02514 6.90269L1.76414 7.0088C1.13152 7.02156 0.870321 7.81723 1.37455 8.1956L5.56776 11.3422C5.7902 11.5091 5.88418 11.7954 5.80335 12.0598L4.27958 17.045C4.09635 17.6445 4.78018 18.1362 5.29956 17.7785L9.61881 14.8036C9.84793 14.6458 10.1521 14.6458 10.3812 14.8036L14.7004 17.7785C15.2198 18.1362 15.9037 17.6445 15.7204 17.045L14.1966 12.0598C14.1158 11.7954 14.2098 11.5091 14.4322 11.3422L18.6255 8.1956C19.1297 7.81723 18.8685 7.02156 18.2359 7.0088L12.9749 6.90269C12.6958 6.89706 12.4497 6.72012 12.3581 6.45915L10.6304 1.53957Z"
      fill="#54b1ff"
    />
  </svg>`,
    preset_template: `<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16.4638L16 22V0H0V22L8 16.4638ZM2 18.1838L8 14.0316L14 18.1838V2H2V18.1838Z" [ngStyle]="{ fill: fill }" />
  </svg>
`,
    chat_send: `  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.40002 18.4V22.8762C8.40002 23.1889 8.62506 23.4658 8.95827 23.5643C9.04158 23.5884 9.12705 23.6 9.21143 23.6C9.46459 23.6 9.7091 23.4938 9.86489 23.3047L12.8 19.7415L8.40002 18.4Z"
      [ngStyle]="{ fill: fill }"
    />
    <path
      d="M23.685 0.14187C23.455 -0.0243895 23.153 -0.0468294 22.903 0.08679L0.403043 12.0717C0.137044 12.2135 -0.0199555 12.5032 0.00204447 12.8082C0.0250444 13.1142 0.224044 13.3753 0.507043 13.4742L6.76202 15.655L20.083 4.03723L9.77501 16.7046L20.258 20.3592C20.336 20.3857 20.418 20.4 20.5 20.4C20.636 20.4 20.771 20.3623 20.89 20.2888C21.08 20.1705 21.209 19.9716 21.242 19.7482L23.992 0.878306C24.033 0.592708 23.915 0.309149 23.685 0.14187Z"
      [ngStyle]="{ fill: fill }"
    />
  </svg>`,
    chat_select_images: `<svg  width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.27529 17.4606C4.66777 17.4606 3.23785 16.4266 2.71862 14.8873L2.6835 14.7713C2.56104 14.3636 2.50974 14.0208 2.50974 13.6778V6.80002L0.0737209 14.9689C-0.239585 16.1704 0.474362 17.4161 1.67224 17.748L17.1994 21.9254C17.3932 21.9758 17.587 22 17.7779 22C18.7779 22 19.6917 21.3332 19.9478 20.3506L20.8525 17.4606H6.27529Z"
      [ngStyle]="{ fill: fill }"
    />
    <path
      d="M9.04927 7.20001C10.1342 7.20001 11.0164 6.30301 11.0164 5.20001C11.0164 4.09702 10.1342 3.20001 9.04927 3.20001C7.96431 3.20001 7.08197 4.09702 7.08197 5.20001C7.08197 6.30301 7.96431 7.20001 9.04927 7.20001Z"
      [ngStyle]="{ fill: fill }"
    />
    <path
      d="M21.4999 0H6.49993C5.12207 0 4 1.12206 4 2.5001V13.4999C4 14.8779 5.12207 16 6.49993 16H21.4999C22.8779 16 24 14.8779 24 13.4999V2.5001C24 1.12206 22.8779 0 21.4999 0ZM6.49993 2.00005H21.4999C21.776 2.00005 21.9999 2.22398 21.9999 2.5001V9.59905L18.841 5.91298C18.5059 5.52004 18.0209 5.31002 17.5 5.29812C16.982 5.30105 16.496 5.53102 16.164 5.92909L12.4499 10.3869L11.24 9.17992C10.5561 8.49603 9.44298 8.49603 8.76 9.17992L6.00006 11.9389V2.5001C6.00006 2.22398 6.22399 2.00005 6.49993 2.00005Z"
      [ngStyle]="{ fill: fill }"
    />
  </svg>`,
    chat_select_attachments: `<svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.7255 8.01234C20.361 7.6553 19.7715 7.65689 19.4089 8.01582L8.21728 19.0949C6.7653 20.5245 4.40708 20.5245 2.95239 19.093C1.4988 17.661 1.4988 15.339 2.95257 13.9076L14.4755 2.50238C15.382 1.60986 16.8558 1.60986 17.7649 2.50431C18.6738 3.3992 18.6738 4.85016 17.7647 5.7453L8.21902 15.1441L8.21728 15.1459C7.85362 15.502 7.2659 15.5016 6.90299 15.1442C6.53946 14.7863 6.53946 14.2062 6.90299 13.8482L11.5106 9.31053C11.8741 8.95251 11.8741 8.37208 11.5105 8.01414C11.1468 7.6562 10.5573 7.65625 10.1938 8.01427L5.58625 12.5519C4.49562 13.6257 4.49562 15.3667 5.58634 16.4406C6.67701 17.5145 8.44517 17.5145 9.53589 16.4406C9.53715 16.4393 9.53938 16.4368 9.53938 16.4368L19.0813 7.04161C20.7176 5.4305 20.7176 2.81872 19.0813 1.20762C17.4448 -0.40254 14.7924 -0.40254 13.1571 1.20762L1.63418 12.613C-0.544988 14.7586 -0.544987 18.2411 1.63575 20.3894C3.81792 22.5369 7.35484 22.5369 9.53571 20.3895L20.7291 9.30873C21.0917 8.94976 21.0901 8.36937 20.7255 8.01234Z"
      [ngStyle]="{ fill: fill }"
    />
  </svg>`,
    chat_tag: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19.9599 9.5225C19.9596 9.39348 19.9481 9.20163 19.913 8.92066C19.758 7.68219 19.2855 4.06173 19.1183 2.91995C18.4645 2.83357 17.2453 2.67031 16.0354 2.5083L15.9923 2.50252C14.4698 2.29864 12.9717 2.09802 12.59 2.04902C12.559 2.04503 12.5327 2.04255 12.5107 2.04106C11.911 2.64171 8.82066 5.72983 6.09928 8.44921C4.63476 9.91267 3.27709 11.2693 2.47201 12.0741C4.00208 13.6066 7.50693 17.1055 9.42769 19.023C9.62024 19.2152 9.79686 19.3915 9.95399 19.5484C12.2725 17.2326 18.99 10.5219 19.9598 9.5477C19.9599 9.53972 19.9599 9.53132 19.9599 9.5225ZM16.2442 0.478964C14.733 0.276596 13.2371 0.0762739 12.85 0.0265649C12.065 -0.0742152 11.547 0.116981 11.1557 0.511333C10.938 0.730812 7.68879 3.97757 4.79601 6.86818C2.49115 9.17129 0.412562 11.2483 0.273835 11.3879C-0.0390078 11.7027 -0.140069 12.3289 0.273835 12.756C0.595613 13.088 5.67408 18.1577 8.06887 20.5484C8.7545 21.2329 9.22015 21.6977 9.29123 21.7689C9.61055 22.0889 10.3198 22.065 10.6167 21.7689C10.9137 21.4729 21.1127 11.2853 21.5203 10.8708C21.9278 10.4562 22.1045 10.0043 21.9373 8.66762C21.77 7.33098 21.215 3.07857 21.0927 2.33658C20.9704 1.59458 20.552 1.04894 19.7646 0.948067C19.3656 0.896949 17.7968 0.686876 16.2442 0.478964Z"
      [ngStyle]="{ fill: fill }"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.2277 8.79974C13.7767 9.34847 14.6668 9.34847 15.2158 8.79974C15.7648 8.25102 15.7648 7.36137 15.2158 6.81264C14.6668 6.26392 13.7767 6.26392 13.2277 6.81264C12.6787 7.36137 12.6787 8.25102 13.2277 8.79974ZM11.7851 10.2416C13.1308 11.5866 15.3126 11.5866 16.6583 10.2416C18.004 8.89656 18.004 6.71583 16.6583 5.3708C15.3126 4.02577 13.1308 4.02577 11.7851 5.3708C10.4395 6.71583 10.4395 8.89656 11.7851 10.2416Z"
      [ngStyle]="{ fill: fill }"
    />
  </svg>`,
    chatbox_status_true: `  <svg
    [ngStyle]="{ height: height ? height : 49 }"
    width="47"
    height="49"
    viewBox="0 0 47 49"
    fill="white"
    stroke="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.5 2C11.6451 2 2 11.9179 2 24.1082C2 26.8781 2.49531 29.5883 3.47449 32.1685C4.23546 34.1504 5.24352 35.971 6.47741 37.5954L3.54637 44.6621C3.31124 45.2286 3.39671 45.8812 3.76843 46.3636C4.08143 46.77 4.55495 47 5.04805 47C5.14113 47 5.23532 46.9922 5.32891 46.9748L16.4333 44.9822C18.6573 45.8016 21.0321 46.2164 23.5 46.2164C35.355 46.2164 45 36.2984 45 24.1082C45 11.9179 35.355 2 23.5 2Z"
      [ngStyle]="{ fill: fill, stroke: stroke }"
      stroke="white"
      stroke-width="4"
    />
    <path
      d="M24.6312 17.7532L35.2399 28.0303C35.5873 28.367 35.5867 28.9122 35.2381 29.2483C34.8896 29.5842 34.3249 29.5833 33.9773 29.2466L24 19.5812L14.0227 29.2469C13.675 29.5836 13.1107 29.5845 12.7621 29.2487C12.5874 29.0801 12.5 28.8594 12.5 28.6386C12.5 28.4184 12.5868 28.1985 12.7603 28.0303L23.3688 17.7532C23.5358 17.591 23.7631 17.5 24 17.5C24.2368 17.5 24.4638 17.5913 24.6312 17.7532Z"
      [ngStyle]="{ fill: fill, stroke: stroke }"
      fill="#53B1FF"
      stroke="white"
      stroke-width="2"
    />
  </svg>`,
    chatbox_status_false: `  <svg
    [ngStyle]="{ height: height ? height : 49 }"
    width="47"
    height="49"
    viewBox="0 0 47 49"
    fill="white"
    stroke="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.5 2C11.6451 2 2 11.9179 2 24.1082C2 26.8781 2.49531 29.5883 3.47449 32.1685C4.23546 34.1504 5.24352 35.971 6.47741 37.5954L3.54637 44.6621C3.31124 45.2286 3.39671 45.8812 3.76843 46.3636C4.08143 46.77 4.55495 47 5.04805 47C5.14113 47 5.23532 46.9922 5.32891 46.9748L16.4333 44.9822C18.6573 45.8016 21.0321 46.2164 23.5 46.2164C35.355 46.2164 45 36.2984 45 24.1082C45 11.9179 35.355 2 23.5 2Z"
      [ngStyle]="{ fill: fill, stroke: stroke }"
      stroke-width="4"
    />
    <path
      d="M23.3688 31.2468L12.7601 20.9697C12.4127 20.633 12.4133 20.0878 12.7619 19.7517C13.1104 19.4158 13.6751 19.4167 14.0227 19.7534L24 29.4188L33.9773 19.7531C34.325 19.4164 34.8893 19.4155 35.2379 19.7513C35.4126 19.9199 35.5 20.1406 35.5 20.3614C35.5 20.5816 35.4132 20.8015 35.2397 20.9697L24.6312 31.2468C24.4642 31.409 24.2369 31.5 24 31.5C23.7632 31.5 23.5362 31.4087 23.3688 31.2468Z"
      [ngStyle]="{ fill: fill, stroke: stroke }"
      stroke-width="2"
    />
  </svg>`,
  };
  /* eslint-enbaled max-len */
}
