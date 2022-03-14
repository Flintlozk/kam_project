// https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
const isWebkit = /WebKit/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent) && !window.MSStream;

async function fetchHTML(path) {
  try {
    return await fetch(path).then((res) => res.text());
  } catch {
    const error = `path ${path} not found`;
    throw new Error(error);
  }
}

async function loadPage(path, selector, js, outletName) {
  const html = await fetchHTML(path);
  let outlet;
  if (outletName) {
    outlet = document.querySelector(`router-outlet[name="${outletName}"]`);
  } else {
    outlet = document.querySelector(`router-outlet`);
  }
  if (selector) {
    const parser = new DOMParser();
    try {
      const doc = parser.parseFromString(html, 'text/html');
      const element = doc.querySelector(selector);
      if (element) {
        outlet.replaceWith(element);
        const { scripts, head } = doc;
        if (head) {
          const meta = head.querySelectorAll('meta');
          for (const m of meta) {
            // TODO: set meta
            // m.charset
            // m.name;
            // m.content;
            // m.property
          }
          const link = head.querySelectorAll('link');
          for (const l of link) {
            const { rel, href } = l;
            if (rel === 'stylesheet') {
              // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser/9851769
              const isChromium = window.chrome;
              if (isChromium) {
                const f = new Function(`import('${href}', {
                  assert: { type: 'css' }
                }).then(cssModule => {
                  document.adoptedStyleSheets = [...document.adoptedStyleSheets, cssModule.default];
                }).catch(err => console.error(err));`);
                f();
              } else {
                const style = document.createElement('link');
                style.rel = 'stylesheet';
                style.type = 'text/css';
                style.href = href;
                document.head.appendChild(style);
              }
            } else if (rel === 'icon') {
              // TODO:
            } else if (rel === 'manifest') {
              // TODO: Manifest
            }
          }
        }
        for (const script of scripts) {
          const { src, textContent } = script;
          const firstLoadOnly = script.getAttribute('firstloadonly');
          if (firstLoadOnly === '') {
            continue;
          }
          if (src) {
            import(src)
              .then((module) => {
                const executeFunctionName = script.getAttribute('run');
                if (executeFunctionName) {
                  const f = module[executeFunctionName];
                  if (f) {
                    const params = script.getAttribute('params')?.split(',');
                    try {
                      if (params && params.length > 0) {
                        f(...params);
                      } else {
                        f();
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  } else {
                    console.error(`No export function: ${executeFunctionName} in ${src}.`);
                  }
                }
              })
              .catch((err) => {
                console.error(err);
              });
          } else if (textContent) {
            const f = new Function(textContent.trim());
            f();
          }
        }
      } else {
        console.error(`Element (${selector}) not found`);
      }
      const title = doc.title;
      if (title) {
        document.title = title;
      } else {
        document.title = '';
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    outlet.innerHTML = html;
  }
  if (js) {
    try {
      await import(js);
    } catch (err) {
      console.error('error: import js' + js);
      throw new Error(err);
    }
  }
}

async function registerRouter(e) {
  e.preventDefault();
  const a = e.currentTarget;
  const path = a.getAttribute('href');
  const js = a.getAttribute('js');
  const outletName = a.getAttribute('name');
  const selector = a.getAttribute('selector') || 'router-outlet';
  if (!path) {
    throw Error('href not defined');
  }
  try {
    await loadPage(path, selector, js, outletName);
    window.history.pushState({ path, selector, js }, '', path);
    reloadRouter();
  } catch (err) {
    console.error(err);
  }
}

function reloadRouter() {
  for (const a of document.querySelectorAll('a[is="router-link"]').values()) {
    // https://stackoverflow.com/questions/10364298/will-the-same-addeventlistener-work
    a.addEventListener('click', registerRouter, false);
  }
}
reloadRouter();

window.addEventListener(
  'popstate',
  async () => {
    // TODO: manipulate hash, query
    // const hash = decodeURIComponent(window.location.hash.substring(1));
    // const query = window.location.search.substring(1);
    // console.log(hash, query);
    const { pathname } = window.location;
    if (pathname) {
      await loadPage(pathname, 'router-outlet', '');
      reloadRouter();
    }
  },
  false,
);
