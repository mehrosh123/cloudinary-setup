import React from "react";
import { ThemedLayoutV2 } from "@refinedev/antd";

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemedLayoutV2>
            {children}
        </ThemedLayoutV2>
    );
};