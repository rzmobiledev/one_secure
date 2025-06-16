
const urlRegex = /^(((http|https):\/\/|)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?)$/;

export function isValidDomain(domain: string): boolean {
    return urlRegex.test(domain);
  }