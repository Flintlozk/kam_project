import { Click, Visitorgateway } from '@reactor-room/autodigi-models-lib';

export async function reduceGatewayValues(day, values): Promise<Visitorgateway> {
  values.total = [];
  values.google = [];
  values.googleads = [];
  values.others = [];
  for (let i = 0; i < day.length; i++) {
    values.total.push(
      calValue(Number(values.google_seo[i])) +
        calValue(Number(values.google_ads[i])) +
        calValue(Number(values.displaynetwork[i])) +
        calValue(Number(values.youtubesearch[i])) +
        calValue(Number(values.youtubevideo[i])) +
        calValue(Number(values.unknown[i])) +
        calValue(Number(values.other[i])) +
        calValue(Number(values.social[i])) +
        calValue(Number(values.link[i])) +
        calValue(Number(values.direct[i])),
    );

    values.google.push(
      calValue(Number(values.google_seo[i])) + calValue(Number(values.displaynetwork[i])) + calValue(Number(values.youtubesearch[i])) + calValue(Number(values.youtubevideo[i])),
    );
    values.googleads.push(calValue(Number(values.google_ads[i])));
    values.others.push(calValue(Number(values.unknown[i])) + calValue(Number(values.other[i])));
  }
  return values;
}

export async function reduceClicksValues(day, values: Click): Promise<Click> {
  values.total = [];
  for (let i = 0; i < day.length; i++) {
    values.total.push(
      calValue(Number(values.line[i])) +
        calValue(Number(values.messenger[i])) +
        calValue(Number(values.form[i])) +
        calValue(Number(values.call[i])) +
        calValue(Number(values.location[i])),
    );
  }
  return values;
}

const calValue = (value) => {
  return value ? value : 0;
};
