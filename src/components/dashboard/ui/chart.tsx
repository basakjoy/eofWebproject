"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

// Themes

const THEMES = {
  light: "",
  dark: ".dark",
} as const;

// Types

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

// Context

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within <ChartContainer />");
  }
  return context;
}

// Chart container

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});

ChartContainer.displayName = "ChartContainer";

//  Styles

const ChartStyle = ({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}) => {
  const entries = Object.entries(config).filter(
    ([_, value]) => value.color || value.theme
  );

  if (!entries.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, selector]) => `
${selector} [data-chart="${id}"] {
${entries
  .map(([key, item]) => {
    const color =
      item.theme?.[theme as keyof typeof item.theme] || item.color;
    return color ? `--color-${key}: ${color};` : "";
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

// Tooltip

export const ChartTooltip = RechartsPrimitive.Tooltip;

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    active?: boolean;
    payload?: any[];
    label?: any;
    hideLabel?: boolean;
    indicator?: "dot" | "line" | "dashed";
    nameKey?: string;
    labelKey?: string;
    labelFormatter?: (label: any, payload: any[]) => React.ReactNode;
    className?: string;
  }
>(
  (
    {
      active,
      payload,
      indicator = "dot",
      hideLabel,
      label,
      labelFormatter,
      className,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background px-3 py-2 text-xs shadow",
          className
        )}
      >
        {!hideLabel && label && (
          <div className="mb-1 font-medium">
            {labelFormatter ? labelFormatter(label, payload) : label}
          </div>
        )}

        <div className="space-y-1">
          {payload.map((item: any, index: number) => {
            const key = String(item.dataKey || item.name || index);
            const cfg = config[key];
            const color = item.color;

            return (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {cfg?.icon ? (
                    <cfg.icon className="h-3 w-3" />
                  ) : (
                    <span
                      className={cn(
                        "h-2 w-2 rounded",
                        indicator === "line" && "w-4 h-[2px]"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  )}
                  <span className="text-muted-foreground">
                    {cfg?.label || item.name}
                  </span>
                </div>
                <span className="font-mono font-medium">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ChartTooltipContent.displayName = "ChartTooltipContent";

/* -------------------------------- LEGEND -------------------------------- */

export const ChartLegend = RechartsPrimitive.Legend;

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  {
    payload?: any[];
    className?: string;
  }
>(({ payload, className }, ref) => {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn("flex justify-center gap-4 pt-3", className)}
    >
      {payload.map((item: any, index: number) => {
        const key = String(item.dataKey || item.value || index);
        const cfg = config[key];
        return (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            {cfg?.icon ? (
              <cfg.icon className="h-3 w-3" />
            ) : (
              <span
                className="h-2 w-2 rounded"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-xs">{cfg?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
});

ChartLegendContent.displayName = "ChartLegendContent";