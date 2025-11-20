export type Rule<Args extends any[] = any[]> = (...args: Args) => RuleReturn | Promise<RuleReturn>
export type RuleReturn = boolean | Record<string, Rule> | Record<string, Rule[]> | Rule[]
export type ReturnRuleType<T extends Rule> = Awaited<ReturnType<T>>

export type Ability<R extends Rule | Rule[]> = {
  (...args: AbilityParams<R>): Promise<boolean>
  options?: RuleOptions<R>
  readonly authorizer: boolean
}
export type AbilityParams<T> = T extends Rule
  ? [
      ...Parameters<T>,
      ...(
      // Object -> Func
        ReturnRuleType<T> extends Record<string, Rule>
          ? {
              [K in keyof Awaited<ReturnType<T>>]: [K, ...AbilityParams<ReturnRuleType<T>[K]>]
            }[keyof ReturnRuleType<T>]
        // Object -> Array
          : ReturnRuleType<T> extends Record<string, Rule[]>
            ? {
                [K in keyof ReturnRuleType<T>]: [K, ...{ [I in keyof Awaited<ReturnType<T>>[K]]: AbilityParams<ReturnRuleType<T>[K][I]> }[number][]]
              }[keyof ReturnRuleType<T>]
              // Array
            : ReturnRuleType<T> extends Rule[]
              ? {
                  [I in keyof ReturnRuleType<T>]: AbilityParams<ReturnRuleType<T>[I]>
                }[number][]
              : []
      ),
    ]
  : T extends Rule[]
    ? { [K in keyof T]: T[K] extends Rule ? AbilityParams<T[K]> : never }
    : never

export type OnAuthorized = () => void
export type OnUnauthorized = (message: string, statusCode: number) => void

export interface RuleOptions<R extends Rule | Rule[]> {
  /** HTTP status code for unauthorized */
  statusCode?: number
  /** Message for nnauthorized */
  message?: string
  /** Callback if authorized */
  onAuthorized?: OnAuthorized
  /** Callback if unauthorized */
  onUnauthorized?: OnUnauthorized
  /** Custom executor logic */
  executor?: (rule: R, args: AbilityParams<R>) => boolean | Promise<boolean>
}

export type AbilityOrRuleParams<T> = T extends Ability<any>
  ? Parameters<T>
  : T extends Rule | Rule[]
    ? AbilityParams<T>
    : never
