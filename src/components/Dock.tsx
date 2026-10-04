import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

// macOS-style dock: icons magnify as the pointer approaches.
// Same interaction as magicui.design/docs/components/dock

interface DockIconProps extends HTMLMotionProps<"div"> {
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: ReactNode;
}

type DockIconComponent = ComponentType<DockIconProps>;

interface DockProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  magnification?: number;
  distance?: number;
}

const Dock = forwardRef<HTMLDivElement, DockProps>(
  ({ className, children, magnification = 56, distance = 120, ...props }, ref) => {
    const mouseX = useMotionValue(Infinity);

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn("mx-auto flex h-full w-max items-end rounded-full border p-2", className)}
      >
        {Children.map(children, (child) =>
          isValidElement(child) && (child.type as { displayName?: string }).displayName === "DockIcon"
            ? cloneElement(child as ReactElement<DockIconProps>, { mouseX, magnification, distance })
            : child,
        )}
      </motion.div>
    );
  },
);
Dock.displayName = "Dock";

const DockIcon = ({
  magnification = 56,
  distance = 120,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(mouseX ?? fallbackMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distanceCalc, [-distance, 0, distance], [40, magnification, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn("flex aspect-square cursor-pointer items-center justify-center rounded-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, type DockIconComponent };
