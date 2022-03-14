/* eslint-disable @typescript-eslint/no-unused-vars */
import { ILeadPostbackForm, ILeadsFormComponent, PurchaseOrderPostbackPayload } from '@reactor-room/itopplus-model-lib';

// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: () => void) => void;
// eslint-disable-next-line
declare const getQueryParams: any;

declare const MessengerExtensions: any;
let currentLang = '';

interface ILangItems {
  label: string;
  value: string;
  default: boolean;
}

function setLanguage(lang: string, fields: ILeadsFormComponent[]): void {
  currentLang = lang;
  for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
    const field = fields[fieldIndex];
    const fieldControlName = field.options.controlName;
    const fieldValidation = field.options.validation;
    const fieldName = fieldControlName + '-ID';
    const divID = fieldControlName + '-DIV-ID';
    const translationLabel = field.options.translation.find(({ langID }) => langID === lang);
    document.getElementById(fieldName).innerText = translationLabel.langValue;
    const inputValidation = fieldValidation.find(({ rules }) => rules === 'required');
    const inputValidationMsg = inputValidation.translation.find(({ langID }) => langID === lang);
    const inputErrorDiv = document.getElementById(divID).getElementsByClassName('pristine-error')[0] as HTMLElement;
    if (inputErrorDiv) inputErrorDiv.innerText = inputValidationMsg.langValue;
  }
}

function createLanguageSelector(langItems: ILangItems[], fields: ILeadsFormComponent[]): void {
  const langSelector = document.createElement('select');
  langSelector.classList.add('language-selector');
  langSelector.id = 'languageID';
  langItems.forEach((lang) => {
    const option = document.createElement('option');
    option.value = lang.value;
    option.text = lang.label;

    langSelector.appendChild(option);
    if (lang.default) {
      currentLang = lang.value;
      option.setAttribute('selected', 'selected');
      setLanguage(lang.value, fields);
    }
  });
  const languageSelectorDiv = document.getElementById('languageMainDiv');
  languageSelectorDiv.appendChild(langSelector);
  langSelector.addEventListener('change', function () {
    setLanguage(langSelector.value, fields);
  });
}

function setupLanguage(fields: ILeadsFormComponent[]): void {
  const langItems = [] as ILangItems[];
  if (fields.length) {
    const firstField = fields[0];
    const fieldLanguage = firstField.options.translation;
    if (fieldLanguage.length) {
      fieldLanguage.forEach((language) => {
        langItems.push({
          label: language.langName,
          value: language.langID,
          default: language.default,
        });
      });
      createLanguageSelector(langItems, fields);
    }
  }
}

function initiateComponent(formElement: HTMLFormElement, fields: ILeadsFormComponent[]): void {
  const elements = [];
  // Extract language
  for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
    const field = fields[fieldIndex];
    // Create label
    const label = document.createElement('label');
    label.innerText = field.options.label;
    label.id = field.options.controlName + '-ID';
    // Create input
    const input = document.createElement('input');
    input.name = field.options.controlName;
    input.type = field.type;
    const validations = field.options.validation;
    if (validations.length > 0) {
      const isRequireValidation = validations.filter(({ rules }) => rules === 'required');
      if (isRequireValidation.length) input.required = true;
      input.setAttribute('data-pristine-required-message', 'Please choose ' + field.options.label);
    }
    if (input.type === 'tel') {
      input.setAttribute('maxLength', '10');
    }

    elements.push(label, input);
  }

  elements.push(document.createElement('div'));

  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const controlName = elements[elementIndex].name;
    const formGroupDiv = document.createElement('div');
    formGroupDiv.setAttribute('class', 'form-group');
    if (controlName) {
      formGroupDiv.id = controlName + '-DIV-ID';
    }
    formGroupDiv.appendChild(elements[elementIndex]);
    formElement.appendChild(formGroupDiv);
  }

  const button = document.createElement('button');
  button.classList.add('submit-button');
  button.type = 'submit';
  button.innerText = 'Submit';
  formElement.appendChild(button);

  // const pdpa = PDPAButton();
  // formElement.appendChild(pdpa);

  setupLanguage(fields);
}

function PDPAButton(): HTMLDivElement {
  const pdpa = document.createElement('div');
  pdpa.classList.add('pdpa');

  const pdpaTextContainer = document.createElement('div');
  pdpaTextContainer.classList.add('pdpa-text-container');
  const pdpaText = document.createElement('div');
  pdpaText.classList.add('pdpa-text');

  const span1 = document.createElement('span');
  span1.innerHTML = 'I agree to the ';
  pdpaText.appendChild(span1);

  const span2 = document.createElement('span');
  const a1 = document.createElement('a');
  a1.innerHTML = 'terms and conditions and the privacy policy';
  a1.href = '/pdpa/terms';
  span2.appendChild(a1);
  pdpaText.appendChild(span2);

  const span3 = document.createElement('span');
  span3.innerHTML = ' and ';
  pdpaText.appendChild(span3);

  const span4 = document.createElement('span');
  const a2 = document.createElement('a');
  a2.innerHTML = 'Data use policy';
  a2.href = '/pdpa/datause';
  span4.appendChild(a2);
  pdpaText.appendChild(span4);

  const pdpaAccept = document.createElement('button');
  pdpaAccept.innerText = 'Accept';
  pdpaAccept.classList.add('pdpa-accept');
  const clickEvent = pdpaAccept.addEventListener('click', () => {
    pdpa.remove();
  });

  pdpaTextContainer.appendChild(pdpaText);
  pdpaTextContainer.appendChild(pdpaAccept);
  pdpa.appendChild(pdpaTextContainer);

  return pdpa;
}

function addPhoneNumberValidation(pristine): void {
  const elem = document.querySelector('input[type=tel]');
  const regExp = new RegExp('^[0-9]+$');
  const phoneValdiationTransMsg = '';
  if (elem) {
    pristine.addValidator(
      elem,
      function (value, el) {
        if ((value !== null && value.length >= 9) || !regExp.test(value)) {
          const firstDigit = value.substring(0, 1);
          const infrontNumber = value.substring(0, 2);
          const isHomeNumber = infrontNumber === '02' || infrontNumber === '03' || infrontNumber === '04' || infrontNumber === '05' || infrontNumber === '07';
          const checkLength = value.replace(/[^0-9]/g, '').length;
          if (isHomeNumber) {
            if (checkLength === 9) {
              return true;
            } else {
              return false;
            }
          } else {
            if (checkLength === 10 && +firstDigit === 0) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      },
      phoneValdiationTransMsg,
      false,
    );
  }
}

function addKeyEventListnersToInput(fields: ILeadsFormComponent[]): void {
  const inputs = document.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i += 1) {
    inputs[i].addEventListener(
      'keyup',
      function () {
        inputChangeHandler(this, fields);
      },
      false,
    );
  }
}

function inputChangeHandler(input: HTMLInputElement, fields: ILeadsFormComponent[], isSubmit = false) {
  const value = input.value;
  if (value.length === 0 && input.name === 'name') {
    setLanguage(currentLang, fields);
  } else {
    if (value.length === 0 && input.name === 'phoneNumber') {
      setLanguage(currentLang, fields);
    } else {
      if ((value.length >= 7 && input.name === 'phoneNumber') || isSubmit === true) {
        const phoneField = fields.find((field) => field.options.controlName === 'phoneNumber');
        const phoneValidations = phoneField.options.validation;
        const phoneValdiationRules = phoneValidations.find(({ rules }) => rules === 'phoneinit');
        const phoneValdiationTranslation = phoneValdiationRules.translation.find(({ langID }) => langID === currentLang).langValue;
        const divID = 'phoneNumber-DIV-ID';
        const inputErrorDiv = document.getElementById(divID).getElementsByClassName('pristine-error')[0] as HTMLElement;
        if (inputErrorDiv) inputErrorDiv.innerText = phoneValdiationTranslation;
      }
    }
  }
}

function onCloseSuccessMessage(): void {
  MessengerExtensions.requestCloseBrowser(
    function () {
      // close
    },
    function err(err) {
      window.close();
    },
  );
}

function onFormSubmit(formElement, pristine, payloadData, form, MessengerExtensions): void {
  formElement.addEventListener('submit', function (event) {
    event.preventDefault();
    const valid = pristine.validate();
    const inputs = document.querySelectorAll('#form input');
    if (!valid) {
      const inputArr = Array.from(inputs);
      inputArr.forEach((input: HTMLInputElement) => {
        inputChangeHandler(input, payloadData.form.components, true);
      });

      return false;
    }

    const formInputs = [];
    const arrayForms = Array.from(inputs);

    for (let i = 0; i < arrayForms.length; i++) {
      const input = arrayForms[i] as HTMLInputElement;
      formInputs.push({
        value: input.value,
        name: input.name,
      });
    }

    try {
      document.getElementById('lead-container').style.display = 'none';
      document.getElementById('payment-success').style.display = 'block';

      const psid = (<HTMLInputElement>document.getElementById('psid')).value;
      const queryParams = getQueryParams('CUSTOM_FORM', psid);
      const viewtype = document.getElementById('viewtype') as HTMLInputElement;

      const body = {
        formId: payloadData.form.id,
        formJson: JSON.stringify(formInputs),
        ref: payloadData.ref,
        view: viewtype.value,
      } as ILeadPostbackForm;

      POST(`lead/postback?${queryParams}`, body, () => {
        if (typeof MessengerExtensions !== 'function') {
          onCloseSuccessMessage();
        } else {
          MessengerExtensions.requestCloseBrowser();
        }
      });
    } catch (err) {
      console.error('Error ::', err);
    }
  });
}
