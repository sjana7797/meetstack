import { TRPCReactProvider } from "@/trcp/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function GlobalProvider({ children }: Readonly<Props>) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}

export default GlobalProvider;
