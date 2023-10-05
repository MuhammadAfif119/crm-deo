import axios from "axios";
import moment from "moment";

const UploadFileToDropbox = async (file, parentPath, token) => {
  const currentMillis = moment(new Date()).valueOf();

  const fileType = file.type.split("/")[0]; // Mengambil bagian depan sebelum tanda "/"

  const fileTypeFix =
    fileType === "image"
      ? "image"
      : fileType === "video"
      ? "video"
      : fileType === "audio"
      ? "audio"
      : "file";

  // const accessToken = process.env.REACT_APP_DROPBOX;
  const accessToken = token;
  const url = "https://content.dropboxapi.com/2/files/upload";

  const headers = {
    "Content-Type": "application/octet-stream",
    Authorization: `Bearer ${accessToken}`,
    "Dropbox-API-Arg": JSON.stringify({
      path: `${parentPath}/${fileTypeFix}/${currentMillis}-${file.name}`, // Menggunakan parentPath dari properti yang dikirim dari atas
      mode: "add",
      autorename: true,
      mute: false,
    }),
  };

  try {
    const response = await axios.post(url, file, {
      headers: headers,
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log("Progress:", progress); // Anda dapat menampilkan progres ini jika diperlukan
      },
    });
    console.log("File berhasil diunggah ke Dropbox:", response);

    if (response?.data?.path_lower) {
      const dropboxLink = await createShareLink(
        response.data.path_lower,
        fileTypeFix,
        accessToken
      );
      return dropboxLink;
    }

    return null;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengunggah file ke Dropbox:", error);
    return null;
  }
};

const createShareLink = async (filePath, typeFile, token) => {
  // const accessToken = process.env.REACT_APP_DROPBOX;
  const accessToken = token;

  const url =
    "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const requestData = {
    path: filePath,
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: headers,
    });

    const urlData = response?.data?.url;
    const dataFix = urlData.includes(".mov") || urlData.includes(".MOV");

    const urlRaw = dataFix ? urlData : `${urlData}&raw=1`;
    return { link: urlRaw, type: typeFile };
  } catch (error) {
    console.error("Terjadi kesalahan saat membuat tautan berbagi:", error);
    return null;
  }
};

export default UploadFileToDropbox;
