import { ConfigLoader } from "./ConfigLoader";
import { OpenConnexion } from "./OpenConnexion";

const main = async () => {
  const configLoader = new ConfigLoader();
  await configLoader.load();

  const conf = configLoader.getConfig();

  new OpenConnexion(conf.host, conf.port, conf.name || "open");
};

main();
