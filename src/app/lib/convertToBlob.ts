export const convertToBlob = (uint8Array: Uint8Array) =>
  new Blob([uint8Array as Uint8Array<ArrayBuffer>], {
    type: 'application/octet-stream',
  });
