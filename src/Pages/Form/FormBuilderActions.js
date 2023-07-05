import $ from "jquery";
import "formBuilder";

export const performAction = (formBuilderRef, actionName) => {
  const instance = $(formBuilderRef.current).formBuilder("actions");

  if(actionName === 'saveData'){
    instance.save();
  } else {
    instance[actionName]();
  }
};