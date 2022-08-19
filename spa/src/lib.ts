import { getThreadPDF } from "./data";
export const tweetUrlParser = (s: string): string => {
  return s
    .replace(/https:\/\/twitter.com\/[a-zA-Z0-9_]*\/[a-zA-Z0-9]*\//, "")
    .replace(/\?.+/, "");
};
export const userUrlParser = (s: string): string => {
  const arr = s.split("/");
  return arr[arr.length - 1]!;
};

export const sleep = (ms = 2000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const downloadFile = async (fileUrl: string, format: string) => {
  const isPDF = format === "pdf";
  const fileRes = isPDF
    ? await getThreadPDF(fileUrl).then((r) => r.data)
    : fileUrl;

  const downloadUrl = isPDF
    ? window.URL.createObjectURL(
      new File([fileRes], "twt_thread.pdf", {
        type: "application/pdf",
      })
    )
    : fileRes;
  const link = document.createElement("a");
  link.href = downloadUrl as string;
  if (!isPDF) {
    link.target = "_blank";
  }
  link.setAttribute("download", isPDF ? "twt_thread.pdf" : "archive.html"); //any other extension
  document.body.appendChild(link);
  link.click();
  link.remove();
};
