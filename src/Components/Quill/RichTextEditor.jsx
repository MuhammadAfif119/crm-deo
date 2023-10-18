import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
import { useToast } from "@chakra-ui/react";

import "./RichTextEditor.css";
import useUserStore from "../../Hooks/Zustand/Store";
import UploadFileToDropbox from "../DropBox/UploadFileToDropbox";
import { getSingleDocumentFirebase } from "../../Api/firebaseApi";
import { decryptToken } from "../../Utils/encrypToken";

function RichTextEditor({ value, onChange }) {
  const quillRef = useRef();
  const [editorValue, setEditorValue] = useState(value);
  const [uploading, setUploading] = useState(false);
  const globalState = useUserStore();
  const toast = useToast();

  Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);

  const imageHandler = useCallback(async (dataUrl, type, imageData) => {
    try {
      setUploading(true); // Menampilkan indikator loading saat mengunggah gambar

      // Mengubah dataUrl menjadi objek File
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }

      const file = new File([arrayBuffer], imageData.name, {
        type: mimeString,
      });

      const searchCompanyName = globalState?.companies?.find(
        (x) => x.id === globalState?.currentCompany
      );
      const companyName = searchCompanyName?.name;

      const token = await getSingleDocumentFirebase("token", "dropbox");
      const decryptResult = decryptToken(`${token?.access_token}`);

      // Upload gambar ke Dropbox menggunakan fungsi UploadFileToDropbox yang telah disediakan
      const parentPath = `/${companyName}/message`; // Ganti dengan path folder di Dropbox yang ingin Anda gunakan
      const dropboxLink = await UploadFileToDropbox(
        file,
        parentPath,
        // globalState.accessToken
        decryptResult
      );

      if (dropboxLink) {
        // Jika upload berhasil, masukkan tautan berbagi sebagai sumber gambar di editor
        const editor = quillRef.current.getEditor();
        editor.insertEmbed(imageData.index, "image", dropboxLink.link);
      }
    } catch (error) {
      console.error("Errr in upload Image:", error);
      toast({
        title: "Oops!",
        description: `An error occured, ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setUploading(false); // Sembunyikan indikator loading setelah selesai mengunggah gambar
    }
  }, []);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const quillConfig = {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
        [
          {
            color: [
              "#000000",
              "#e60000",
              "#ff9900",
              "#ffff00",
              "#008a00",
              "#0066cc",
              "#9933ff",
              "#ffffff",
              "#facccc",
              "#ffebcc",
              "#ffffcc",
              "#cce8cc",
              "#cce0f5",
              "#ebd6ff",
              "#bbbbbb",
              "#f06666",
              "#ffc266",
              "#ffff66",
              "#66b966",
              "#66a3e0",
              "#c285ff",
              "#888888",
              "#a10000",
              "#b26b00",
              "#b2b200",
              "#006100",
              "#0047b2",
              "#6b24b2",
              "#444444",
              "#5c0000",
              "#663d00",
              "#666600",
              "#003700",
              "#002966",
              "#3d1466",
            ],
          },
        ],
      ],
      imageDropAndPaste: {
        handler: imageHandler,
      },
    },
  };

  const handleContentChange = useCallback(
    (value) => {
      setEditorValue(value);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <React.Fragment>
      <ReactQuill
        ref={quillRef}
        value={editorValue}
        onChange={handleContentChange}
        modules={quillConfig.modules}
        theme={quillConfig.theme}
        style={{ minHeight: "200px", overflow: "hidden", padding: 5 }}
      />
      {uploading && <div>Uploading Image...</div>} {/* Indikator loading */}
    </React.Fragment>
  );
}

export default RichTextEditor;
