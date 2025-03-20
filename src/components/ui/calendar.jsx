// import * as React from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { DayPicker } from "react-day-picker"

// import { cn } from "@/lib/utils"
// import { buttonVariants } from "@/components/ui/button"

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }) {
//   return (
//     (<DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-3", className)}
//       classNames={{
//         months: "flex flex-col sm:flex-row gap-2",
//         month: "flex flex-col gap-4",
//         caption: "flex justify-center pt-1 relative items-center w-full",
//         caption_label: "text-sm font-medium",
//         nav: "flex items-center gap-1",
//         nav_button: cn(
//           buttonVariants({ variant: "outline" }),
//           "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
//         ),
//         nav_button_previous: "absolute left-1",
//         nav_button_next: "absolute right-1",
//         table: "w-full border-collapse space-x-1",
//         head_row: "flex",
//         head_cell:
//           "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
//         row: "flex w-full mt-2",
//         cell: cn(
//           "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
//           props.mode === "range"
//             ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
//             : "[&:has([aria-selected])]:rounded-md"
//         ),
//         day: cn(
//           buttonVariants({ variant: "ghost" }),
//           "size-8 p-0 font-normal aria-selected:opacity-100"
//         ),
//         day_range_start:
//           "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
//         day_range_end:
//           "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
//         day_selected:
//           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//         day_today: "bg-accent text-accent-foreground",
//         day_outside:
//           "day-outside text-muted-foreground aria-selected:text-muted-foreground",
//         day_disabled: "text-muted-foreground opacity-50",
//         day_range_middle:
//           "aria-selected:bg-accent aria-selected:text-accent-foreground",
//         day_hidden: "invisible",
//         ...classNames,
//       }}
//       components={{
//         IconLeft: ({ className, ...props }) => (
//           <ChevronLeft className={cn("size-4", className)} {...props} />
//         ),
//         IconRight: ({ className, ...props }) => (
//           <ChevronRight className={cn("size-4", className)} {...props} />
//         ),
//       }}
//       {...props} />)
//   );
// }

// export { Calendar }


// import React from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { DayPicker } from "react-day-picker";

// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";

// function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-3", className)}
//       classNames={{
//         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
//         month: "space-y-4",
//         caption: "flex justify-center pt-1 relative items-center",
//         caption_label: "text-sm font-medium",
//         nav: "space-x-1 flex items-center",
//         nav_button: cn(
//           buttonVariants({ variant: "outline" }),
//           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
//         ),
//         nav_button_previous: "absolute left-1",
//         nav_button_next: "absolute right-1",
//         table: "w-full border-collapse space-y-1",
//         head_row: "flex",
//         head_cell:
//           "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
//         row: "flex w-full mt-2",
//         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//         day: cn(
//           buttonVariants({ variant: "ghost" }),
//           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
//         ),
//         day_range_end: "day-range-end",
//         day_selected:
//           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//         day_today: "bg-accent text-accent-foreground",
//         day_outside:
//           "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
//         day_disabled: "text-muted-foreground opacity-50",
//         day_range_middle:
//           "aria-selected:bg-accent aria-selected:text-accent-foreground",
//         day_hidden: "invisible",
//         ...classNames,
//       }}
//       components={{
//         IconLeft: (props) => <ChevronLeft className="h-4 w-4" {...props} />,
//         IconRight: (props) => <ChevronRight className="h-4 w-4" {...props} />,
//       }}
//       {...props}
//     />
//   );
// }

// export { Calendar };
// src/components/ui/calendar.jsx
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)} // Increased padding
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        caption: " justify-between items-center w-full py-2 px-4",
        caption_label: "text-base font-medium", // Larger font for month/year
        nav: "items-start gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full" // Larger buttons, rounded
        ),
        nav_button_previous: "relative", // Removed absolute positioning
        nav_button_next: "relative", // Removed absolute positioning
        table: "w-full border-collapse",
        head_row: "flex gap-1", // Added gap between day names
        head_cell: "text-muted-foreground rounded-md w-10 h-10 flex items-center justify-center font-normal text-sm", // Larger cells for day names
        row: "flex w-full mt-1 gap-1", // Added gap between rows
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-10 p-0 font-normal aria-selected:opacity-100 rounded-full" // Larger day cells, rounded
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-semibold", // Highlight today
        day_outside:
          "day-outside text-muted-foreground opacity-50", // Faded outside days
        day_disabled: "text-muted-foreground opacity-30", // More faded disabled days
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-5", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-5", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
