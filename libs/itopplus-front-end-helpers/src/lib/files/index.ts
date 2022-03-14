export const isImageByExtension = (extension: string): boolean => ['jpg', 'jpeg', 'png', 'gif'].includes(extension);

export const toBase64 = (file: File): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const convertFileToBlob = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.onloadend = () => resolve(new Blob([fileReader.result], { type: file.type }));
      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      reject(err);
    }
  });
};

export const createFormDataForUpload = (file: File): { filename: string; extension: string; file: File } => {
  // const file = uploadfile[index];
  const filename = file.name;
  const extension = file.type.split('/')[1];
  return { filename, extension, file: file };
};
