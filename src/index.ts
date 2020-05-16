import { build } from "./scripts/generator";
import minimist from "minimist";

const args = minimist(process.argv.slice(2), {
  string: ["config"],
  alias: { g: "generate", b: "build" },
  boolean: ["build", "doc", "generate"],
  stopEarly: true,
});

if (!args.config) {
  console.error("no config file declared");
} else if (!args.build && !args.generate) {
  console.warn("need argument '--build or --generate'");
} else {
  console.log("######GENERATOR######");
  if (args.build) build(args.config);
  console.log("#####################");
}
