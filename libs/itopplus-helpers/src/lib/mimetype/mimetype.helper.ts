export function checkMimeType(type: string): string {
  switch (type) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpeg';
    case 'image/jpg':
      return 'jpg';
    case 'image/gif':
      return 'gif';
    case 'application/pdf':
      return 'pdf';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'xlsx';
    case 'application/x-compress':
    case 'application/x-compressed':
    case 'application/x-zip-compressed':
    case 'multipart/x-zip':
    case 'application/zip':
      return 'zip';
    case 'text/plain':
      return 'txt';
    case 'video/mp4':
      return 'mp4';
    case 'application/javascript':
      return 'js';
    case 'text/javascript':
      return 'js';
    case 'text/css':
      return 'css';
    case 'audio/x-m4a':
      return 'm4a';
    case 'application/vnd.ms-excel':
      return 'xls';
    default:
      return '';
  }
}
