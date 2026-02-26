"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "@/lib/utils";

// Panel group
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof Group>) => (
  <Group
    {...props}
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
  />
);

ResizablePanelGroup.displayName = "ResizablePanelGroup";

// Panel
const ResizablePanel = Panel;
ResizablePanel.displayName = "ResizablePanel";

// Separator (Resize handle)
const ResizableHandle = ({
  withHandle = true,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) => (
  <Separator
    {...props}
    className={cn(
      "relative flex w-px items-center justify-center bg-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 " +
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 " +
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full " +
        "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 " +
        "data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 " +
        "data-[panel-group-direction=vertical]:after:translate-x-0",
      className
    )}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </Separator>
);

ResizableHandle.displayName = "ResizableHandle";


export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
