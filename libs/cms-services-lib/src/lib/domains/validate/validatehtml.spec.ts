import { EnumThemeAttribute, EnumThemeComponentsType } from '@reactor-room/cms-models-lib';
import { JSDOM } from 'jsdom';
import * as domain from './validatehtml.domain';
describe('validateHTML Domain', () => {
  test('good section html', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="color:red;" data-cmp="THEME_TEXT">A red paragraph.</div>
    <div style="color:red;" data-cmp="THEME_TEXT" data-id='1' >hello1</div>
  </section>
  <section id="THEME_CONTENT">
    <div style="background-color:white" data-cmp="THEME_TEXT" >hello2</div>
  </section>
  <section id="THEME_FOOTER"></section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateElementOutsideOfSection(document);
    expect(result).toBe(true);
  });
  test('bad section html(have element out of section)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="color:red;" data-cmp="THEME_TEXT">A red paragraph.</div>
    <div style="color:red;" data-cmp="THEME_TEXT" data-id='1' >hello1</div>
  </section>
  asdfasdfasdfasdfasdf
  <section id="THEME_CONTENT">
    <div style="background-color:white" data-cmp="THEME_TEXT" >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateElementOutsideOfSection(document);
    expect(result).toBe(false);
  });
  test('bad layout in layout', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="color:red;" data-cmp="THEME_TEXT">A red paragraph.</div>
    <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='1' ><div style="background-color:white" data-cmp="THEME_LAYOUT" >hello2</div>hello1</div>
  </section>
  <section id="THEME_CONTENT">
    <div style="background-color:white" data-cmp="THEME_TEXT" >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayoutInLayout(document);
    expect(result).toBe(false);
  });
  test('goood layout in layout', async () => {
    const HTML = `<section id="THEME_HEADER">
    <div style="color:red;" data-cmp="THEME_TEXT">A red paragraph.</div>
    <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
  </section>
  <section id="THEME_CONTENT">
    <div style="background-color:white" data-cmp="THEME_TEXT" >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(HTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayoutInLayout(document);
    expect(result).toBe(true);
  });
  test('no dubplicate Id in layout', async () => {
    const HTML = `<section id="THEME_HEADER">
    <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
    <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
  </section>
  <section id="THEME_CONTENT">
    <div style="background-color:white" data-cmp="THEME_TEXT" data-id='2' >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(HTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateDuplicateId(document);
    expect(result).toBe(true);
  });
  test('bad dubplicate Id', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
    <div style="color:red;" data-cmp="THEME_TEXT" data-id='1' >hello1</div>
  </section>
  <section id="THEME_CONTENT">
    <div style="background-color:white" data-cmp="THEME_TEXT" >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateDuplicateId(document);
    expect(result).toBe(false);
  });
  // use this line in tsconfig.json for running this test
  // "compilerOptions": {
  //   "esModuleInterop": true
  // },
  test('good style1', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="padding-left:20px;box-shadow:10px 10px 10px 10px rgba(255,99,1,0.50)" data-cmp="THEME_TEXT" data-id='1'></div>
    <div style="margin-left:20px;margin-right:20px" data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
    <div data-cmp="THEME_LAYOUT" style="background-color:rgba(255, 99, 1, 0.50);border-style:solid" data-id='2' ></div>
</section>
<section id="THEME_CONTENT">
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateCommonsetting(document);
    expect(result).toStrictEqual({ status: 200, value: '' });
  });
  test('good style2', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="padding-left:20px;box-shadow:10px 10px 10px 10px rgba(255,99,1,0.50)" data-cmp="THEME_TEXT" data-id='1'></div>
    <div data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
    <div data-cmp="THEME_LAYOUT" style="background-color:rgba(255, 99, 1, 0.50);border-style:solid" data-id='2' ></div>
</section>
<section id="THEME_CONTENT">
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateCommonsetting(document);
    expect(result).toStrictEqual({ status: 200, value: '' });
  });
  test('good style3', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="padding-left:20px;box-shadow:10px 10px 10px 10px rgba(255,99,1,0.50)" data-cmp="THEME_TEXT" data-id='1'></div>
    <div data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
    <div style="border-color:rgba(255, 99, 1, 0.50)" data-cmp="THEME_LAYOUT" style="background-color:rgba(255, 99, 1, 0.50);border-style:solid" data-id='2' ></div>
</section>
<section id="THEME_CONTENT">
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateCommonsetting(document);
    expect(result).toStrictEqual({ status: 200, value: '' });
  });
  test('bad style', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="padding-let:20px;box-shadow:10px 10px 10px 10px rgba(255,99,1,0.50)" data-cmp="THEME_TEXT" data-id='1'></div>
    <div data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
    <div style="border-color:rgba(255, 99, 1, 0.50)" data-cmp="THEME_LAYOUT" style="background-color:rgba(255, 99, 1, 0.50);border-style:solid" data-id='2' ></div>
</section>
<section id="THEME_CONTENT">
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateCommonsetting(document);
    expect(result).toStrictEqual({ status: 400, value: '[{"difference":"padding-let:20px;","dataId":"1","componentType":"THEME_TEXT"}]' });
  });
  test('bad style2', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="padding-let:20px;box-shadow:10px 10px 10px 10px rgba(255, 99, 1, 0.50)" data-cmp="THEME_TEXT" data-id='1'></div>
    <div data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
    <div style="borde-color:rgba(255, 99, 1, 0.50)" data-cmp="THEME_LAYOUT" style="background-color:rgba(255, 99, 1, 0.50);border-style:solid" data-id='2' ></div>
</section>
<section id="THEME_CONTENT">
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateCommonsetting(document);
    expect(result.status).toStrictEqual(400);
  });
  test('bad style3', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="padding-left:20px;box-shadow:10px 10px 10px 10px rgba(255, 99, 1, 0.50)" data-cmp="THEME_TEXT" data-id='1'></div>
    <div data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
    <div style="border-color:red" data-cmp="THEME_LAYOUT" style="background-color:rgba(255, 99, 1, 0.50);border-style:solid" data-id='2' ></div>
</section>
<section id="THEME_CONTENT">
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateCommonsetting(document);
    expect(result.status).toStrictEqual(400);
  });
  test('bad style4', async () => {
    const errorHTML = `<section id="THEME_HEADER">
    <div style="box-shadow:10px 10px 10px 10px rgba(255, 99, 1, 0.50)" data-cmp="THEME_TEXT" data-id='1'></div>
    <div data-cmp="THEME_LAYOUT" data-id='1' >hello1</div>
    <div style="border-color:red" data-cmp="THEME_LAYOUT" style="background-color:rgba(255, 99, 1, 0.50);border-style:solid" data-id='2' ></div>
</section>
<section id="THEME_CONTENT">
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateCommonsetting(document);
    expect(result.status).toStrictEqual(400);
  });
});
describe('validate no child in component', () => {
  test('validate no child in component(fail case)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.
  <div></div></div>
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1' >hello1</div>
</section>
<section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" >hello2</div>
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateNoChildInComponent(document);
    expect(result).toBe(false);
  });
  test('validate no child in component(success case)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1' >hello1</div>
</section>
<section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" >hello2</div>
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateNoChildInComponent(document);
    expect(result).toBe(true);
  });
});
describe('validate attribute data-id', () => {
  test('validate attribute data-id (success case)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='2'>hello1</div>
</section>
<section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateAttribute(document, EnumThemeAttribute.DATAID);
    expect(result).toBe(true);
  });
  test('validate attribute data-id (fail case)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>hello1</div>
</section>
<section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT">hello2</div>
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateAttribute(document, EnumThemeAttribute.DATAID);
    expect(result).toBe(false);
  });
});
describe('validate attribute data-mode', () => {
  test('validate attribute data-mode (success case)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="ONE-COLUMN">
    <div>
    <p>TEST<p>
    </div>
  </div>
</section>
<section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateAttribute(document, EnumThemeAttribute.DATAMODE, [EnumThemeComponentsType.LAYOUT]);
    expect(result).toBe(true);
  });
  test('validate attribute data-mode (fail case)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='1'>hello1</div>
</section>
<section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT">hello2</div>
</section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateAttribute(document, EnumThemeAttribute.DATAMODE, [EnumThemeComponentsType.LAYOUT]);
    expect(result).toBe(false);
  });
});
describe('validate layout', () => {
  test('validate layout (success case ONE_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="ONE_COLUMN">
    <div>
    <p>TEST<p>
    </div>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(true);
  });
  test('validate attribute data-mode (fail case ONE_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="ONE-COLUMN">
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(true);
  });
  test('validate attribute data-mode (success FIVE_FIVE_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="FIVE_FIVE_COLUMN">
    <div>
    </div>
    <div>
    </div>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(true);
  });
  test('validate attribute data-mode (fail case have 1 column FIVE_FIVE_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="FIVE_FIVE_COLUMN">
    <div>
    </div>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(false);
  });
  test('validate attribute data-mode (fail case have 3 column FIVE_FIVE_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="FIVE_FIVE_COLUMN">
    <div></div><div></div><div></div>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(false);
  });
  test('validate attribute data-mode (fail case use span instead of div column FIVE_FIVE_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="FIVE_FIVE_COLUMN">
    <span></span>
    <span></span>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(false);
  });
  test('validate attribute data-mode (success case THREE_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="THREE_COLUMN">
    <div></div><div></div><div></div>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(true);
  });
  test('validate attribute data-mode (success case FOUR_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="FOUR_COLUMN">
    <div></div><div></div><div></div><div></div>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(true);
  });
  test('validate attribute data-mode (success case FOUR_SIX_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="FOUR_SIX_COLUMN">
    <div></div><div></div>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(true);
  });
  test('validate attribute data-mode (fail case FOUR_SIX_COLUMN)', async () => {
    const errorHTML = `<section id="THEME_HEADER">
  <div style="color:red;" data-cmp="THEME_TEXT" data-id='1'>A red paragraph.</div>
  <div style="color:red;" data-cmp="THEME_LAYOUT" data-id='3' data-mode="FOUR_SIX_COLUMN">
    <div></div><span></span>
  </div>
  </section>
  <section id="THEME_CONTENT">
  <div style="background-color:white" data-cmp="THEME_TEXT" data-id='3 >hello2</div>
  </section>`;
    const htmlDOM = new JSDOM(errorHTML);
    const document = htmlDOM.window.document;
    const result = await domain.validateLayout(document);
    expect(result).toBe(false);
  });
});
