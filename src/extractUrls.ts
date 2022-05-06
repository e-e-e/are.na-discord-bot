const URL_RE =
  /@?(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?[a-zA-Z0-9&;,%()*+=/:\[\]\-^_{}|~]*)?/gi;

function isNotEmailLike(url: string): boolean {
  return !url.startsWith('@');
}

function trimPotentialSentenceEndings(url: string): string {
  const sentenceEndings = ['.', '!', '?'];
  const lastChar = url.at(url.length - 1);
  if (lastChar && sentenceEndings.includes(lastChar)) {
    return url.slice(-1);
  }
  return url;
}

export function extractUrls(content: string): string[] {
  const urls = content.match(URL_RE);
  if (!urls) return [];
  return urls.filter(isNotEmailLike).map(trimPotentialSentenceEndings);
}
