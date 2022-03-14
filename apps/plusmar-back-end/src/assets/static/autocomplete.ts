import { IAddressJQL, IPipelineStep2Combined } from '@reactor-room/itopplus-model-lib';

declare let payloadData: IPipelineStep2Combined;
declare let filteredOptions: IAddressJQL[];
// eslint-disable-next-line
declare const JQL: any;
declare let search: IAddressJQL;

let filterOptionElement: HTMLElement;

let debounceTimer;
const debounceTimerDelay = 500;

let searchIndex = 0;
function preprocess(data): IAddressJQL[] {
  if (!data[0].length) {
    return data;
  }
  const expanded: IAddressJQL[] = [];
  data.forEach((provinceEntry) => {
    const province = provinceEntry[0];
    const amphurList = provinceEntry[1];
    amphurList.forEach((amphurEntry) => {
      const amphur = amphurEntry[0];
      const districtList = amphurEntry[1];
      districtList.forEach((districtEntry) => {
        const district = districtEntry[0];
        const zipCodeList = districtEntry[1];
        zipCodeList.forEach((zipCode) => {
          expanded.push({
            d: district,
            a: amphur,
            p: province,
            z: zipCode,
          } as IAddressJQL);
        });
      });
    });
  });
  return expanded;
}

function clearSelection() {
  const list = document.querySelectorAll("[id^='ADDR_SELECTOR_']");
  list.forEach(function (item) {
    if (item.id !== `ADDR_SELECTOR_${searchIndex}`) {
      item.classList.remove('select-on-focus');
    }
  });
}

function mapValueFromFilter(filter) {
  const location = payloadData.customer.location;

  const post_code = <HTMLInputElement>document.getElementById('post_code');
  post_code.value = String(filter.z);
  location.post_code = String(filter.z);

  const district = <HTMLInputElement>document.getElementById('district');
  district.value = filter.d;
  location.district = filter.d;

  const city = <HTMLInputElement>document.getElementById('city');
  city.value = filter.a;
  location.city = filter.a;

  const province = <HTMLInputElement>document.getElementById('province');
  province.value = filter.p;
  location.province = filter.p;
}

function listenerToKeyboardArrowEvent(key: string): boolean {
  // ArrowDown Left Right Up
  switch (key) {
    case 'Enter': {
      const filter = filteredOptions[searchIndex];
      mapValueFromFilter(filter);
      destroyFilter();
      return false;
    }
    case 'ArrowUp':
      if (searchIndex >= 0) {
        searchIndex--;
        document.getElementById(`ADDR_SELECTOR_${searchIndex}`).classList.add('select-on-focus');
        clearSelection();
      }
      return false;
    case 'ArrowDown':
      if (searchIndex < filteredOptions.length) {
        searchIndex++;
        document.getElementById(`ADDR_SELECTOR_${searchIndex}`).classList.add('select-on-focus');
        clearSelection();
      }
      return false;
    case 'ArrowLeft':
    case 'ArrowRight':
      return false;
    default:
      return true;
  }
}

function bindEventListenerToFilter() {
  const optionIndex = this.id.replace('ADDR_SELECTOR_INDEX_', '');
  const filter = filteredOptions[optionIndex];
  mapValueFromFilter(filter);
  destroyFilter();
}

function createFilterElement(element: HTMLInputElement) {
  filterOptionElement = <HTMLElement>document.createElement('div');
  filterOptionElement.id = 'filterOption';
  filterOptionElement.classList.add('search-autofill');
  element.parentElement.parentNode.insertBefore(filterOptionElement, element.parentElement.nextSibling);
}

function resolveResultbyField(searchStr: IAddressJQL, callback: (params: IAddressJQL[]) => void) {
  const DB = new JQL(preprocess(payloadData.addressJson));
  let possibles: IAddressJQL[] = [];
  Object.keys(searchStr).forEach((type) => {
    try {
      if (searchStr[type] != '' && type != 'p') {
        const possiblesLocal = DB.select('*').where(type).match(`^${searchStr[type]}`).orderBy(type).fetch();
        possibles = possibles.concat(possiblesLocal);
      }
    } catch (e) {
      console.log(e);
    }
  });

  possibles = possibles.filter((item, index) => {
    return possibles.indexOf(item) == index;
  });
  callback(possibles);
}

function _filterAddress(search: IAddressJQL, element: HTMLInputElement) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    resolveResultbyField(search, (result) => {
      // eslint-disable-next-line
      filteredOptions = result;
      destroyFilter();
      appendValueToSelector(element);
    });
  }, debounceTimerDelay);
}

function appendValueToSelector(element: HTMLInputElement) {
  if (filteredOptions.length > 0) {
    if (!filterOptionElement) createFilterElement(element);

    filteredOptions.forEach(function (item, index) {
      searchIndex = 0;
      const selectDiv = <HTMLElement>document.createElement('div');
      selectDiv.id = `ADDR_SELECTOR_${index}`;
      selectDiv.classList.add('search-autofill-select');
      if (index === 0) selectDiv.classList.add('select-on-focus');

      const inputDiv = <HTMLInputElement>document.createElement('input');
      inputDiv.classList.add('search-autofill-select-value');
      inputDiv.value = `${item.d} ${item.a} ${item.p} ${item.z}`;

      inputDiv.id = `ADDR_SELECTOR_INDEX_${index}`;
      inputDiv.readOnly = true;
      inputDiv.addEventListener('click', bindEventListenerToFilter);

      const iconDiv = <HTMLElement>document.createElement('i');
      iconDiv.classList.add('arrow');
      iconDiv.classList.add('down');
      selectDiv.appendChild(inputDiv);
      selectDiv.appendChild(iconDiv);
      filterOptionElement.appendChild(selectDiv);
    });
  }
}

function switchAddressAutoFill(element: HTMLInputElement) {
  try {
    if (filterOptionElement && filteredOptions) {
      destroyFilter();

      if (filteredOptions.length > 0) {
        appendValueToSelector(element);
      }
    }
  } catch (err) {
    // do nothing
  }
}

function destroyFilter() {
  if (filterOptionElement) {
    filterOptionElement.remove();
    filterOptionElement = undefined;
  }
}

function bindDestroyFilterEvent(event: HTMLInputElement) {
  event.addEventListener('click', function () {
    destroyFilter();
  });
  event.addEventListener('keydown', function () {
    destroyFilter();
  });
}

// Address
// eslint-disable-next-line
function bindEventListenerToAddressForm(): void {
  const name = <HTMLInputElement>document.getElementById('name');
  const phone_number = <HTMLInputElement>document.getElementById('phone_number');
  const address = <HTMLInputElement>document.getElementById('address');
  const post_code = <HTMLInputElement>document.getElementById('post_code');
  const district = <HTMLInputElement>document.getElementById('district');
  const city = <HTMLInputElement>document.getElementById('city');
  const province = <HTMLInputElement>document.getElementById('province');

  bindDestroyFilterEvent(name);
  bindDestroyFilterEvent(phone_number);
  bindDestroyFilterEvent(address);

  post_code.addEventListener('click', function () {
    switchAddressAutoFill(post_code);
  });
  post_code.addEventListener('keydown', function (event: KeyboardEvent) {
    const isNext = listenerToKeyboardArrowEvent(event.key);
    if (isNext) {
      search.z = Number(this.value);
      destroyFilter();
      _filterAddress(search, post_code);
    }
  });

  district.addEventListener('click', function () {
    switchAddressAutoFill(district);
  });
  district.addEventListener('keydown', function (event: KeyboardEvent) {
    const isNext = listenerToKeyboardArrowEvent(event.key);
    if (isNext) {
      search.d = this.value;
      _filterAddress(search, district);
    }
  });

  city.addEventListener('click', function () {
    switchAddressAutoFill(city);
  });
  city.addEventListener('keydown', function (event: KeyboardEvent) {
    const isNext = listenerToKeyboardArrowEvent(event.key);
    if (isNext) {
      search.a = this.value;
      _filterAddress(search, city);
    }
  });

  province.addEventListener('click', function () {
    switchAddressAutoFill(province);
  });
  province.addEventListener('keydown', function (event: KeyboardEvent) {
    const isNext = listenerToKeyboardArrowEvent(event.key);
    if (isNext) {
      search.p = this.value;
      _filterAddress(search, province);
    }
  });
}
