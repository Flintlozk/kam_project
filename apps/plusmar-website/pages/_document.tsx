import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en" className="htmlClass">
        <Head />
        <a className={'skip-link'} style={{ display: 'none' }} href="#main">
          Skip to main
        </a>
        <body className="htmlClass" style={{ margin: 0, fontFamily: 'DM Sans, Prompt' }}>
          <noscript
            dangerouslySetInnerHTML={{
              __html: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PB4TP72" height="0" width="0" style="display:none; visibility:hidden"></iframe>',
            }}
          ></noscript>
          {/* <noscript></noscript> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
