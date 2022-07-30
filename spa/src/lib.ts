export const tweetUrlParser = (s: string) => {
  return s.replace(/https:\/\/twitter.com\/[a-zA-Z0-9_]*\/[a-zA-Z0-9]*\//, "").replace(/\?.+/, "")
}
export const userUrlParser = (s: string) => {
  const arr = s.split("/")
  return arr[arr.length - 1]
}
