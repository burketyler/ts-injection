import "reflect-metadata";
import { injectIntoClass } from "../functions/injectIntoClass";
import { useInjectionContext } from "../functions/useInjectionContext";
import { useDebugger } from "../functions/useDebugger";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Inject");

export function Inject(token: string) {
  return (classCtor: any, member: string) => {
    logger.debug(
      `Attempting to inject ${token} into ${classCtor.constructor.name}.${member}.`
    );
    if (injectionCtx.isTokenInItems(token)) {
      logger.debug(`Found injectable, inserting into class.`);
      injectIntoClass(classCtor, member, injectionCtx.retrieveByToken(token));
    } else {
      addAutoWireCallback(classCtor, member, token);
    }
  };
}

function addAutoWireCallback(
  classCtor: any,
  member: string,
  token: string
): void {
  logger.debug(
    `Class isn't available yet, adding AutoWire callback for when it becomes available.`
  );
  injectionCtx.addAutoWire({
    class: classCtor,
    member,
    token: token,
  });
}
