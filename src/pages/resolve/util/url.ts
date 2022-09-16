export const getUrlParam = (url: string, param: string) => {
  console.log("getUrlParam url: ", url, "param: ", param);
  const paramMap = getParamMap(url);
  return paramMap[param];
};

export const getParamMap = (url: string): any => {
  try {
    console.log("getParamMap url: ", url);
    const urlData = new URL(url);
    const params: string[] = urlData.search.replace("?", "").split("&");
    const paramMap: { [key: string]: string } = {};
    params.forEach((item) => {
      const data = item.split("=");
      paramMap[data[0]] = data[1];
    });
    return paramMap;
  } catch (err) {
    console.log("getUrlParam err: ", err);
  }
};
