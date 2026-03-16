import { ReactNode } from "react";

export interface AppRoute {
  path?: string;

  element?: ReactNode;

  index?: boolean;

  children?: AppRoute[];

  meta?: {
    title?: string;
    
    icon?: ReactNode;

    hide?: boolean;

    permission?: string;

    public?: boolean;
  };
}
