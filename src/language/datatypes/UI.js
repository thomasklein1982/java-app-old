import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineUIClazzes(Java){
  defineJComponent(Java.datatypes.JComponent,Java);
  defineJButton(Java.datatypes.JButton,Java);
  defineJLabel(Java.datatypes.JLabel,Java);
  defineJTextArea(Java.datatypes.JTextArea,Java);
  defineJTextField(Java.datatypes.JTextField,Java);
  defineJCombobox(Java.datatypes.JCombobox,Java);
}

function defineJComponent(Clazz,Java){
  createAttribute({
    name: "value",
    type: Java.datatypes.String,
  },Clazz,false,Java);
  createAttribute({
    name: "visible",
    type: Java.datatypes.boolean,
  },Clazz,false,Java);
}

function defineJButton(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'label'}, {type: 'double', name: 'x'}, {type: 'double', name: 'y'}, {type: 'double', name: 'width'}, {type: 'double', name: 'height'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  
}

function defineJLabel(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'text'}, {type: 'double', name: 'x'}, {type: 'double', name: 'y'}, {type: 'double', name: 'width'}, {type: 'double', name: 'height'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  
}

function defineJTextField(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'type'}, {type: 'String', name: 'placeholder'}, {type: 'double', name: 'x'}, {type: 'double', name: 'y'}, {type: 'double', name: 'width'}, {type: 'double', name: 'height'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  
}

function defineJTextArea(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'placeholder'}, {type: 'double', name: 'x'}, {type: 'double', name: 'y'}, {type: 'double', name: 'width'}, {type: 'double', name: 'height'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  
}

function defineJCombobox(Clazz,Java){
  createConstructor ({
    args: [
      {type: {baseType: 'String', dimension: 1}, name: 'options'}, {type: 'double', name: 'x'}, {type: 'double', name: 'y'}, {type: 'double', name: 'width'}, {type: 'double', name: 'height'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  
}