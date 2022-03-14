import { isEmpty } from '@reactor-room/itopplus-back-end-helpers';
export const getPagePicture = (data): [any] => {
  return data.map((item) => {
    item.picture = item.picture.data.url;
    return item;
  });
};

export const checkMaxPagesAndPageUsing = (maxpages, pageusing) => {
  let result = true;
  if (isEmpty(maxpages) || isEmpty(pageusing)) {
    result = true;
  } else {
    if (maxpages[0].maximum_pages <= pageusing[0].count) {
      result = false;
    }
  }
  return result;
};
export const getPictureFanPage = (data) => {
  const urlPicture = data.url;
  return urlPicture;
};
