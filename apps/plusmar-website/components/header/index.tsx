/* eslint-disable max-len */
import React from 'react';
import Head from 'next/head';

export const Index = () => {
  return (
    <Head>
      <title>More-Commerce</title>
      <link rel="icon" type="image/x-icon" href={'/images/favicon.ico'} />
      <meta name="Description" content="แพลตฟอร์มบริหารจัดการอินบอกซ์ สั่งซื้อ โอนเงิน จัดส่ง ปิดการขายบนแชทได้ทันที"></meta>
      <meta property="og:image" content="/images/OG_More.jpg" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:alt" content="More Commerce topic image" />

      {/* NEW google tagmanager 11-09-2020 */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PB4TP72');",
        }}
      ></script>
    </Head>
  );
};
export default Index;
