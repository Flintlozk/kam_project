import * as lzString from 'lz-string';
describe('compression test', () => {
  const stringMock =
    'rMXepGWynhAplAvEuhTcZ3FH8MTTT5qikMFKw6eW2klUsbkFhNEs117SQgGTCigMSS0blj31vXt4FwN1gRPpT5KYeE2sLxXu1lq3ZpcdQzzE3HVXa67sBO3mFIvsGhcC' +
    'RPJKDMPdl164DGV14p3ZBMpEftNIB7rAEiJUfIJ3PDbgIsKvJMOzzWYA4VฟหกดฟกหดหกดwaBNcxAWiahgOs1NxmvYQLXvmeTHRLkFtLrzk6kAt3fePLZFo6qXyu8Lu' +
    "wXjAcYsNNe6ZFM43RkdRyf8uvN'GAb8ostC2Y0ob4uBxpoqukZF0e9fbSGtxZjGwpSNrPTNfDhpQ4iEX$fO92XOLNS1OxA91ZTje7MMuEIz" +
    '6gLBrIkvKu4OMObpDLO3M6du0KUUqQrJ8rBijWvh3ฟดกฟหกดnUtLJFghGkAiY73zrHdyro3SyfxrNF99mBHTN3bG2N4woybuY9mDr5ZGZuS72Swjfgi07VJG01cD' +
    'WBrKmit2mF7OD6XhJ1Zz3g8PSzhjiUvgYG25NM61uWehgq1H2DpVAm4noLer7e2xBhZGNs6M3Mcwd6iaLoPITyvzLpctXePSbcRoG3DuBrx6ucYBVLUDnHXO1g' +
    "EIbGC2Nmnb0H4oWiEWhaIEbmaaIj'OJTcrGcSYJD0ZjTX||u1GoyRXyH1m5wFtOTMxHw$Xc8gY9qr3a9kPltKfBUMDI4nwXHfSSiDj0tvXUvJX" +
    '9XAOxDWQ5GML6vTRDRgcw6bCLhOHe$HfafUFJy90xtcpSlIK""BPuNx2NRDZI4CQdWqG0Rkp73CJ4OH6kmuj0VB3VSvjx6QHhopl53zB3T2XGX6gOAXJ9ns9aKG47MWe4NmX' +
    'WRsTGYFc7l0ZcUhwYMFCGsucm7lZzK70tkB2nKocUQ5ecjp##I$s21NQlGqi6v3dUR92AwcCiYXifSp7YO3q3G7pt6C19bW7ow6hxzXYJ4AHDuRuPk7u2iBHH23kBGxHWSmlyTo2' +
    'GY2jMfUJgoLLxo2xTAz7yOZ5Rha8tMzty3dRtePGhlblA3##ZGd5nCcbrAhVaYYMLQSaEjgmssMo24DMqUlAFQV3U9SpeW1eXKQLn1jN7Oz0Uv7Y7AlJKa4qTTTMdZlnulBEZ3r83f' +
    'GGAqP5KYd9ngE1fz7vvWYWJbLyHT$Utc12wXKArnjCcEqiฟ##หกดฟหกด5OfBaslKYq8lznGySk8Xln4iAoYUJnblgtyIoDfYLmC1IVFhK1WjboLE5LJnH8WAORCGKBSmRgZxt0vsKdRedcPoXc3gzSa' +
    'pzQbkodj99sD3ZEU9EMhVXY8wvkUzrvUS1UuummwwuLwjsFJDxOaqubWDy8m845NNPD0r0KHDlgqLeLldgOyOLhCUDaZxSFQ8a3llYyhdm9DDNrG2oH3jPD8oOPabq8kXmRsTqzSAXIs0' +
    'LixELYS49FfatTKQx4CTSf1097VPFqA1C&&da2tp8H4Aฟหกดฟ#หกดQQvEMIew42Ua8o39JlAWDH05Y33HqNafhjwtfPJlfSubiRV4XM0hZdhABqlxG8WMImyLCNAYhTvnw4UgPja2iwXArglEHu87PQPB' +
    'Xv5Vn4nXxIQK2SE7gCI11CL8Aku6A9oyjTMGaWR&&gGFTAFDWHM825YiusTCpVRH16A7OCctUT7J9Dc5dl8B1s9MZT9BE9kptz5jJebiLMcQfwlYHYxh1jGIDbxOGuwOs' +
    'DKOEru3ErH3DG7yYESAidvK2PdqLe1p8h4kzlnyWv03CChQbTa#aAFQUI3VsZ5rpSWW3hsDOfCCMTBcf5QLI2ENVnfLHw1BOgIzwEfMWvdI3DkkBFteuTG7zWqt' +
    'YaJwUoGyQhJIgPb4GfoMftkwzDoOqEsuu4daFSi3G&&xq$6ALLฟกหดฟหกดtgNiTc2uU6CmIS3Q7NHF6kgnXKuxiFoQihxB4Hk9bsTxk2fmsyDMBwcPB5OFKJxLxIGoXtYuKdYrSHQ59se1' +
    'pJndZCXyjFKl3Q7VogBOMe309waFG9dYcP9f1NNzLw34iYpNvau#IjOXa1nETFdtEgLxvF6dazKQwfYf1rd3rwYTFPJdvxJkqA5EOmWEpD8N8bb' +
    'sjPzAHLfAtgiTfvIvxMTy6QugwIeQKrmllwQ5RtUkpcfNjX3vlh4#2IwCGEP579IwmKmhTMxFW5opOAvAa95MjIZ2AHVWGElKvuoQFOzhnB4VsIDg2d' +
    '8avLL3OUpXcyUQm40Nkrgt4D56bUQWfTP&&||PmwrdQaRJy8m7TAk##OxiwAstcv9gฟหกดฟหกดฟหกด""AsQosD9rHjjSHUD3RCV7HdAylrneRTtga35nNB8pHoArFqtfXX5TF5mPWU4XVRQFn02Ug' +
    'GYUmUj1DfVmlEaUn8MmcPe83ttelT2RrY0kOA9ADh87lRbD4gjuu8SS#pcWtm6eym1k4LNGMdItzieKKYi6XUScak32hVJfXE6G9ZgiKo2EPt1Qn9ard93wHOzv8h2Vkmp' +
    'aaVE1bKi4DTMxZC82coFtYEeMqUEHhbOJZzA13p||QYoSDVSkKLQ9Q3k#U$jVyc0ac6p39X2kIoIcixkTXKZ0bzw1Ndw1FbhPNCyAYf0bXMapi0YQGd6wZqQ7TZoNpp7YVaaVx6gCWSpBIPAp' +
    'lzAFVfaV5nCb3tEYzj964V2PEZI7OqXQ0Os5Uzm9c||wer4S3eUfBjWBW#9XHhpt7b3dB7bk1BzD0sGSgXHhrmnu9BJ7EW2ddhNjunbQq2ItH14n9p5vmTk0jX2ek0agdCUpDmik7i164xh2hcYKv' +
    '4pJfRlvAuQnyAVwAwBXzuOmRb5j78UCulWzURX92L1V||9IN09QBV6XrDM#HboS3VbcQEbSXQ2CCTEHRKc6xstOZCut7Azaz9jaO0QGRqdTXMmHBY17KOtpN5fbvS9ZgKhduC3od5DbjbDw840JtICa' +
    'o9I zKiM4St1Ydx1H6IUSBRo8TFrRJ75LAoi32FxRXdaey6jn0F1fryLe2Mte4SQjFvy59MYU3gKoXAgT0fDQ1pb3VPkTEZAESfNdd7vC2Y0ob4uBxpoqukZF0e9f';
  test('compress decompress test', () => {
    const compressMock = lzString.compress(stringMock, {
      encoding: 'utf8',
    });
    console.log(compressMock.length);
    expect(compressMock.length).toBeLessThan(stringMock.length);
    const decompressMock = lzString.decompress(compressMock);
    expect(decompressMock).toBe(stringMock);
  });
});
