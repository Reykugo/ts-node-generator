import { generateComponentDoc } from "./doc-builder";
import { readConfig, Config } from "../technical";
import { build as buildDoc } from "../scripts/doc-builder";
import path from "path";

export function doc(component: string, path: string) {
  generateComponentDoc(component, path);
}

export function build(configPath: string) {
  const config: Config = readConfig(path.resolve(process.cwd(), configPath));
  buildDoc({
    path: path.resolve(process.cwd(), config.doc.componentsPath),
    destPath: path.resolve(process.cwd(), config.doc.destPath),
    order: config.doc.order,
    exlude: config.doc.exlude,
  });
}
