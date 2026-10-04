import { ReactNode } from "react";

// No entrance animations: content is simply there when you scroll to it.
interface Props {
  children: ReactNode;
  className?: string;
}

const AnimatedSection = ({ children, className = "" }: Props) => (
  <div className={className}>{children}</div>
);

export default AnimatedSection;
