require("dotenv").config();
import {
  existsSync,
  copyFileSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { safeLoad, safeDump } from "js-yaml";
import { plural, singular } from "pluralize";
import { capitalize, removeFromArray } from "../technical";
import replace from "replace";

const launchReplace = (component: string, destPath: string) => {
  replace({
    regex: "..Generators..",
    replacement: plural(capitalize(component.toLowerCase())),
    paths: [destPath],
    recursive: true,
    silent: true,
  });

  replace({
    regex: "..generators..",
    replacement: plural(component.toLowerCase()),
    paths: [destPath],
    recursive: true,
    silent: true,
  });

  replace({
    regex: "..Generator..",
    replacement: singular(capitalize(component.toLowerCase())),
    paths: [destPath],
    recursive: true,
    silent: true,
  });

  replace({
    regex: "..generator..",
    replacement: singular(component.toLowerCase()),
    paths: [destPath],
    recursive: true,
    silent: true,
  });
};

export function generateComponentDoc(component: string, path: string) {
  try {
    const destPath = `${path}/_${plural(component.toLowerCase())}.yml`;
    if (!existsSync(destPath)) {
      copyFileSync(`./generator/template/component-doc.yml`, destPath);
      launchReplace(component, destPath);
      console.log(`${destPath} has been created`);
    } else {
      console.log(`${destPath} already exists`);
    }
  } catch (err) {
    console.error(err);
  }
}

export function build({
  path,
  destPath,
  order,
  exlude,
}: {
  path: string;
  destPath: string;
  order?: string[];
  exlude?: string[];
}) {
  const componentsDoc = readdirSync(path);
  if (order && Array.isArray(order)) {
    componentsDoc.sort(function (a, b) {
      return order.indexOf(a) - order.indexOf(b);
    });
  }
  removeFromArray(componentsDoc, "_header.yml");
  if (exlude && Array.isArray(exlude)) {
    for (const item of exlude) {
      removeFromArray(componentsDoc, item);
    }
  }

  const headerComponent = safeLoad(readFileSync(`${path}/_header.yml`, "utf8"));
  headerComponent.servers[0].url = `http://localhost:${process.env.PORT_DEV}/api`;
  //init keys if null
  if (!headerComponent.tags) {
    headerComponent.tags = [];
  }
  if (!headerComponent.paths) {
    headerComponent.paths = {};
  }

  if (!headerComponent.components.responses) {
    headerComponent.components.responses = {};
  }

  if (!headerComponent.components.schemas) {
    headerComponent.components.schemas = {};
  }

  for (const component of componentsDoc) {
    try {
      const componentDoc = safeLoad(
        readFileSync(`${path}/${component}`, "utf8")
      );

      if (componentDoc.tags) {
        headerComponent.tags = headerComponent.tags.concat(componentDoc.tags);
      }
      if (componentDoc.paths) {
        headerComponent.paths = Object.assign(
          headerComponent.paths,
          componentDoc.paths
        );
      }
      if (componentDoc.components.schemas) {
        headerComponent.components.schemas = Object.assign(
          headerComponent.components.schemas,
          componentDoc.components.schemas
        );
      }
      if (componentDoc.components.responses) {
        headerComponent.components.schemas = Object.assign(
          headerComponent.components.responses,
          componentDoc.components.responses
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
  writeFileSync(`${destPath}/api-doc.yml`, safeDump(headerComponent), "utf8");
  console.log("#### Doc has been build ####");
}
