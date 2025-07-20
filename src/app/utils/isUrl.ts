const URL_REGEX =
  /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

export const isUrl = (text: string) => URL_REGEX.test(text);
