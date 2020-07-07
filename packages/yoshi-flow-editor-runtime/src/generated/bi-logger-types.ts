// This is a default bi loggers declaration.
// This file will be overriden on user's side on 'yoshi-flow-editor' postinall hook
// or during 'start' and 'build' commands.

export type OwnerLogger = any;
export type VisitorLogger = any;
export type OwnerBILoggerFactory = (
  factory: any,
) => (opts?: any) => OwnerLogger;
export type VisitorBILoggerFactory = (
  factory: any,
) => (opts?: any) => VisitorLogger;
