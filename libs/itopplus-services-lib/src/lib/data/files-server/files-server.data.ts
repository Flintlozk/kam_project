import FormData from 'form-data';
import axios from 'axios';
import { IGQLFileSteam, IHTTPResult } from '@reactor-room/model-lib';
import { FileType, IFileUpload } from '@reactor-room/itopplus-model-lib';
import { environmentLib } from '@reactor-room/environment-services-backend';

export async function uploadFileToFileServer(file: any, filename: string, folderName: string, filesServer: string, mode: FileType, contentType: string): Promise<string> {
  let stream;
  if (mode === FileType.GQLFILE) {
    stream = file.createReadStream();
  } else {
    stream = file;
  }
  const form = new FormData();
  form.append('file', stream, { filename, contentType });
  const result = await axios
    .post(filesServer + 'upload' + '/' + folderName + '/' + 'true', form, {
      timeout: 10000,
      headers: { ...form.getHeaders(), origin: environmentLib.cms.backendUrl },
    })
    .catch((error) => {
      console.log(error);
      throw Error('FILES-SERVER' + 'uploadFileToCMSFileServer' + error);
    });
  const filepathFull = result.data.value;
  return filepathFull;
}

export async function uploadFilesToFileServer(files: IFileUpload[], encryptedData: Buffer, pageUUID: string, filesServer: string): Promise<IHTTPResult> {
  const formData = new FormData();
  formData.append('encryptedData', JSON.stringify({ key: encryptedData.toString('base64'), length: files.length }));
  for (let i = 0; i < files.length; i++) {
    const file = await files[i].file;
    if (file) {
      const stream = file.createReadStream();
      formData.append('files[' + i + ']', stream, { filename: file.filename });
    }
  }
  const result = await axios.post(filesServer + 'api/' + pageUUID + '/operation/' + 'upload', formData, {
    headers: { ...formData.getHeaders(), origin: environmentLib.cms.backendUrl },
  });
  return result.data;
}

export async function trashFilesFromFileServer(filePaths: string[], encryptedData: Buffer, pageUUID: string, filesServer: string): Promise<IHTTPResult> {
  const result = await axios.post(
    filesServer + 'api/' + pageUUID + '/operation/' + 'trash',
    {
      data: {
        encryptedData,
        requestedData: filePaths,
      },
    },
    { headers: { origin: environmentLib.cms.backendUrl } },
  );
  return result.data;
}

export async function recoverFilesFromFileServer(filePaths: string[], encryptedData: Buffer, pageUUID: string, filesServer: string): Promise<IHTTPResult> {
  const result = await axios.post(
    filesServer + 'api/' + pageUUID + '/operation/' + 'recover',
    {
      data: {
        encryptedData,
        requestedData: filePaths,
      },
    },
    { headers: { origin: environmentLib.cms.backendUrl } },
  );
  return result.data;
}

export async function deleteFilesFromFileServer(filePaths: string[], encryptedData: Buffer, pageUUID: string, filesServer: string): Promise<IHTTPResult> {
  const result = await axios.delete(filesServer + 'api/' + pageUUID + '/operation/' + 'delete', {
    data: {
      data: {
        encryptedData,
        requestedData: filePaths,
      },
    },
    headers: { origin: environmentLib.cms.backendUrl },
  });
  return result.data;
}

export async function emptyFilesFromFileServer(encryptedData: Buffer, pageUUID: string, filesServer: string): Promise<IHTTPResult> {
  const result = await axios.delete(filesServer + 'api/' + pageUUID + '/operation/' + 'empty', {
    data: {
      data: {
        encryptedData,
      },
    },
    headers: { origin: environmentLib.cms.backendUrl },
  });
  return result.data;
}

export async function getFilesInfoFromFileSever(domain: string, filesServer: string, pageUUID: string): Promise<IHTTPResult> {
  const result = await axios.get(filesServer + 'api/' + domain + '/' + pageUUID + '/operation/' + 'info', { headers: { origin: environmentLib.cms.backendUrl } }).catch((error) => {
    console.log(error);
    throw Error('FILES-SERVER' + 'getFilesInfoFromCMSFileSever' + error);
  });
  return result.data;
}
export async function getSystemFilesInfoFromFileSever(domain: string, filesServer: string, pageUUID: string, origin: string): Promise<IHTTPResult> {
  const result = await axios.get(filesServer + 'api/system/' + domain + '/' + pageUUID + '/operation/' + 'info', { headers: { origin } }).catch((error) => {
    console.log(error);
    throw Error('FILES-SERVER' + 'getFilesInfoFromCMSFileSever' + error);
  });
  return result.data;
}

export async function uploadSystemFilesToFileServer(
  imagesArray: IGQLFileSteam[],
  encryptedData: Buffer,
  pageUUID: string,
  folder: string,
  identifyID: string,
  filesServer: string,
): Promise<IHTTPResult> {
  const formData = new FormData();
  formData.append('encryptedData', JSON.stringify({ key: encryptedData.toString('base64'), length: imagesArray.length }));
  for (let i = 0; i < imagesArray.length; i++) {
    const { filename, createReadStream } = await imagesArray[i];
    const stream = createReadStream();
    formData.append('files[' + i + ']', stream, { filename });
  }
  const result = await axios
    .post(filesServer + 'api/system/' + pageUUID + '/' + folder + '/' + identifyID + '/operation/' + 'upload', formData, {
      headers: { ...formData.getHeaders(), origin: environmentLib.backendUrl },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
    .catch((error) => {
      console.log(error);
      throw Error('FILES-SERVER' + 'uploadSystemFilesToFileServer' + error);
    });
  return result.data;
}
export async function singleUploadBufferToFileServer(
  source: Buffer,
  encryptedData: Buffer,
  pageUUID: string,
  folder: string,
  identifyID: string,
  filesServer: string,
  filename: string,
  bypass = false,
): Promise<IHTTPResult> {
  const formData = new FormData();
  formData.append('encryptedData', JSON.stringify({ key: encryptedData.toString('base64'), length: 1 }));
  const queryString = bypass ? '?recieveMessage=true' : '';
  formData.append('files[' + 0 + ']', source, { filename });

  const result = await axios
    .post(filesServer + 'api/system/' + pageUUID + '/' + folder + '/' + identifyID + '/operation/' + 'upload' + queryString, formData, {
      headers: { ...formData.getHeaders(), origin: environmentLib.backendUrl },
    })
    .catch((error) => {
      console.log(error);
      throw Error('FILES-SERVER' + 'uploadSystemFilesToFileServer' + error);
    });
  return result.data;
}
