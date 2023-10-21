import React, { useEffect, useRef, useState } from "react";
import "grapesjs/dist/css/grapes.min.css";
import "./grapesJs.css";
import { HStack, Heading, Spacer, Stack, useToast } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";
import grapesjs from "grapesjs";
import presetPlugin from "grapesjs-preset-webpage";
import pluginGrapesjsBlocksBasic from "grapesjs-blocks-basic";
import projectManager from "grapesjs-project-manager";
import "grapesjs-project-manager/dist/grapesjs-project-manager.min.css";
import gjsForms from "grapesjs-plugin-forms";
import pluginExport from "grapesjs-plugin-export";
import fontPlugin from "@silexlabs/grapesjs-fonts";
import pluginCountdown from "grapesjs-component-countdown";
import stylePlugin from "grapesjs-style-bg";
import customCodePlugin from "grapesjs-custom-code";
import pluginTyped from "grapesjs-typed";
import {
  addDocumentFirebase,
  getCollectionFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import BackButtons from "../../Components/Buttons/BackButtons";
import { templateData } from "./TemplateData";

function FunnelEditPageV2() {
  const editorRef = useRef(null);
  const globalState = useUserStore();
  const toast = useToast();

  const { state } = useLocation();
  const param = useParams();

  const getDataStorage = async (editor) => {
    const conditions = [];
    const sortBy = { field: "createdAt", direction: "desc" };
    const limitValue = 5;

    try {
      const res = await getCollectionFirebase(
        `funnels/${param.id}/${param.pageId}/html`,
        conditions,
        sortBy,
        limitValue
      );
      if (res.length > 0) {
        editor.setComponents(res[0]?.html);
        editor.setStyle(res[0]?.css);
      } else {
        console.log("No data found in storage");
      }
    } catch (error) {
      console.log(error, "Error retrieving data from storage");
      toast({
        title: "Error",
        description: "Failed to retrieve data from storage",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      pageManager: true,
      plugins: [
        presetPlugin,
        pluginGrapesjsBlocksBasic,
        gjsForms,
        pluginExport,
        pluginCountdown,
        fontPlugin,
        stylePlugin,
        customCodePlugin,
        pluginTyped,
        projectManager,
      ],
      pluginsOpts: {
        [presetPlugin]: {},
        [pluginGrapesjsBlocksBasic]: {},
        [gjsForms]: {},
        [pluginExport]: {},
        [fontPlugin]: {
          api_key: "AIzaSyAdJTYSLPlKz4w5Iqyy-JAF2o8uQKd1FKc",
        },
        [pluginCountdown]: {},
        [stylePlugin]: {},
        [customCodePlugin]: {},
        [pluginTyped]: {},
      },
    });

    editor.Panels.addPanel({
      id: "panel-top",
      el: ".panel__top",
      buttons: [
        {
          id: "get-storage-button",
          active: false,
          label: "Get Storage",
          command(editor) {
            getDataStorage(editor);
          },
        },
      ],
    });

    // const templateBlocks = blockData;
    const templateType = templateData;

    templateType?.forEach((x) =>
      editor.Components.addType(x.title, { ...x.data })
    );

    // templateBlocks?.forEach((block) => {
    //   editor.BlockManager.add(block.id, {
    //     label: block.label,
    //     content: block.content,
    //     category: block.category,
    //     media: block.media,
    //   });
    // });

    if (state?.message) {
      // const res = await getCollectionFirebase('templates', )
      const airesult = state?.message;
      const tamplateFull = airesult?.reduce((result, obj) => {
        return result + obj?.htmlContent;
      }, "");
      const templateBlocksFull = tamplateFull;

      console.log(templateBlocksFull, "pppp");

      editor.BlockManager.add("tamplate UI Full", {
        label: "tamplate UI Full",
        content: tamplateFull,
        category: "Your AI Blocks",
        media: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="header"><path d="M13 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 11H3V3h10v10z"></path><path d="M4 4h8v3H4z"></path></svg>`,
      });
    }

    editor.Panels.addPanel({
      id: "panel-top",
      el: ".panel__top",
    });

    editor.Panels.addPanel({
      id: "basic-actions",
      el: ".panel__basic-actions",
      buttons: [
        {
          id: "create-button",
          active: false,
          label: "<u>Fonts</u>",
          command(editor) {
            editor.runCommand("open-fonts");
          },
        },
        {
          id: "save-button",
          active: false,
          className: "btn-toggle-borders",
          label: "<button>Save</button>",

          async command(editor) {
            try {
              const data = await editor.store();

              await updateDocumentFirebase(
                `funnels/${param.id}/page`,
                `${param.pageId}`,
                {
                  message: [
                    { htmlContent: editor.getHtml(), css: editor.getCss() },
                  ],
                },
                globalState.currentCompany
              );

              const response = await addDocumentFirebase(
                `funnels/${param.id}/page/${param.pageId}/html`,
                { html: editor.getHtml(), css: editor.getCss() },
                globalState.currentCompany
              );
              console.log(response, "ini id");

              toast({
                title: "Success",
                description: "Data successfully saved",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            } catch (error) {
              console.log(error.message);
              toast({
                title: "Error",
                description: "Failed to save data",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          },
        },
      ],
    });

    editor.Panels.addButton("options", {
      id: "open-templates",
      className: "fa fa-folder-o",
      attributes: {
        title: "Open projects and templates",
      },
      command: "open-templates", //Open modal
    });

    editor.Panels.addButton("views", {
      id: "open-pages",
      className: "fa fa-file-o",
      attributes: {
        title: "Take Screenshot",
      },
      command: "open-pages",
      togglable: false,
    });

    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <Stack p={[1, 1, 5]} w="full" h="100vh" spacing={5}>
      <HStack>
        <BackButtons />
        <Spacer />
        <Heading textTransform={"capitalize"} size="md">
          {state?.title} - {state?.title_page}
        </Heading>
      </HStack>
      <div style={{ paddingBottom: 50 }}>
        <div className="panel__top">
          <div className="panel__basic-actions" />
        </div>
        <div id="gjs" />
      </div>
    </Stack>
  );
}

export default FunnelEditPageV2;
