export const tweet_url_parser = () => {}
export const user_url_parser = (s: string) => {
  return s.split("/")[-1]
}
